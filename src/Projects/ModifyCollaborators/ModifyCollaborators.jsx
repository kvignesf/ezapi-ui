import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import _ from "lodash";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";

import AppIcon from "../../shared/components/AppIcon";
import Colors from "../../shared/colors";
import InviteCollaborators from "../../shared/components/InviteCollaborators";
import { PrimaryButton } from "../../shared/components/AppButton";
import InitialsAvatar from "../../shared/components/InitialsAvatar";
import {
  useUpdateProject,
  useInviteCollaborator,
} from "../updateProjectQueries";
import { CircularProgress } from "@material-ui/core";
import { getEmailId } from "../../shared/storage";

const ExistingCollaborator = ({ projectId, collab, handleDeletedCollab }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    isLoading: isUpdatingProject,
    isSuccess: isProjectUpdated,
    error: updateProjectError,
    data: updateProjectData,
    mutate: updateProject,
  } = useUpdateProject();
  const loggedInUserEmail = getEmailId();

  useEffect(() => {
    if (isProjectUpdated) {
      console.log("called", updateProjectData?.project?.invites);
      handleDeletedCollab(updateProjectData?.project?.invites);
    }
  }, [isProjectUpdated]);

  let firstName, lastName;

  if (collab?.userData?.firstName) {
    firstName = collab?.userData?.firstName;
  }

  if (collab?.userData?.lastName) {
    lastName = collab?.userData?.lastName;
  }

  if (!firstName || _.isEmpty(firstName)) {
    firstName = collab?.email?.charAt(0);
    lastName = collab?.email?.charAt(0);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnRemove = (collab) => {
    if (collab && !_.isEmpty(collab) && loggedInUserEmail !== collab?.email) {
      updateProject({ id: projectId, removeInvites: [collab] });
    }
  };

  return (
    <div className='flex flex-row items-center mb-2'>
      <InitialsAvatar
        firstName={firstName}
        lastName={lastName}
        className='border-none mr-3'
      />

      <div className='flex flex-col w-full'>
        <p className='text-mediumLabel capitalize'>
          {collab?.userData?.firstName} {collab?.userData?.lastName}{" "}
          {loggedInUserEmail === collab?.email ? " (you)" : ""}
        </p>

        <p className='text-overline2 text-neutral-gray3'>{collab?.email}</p>
      </div>

      {loggedInUserEmail !== collab?.email ? (
        !isUpdatingProject ? (
          <AppIcon
            onClick={(e) => {
              if (!isUpdatingProject) {
                handleClick(e);
              }
            }}
          >
            <MoreVertIcon />
          </AppIcon>
        ) : (
          <div className='mr-3 flex items-center justify-center'>
            <CircularProgress size='24px' />
          </div>
        )
      ) : null}

      <Menu
        id='fade-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleOnRemove(collab);
          }}
          style={{ color: Colors.accent.red }}
        >
          Remove
        </MenuItem>
      </Menu>
    </div>
  );
};

const ModifyCollaborators = ({ projectId, invitedCollaborators, onClose }) => {
  const {
    isLoading: isInvitingCollaborators,
    isSuccess: isInviteCollaboratorsSuccess,
    error: inviteCollaboratorsError,
    mutate: inviteCollaborators,
  } = useInviteCollaborator();

  const [toBeInvitedCollabs, setToBeInvitedCollabs] = useState([]);
  const [updatedInvitedCollabs, setUpdatedInvitedCollabs] = useState([]);
  const [isInvitedCollabsUpdated, setUpdated] = useState(false);

  const handleCollaboratorsChange = (newCollabs) => {
    setToBeInvitedCollabs(newCollabs);
  };

  const handleInviteCollabs = () => {
    if (toBeInvitedCollabs && !_.isEmpty(toBeInvitedCollabs)) {
      inviteCollaborators({ id: projectId, collaborators: toBeInvitedCollabs });
    }
  };

  const handleDeletedCollab = (updatedCollabs) => {
    setUpdatedInvitedCollabs(updatedCollabs);
    setUpdated(true);
  };

  const getInvitedCollabs = () => {
    if (isInvitedCollabsUpdated) {
      return updatedInvitedCollabs;
    }
    return invitedCollaborators;
  };

  if (isInviteCollaboratorsSuccess) {
    onClose();
    return null;
  }

  return (
    <div className='p-4'>
      <div className='flex flex-row justify-between items-center mb-3'>
        <h5>Invite Collaborators</h5>

        <AppIcon onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <div className='flex flex-row items-end mb-4'>
        <InviteCollaborators
          collaborators={toBeInvitedCollabs}
          handleChange={handleCollaboratorsChange}
          style={{ width: "100%", marginRight: "1rem" }}
        />

        {!isInvitingCollaborators ? (
          <PrimaryButton classes='self-end h-12' onClick={handleInviteCollabs}>
            Send Invite
          </PrimaryButton>
        ) : (
          <CircularProgress size='24px' className='mb-3' />
        )}
      </div>
      <p className='mb-3 text-overline2 text-accent-red'>
        {inviteCollaboratorsError?.message}
      </p>

      {!_.isEmpty(getInvitedCollabs()) ? (
        <div className='border-t-2 pt-3'>
          {getInvitedCollabs()?.map((collab) => {
            return (
              <ExistingCollaborator
                projectId={projectId}
                collab={collab}
                handleDeletedCollab={handleDeletedCollab}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ModifyCollaborators;
