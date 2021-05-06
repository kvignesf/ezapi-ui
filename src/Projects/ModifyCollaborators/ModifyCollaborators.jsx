import React, { useState } from "react";
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

const ExistingCollaborator = ({
  collab,
  onHandleOnRemove,
  optionsDisabled = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className='flex flex-row items-center mb-2'>
      <InitialsAvatar
        firstName={collab?.email?.charAt(0)}
        lastName={collab?.email?.charAt(1)}
        className='border-none mr-3'
      />

      <div className='flex flex-col w-full'>
        <p className='text-mediumLabel'>
          {collab?.firstName} {collab?.lastName}
        </p>
        <p className='text-overline2 text-neutral-gray3'>{collab?.email}</p>
      </div>

      {!optionsDisabled && (
        <AppIcon onClick={handleClick}>
          <MoreVertIcon />
        </AppIcon>
      )}

      <Menu
        id='fade-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClick}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onHandleOnRemove(collab);
          }}
          style={{ color: Colors.accent.red }}
        >
          Remove
        </MenuItem>
      </Menu>
    </div>
  );
};

const ModifyCollaborators = ({ invitedCollaborators, onClose }) => {
  const handleCollaboratorsChange = (newCollabs) => {};

  const handleOnRemove = (collab) => {
    console.log(collab);
  };

  return (
    <div className='p-4'>
      <div className='flex flex-row justify-between items-center'>
        <h5>Invite Collaborators</h5>

        <AppIcon onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <div className='flex flex-row items-end mb-4'>
        <InviteCollaborators
          collaborators={[]}
          handleChange={handleCollaboratorsChange}
          style={{ width: "100%", marginRight: "1rem" }}
        />
        <PrimaryButton classes='self-end h-12'>Send Invite</PrimaryButton>
      </div>

      {!_.isEmpty(invitedCollaborators) ? (
        <div className='border-t-2 pt-3'>
          {invitedCollaborators?.map((collab) => {
            return (
              <ExistingCollaborator
                collab={collab}
                onHandleOnRemove={handleOnRemove}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ModifyCollaborators;
