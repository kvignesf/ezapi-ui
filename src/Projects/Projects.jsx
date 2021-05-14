import React, { useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp";
import TimeAgo from "react-timeago";
import _ from "lodash";
import classNames from "classnames";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { CircularProgress, Dialog } from "@material-ui/core";

import Dashboard from "../Dashboard";
import AppIcon from "../shared/components/AppIcon";
import AddProject from "../AddProject";
import InviteCollaborators from "../shared/components/InviteCollaborators";
import ModifyCollaborators from "./ModifyCollaborators/ModifyCollaborators";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import Colors from "../shared/colors";
import RenameProject from "./RenameProject/RenameProject";
import DeleteProject from "./DeleteProject/DeleteProject";
import { useGetProjects } from "./listProjectQueries";
import EmptyLogo from "../static/images/empty-state.svg";
import { PrimaryButton } from "../shared/components/AppButton";
import LoaderWithMessage from "../shared/components/LoaderWithMessage";
import { getUserId } from "../shared/storage";
import routes, { generateRoute } from "../shared/routes";
import { useHistory } from "react-router";

const MembersImages = ({ project, ...rest }) => {
  const loggedInUserId = getUserId();

  return (
    <div className='flex flex-row cursor-pointer' {...rest}>
      {_.isEmpty(project?.invites) && loggedInUserId === project?.author ? (
        <p className='capitalize text-brand-secondary text-overline2'>
          Invite Collaborators
        </p>
      ) : null}

      {project?.invites?.map((member, index) => {
        if (index < 3) {
          let firstName, lastName;

          if (member?.userData?.firstName) {
            firstName = member?.userData?.firstName;
          }

          if (member?.userData?.lastName) {
            lastName = member?.userData?.lastName;
          }

          if (!firstName || _.isEmpty(firstName)) {
            firstName = member?.email?.charAt(0);
            lastName = member?.email?.charAt(0);
          }

          return (
            <InitialsAvatar
              key={member?.email}
              firstName={firstName}
              lastName={lastName}
              className={classNames(
                "rounded-full p-2 bg-brand-primarySubtle w-min",
                {
                  "-ml-2": index != 0,
                }
              )}
            />
          );
        }
        return null;
      })}

      {project?.invites?.length > 3 ? (
        <p className='text-overline2 self-center ml-2'>
          + {project?.invites?.length - 3} more
        </p>
      ) : null}
    </div>
  );
};

const ProjectRow = ({
  project,
  showMembersDialog,
  handleOnDeleteApi,
  handleOnView,
  handleOnInvite,
  handleOnRename,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const datetime = new Date(project?.updatedAt);
  const loggedInUserId = getUserId();

  const handleOnOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <tr className='text-overline2'>
      <td className='p-3'>{project?.projectName}</td>
      <td>
        <MembersImages
          project={project}
          onClick={() => {
            if (loggedInUserId === project?.author) {
              showMembersDialog(project);
            }
          }}
        />
      </td>
      <td>
        <TimeAgo date={datetime} />
      </td>

      <td></td>

      <td align='right'>
        <AppIcon onClick={handleOnOptionsClick}>
          <MoreVertIcon />
        </AppIcon>
      </td>

      {/* Profile options */}
      <Menu
        id={`fade-menu-${project?.projectName}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        TransitionComponent={Fade}
        style={{ borderRadius: "1rem" }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleOnView(project);
          }}
        >
          View
        </MenuItem>

        {loggedInUserId === project?.author && (
          <div>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleOnInvite(project);
              }}
            >
              Invite
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleOnRename(project);
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleOnDeleteApi(project);
              }}
              style={{ color: Colors.accent.red }}
            >
              Delete API
            </MenuItem>{" "}
          </div>
        )}
      </Menu>
    </tr>
  );
};

const Content = ({ showCreateProjectDialog }) => {
  const history = useHistory();
  const {
    data: projects,
    isLoading: isFetchingProjects,
    error: fetchProjectsError,
    isFetching: isFetchingProjectsBg,
  } = useGetProjects();

  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const showMembersDialog = (project) => {
    setDialog({
      show: true,
      type: "members",
      data: project,
    });
  };

  const showRenameProjectDialog = (project) => {
    setDialog({
      show: true,
      type: "rename-project",
      data: project,
    });
  };

  const showDeleteProjectDialog = (project) => {
    setDialog({
      show: true,
      type: "del-project",
      data: project,
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
      type: null,
    });
  };

  const handleOnView = (project) => {
    history.push(generateRoute(routes.projects, project?.projectId));
  };

  const handleOnInvite = (project) => {
    showMembersDialog(project);
  };

  const handleOnRename = (project) => {
    showRenameProjectDialog(project);
  };

  const handleOnDeleteApi = (project) => {
    showDeleteProjectDialog(project);
  };

  if (isFetchingProjects) {
    return <LoaderWithMessage message={"Fetching Projects"} />;
  }

  return (
    <div className='p-3 h-full'>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='projects-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "members" && (
          <ModifyCollaborators
            projectId={dialog?.data?.projectId}
            onClose={handleCloseDialog}
            invitedCollaborators={dialog?.data?.invites}
          />
        )}

        {dialog?.type === "rename-project" && (
          <RenameProject onClose={handleCloseDialog} project={dialog?.data} />
        )}

        {dialog?.type === "del-project" && (
          <DeleteProject onClose={handleCloseDialog} project={dialog?.data} />
        )}
      </Dialog>

      {projects && !_.isEmpty(projects) && (
        <table className='w-full'>
          <tr className='p-4 bg-neutral-gray6 w-full text-left text-neutral-gray4 text-mediumLabel'>
            <th className='w-1/4 p-2 rounded-tl-md rounded-bl-md'>NAME</th>
            <th className='w-1/3'>MEMBERS</th>
            <th className='w-1/3'>LAST ACTIVITY</th>
            <th></th>
            <th className='rounded-tr-md rounded-br-md'>
              {isFetchingProjectsBg && (
                <CircularProgress size='20px' className='ml-6' />
              )}
            </th>
          </tr>

          {projects.map((project) => {
            return (
              <ProjectRow
                project={project}
                showMembersDialog={showMembersDialog}
                handleOnRename={handleOnRename}
                handleOnInvite={handleOnInvite}
                handleOnView={handleOnView}
                handleOnDeleteApi={handleOnDeleteApi}
              />
            );
          })}
        </table>
      )}

      {/* Empty state */}
      {!projects ||
        (_.isEmpty(projects) && (
          <div className='h-full flex flex-col items-center justify-center'>
            <img
              src={EmptyLogo}
              className='mb-4'
              style={{ width: "100px", height: "100px" }}
            />

            <h5 className='mb-3'>No API project available</h5>

            <h6 className='mb-11 text-neutral-gray3'>
              Start creating a new API project
            </h6>

            <PrimaryButton
              onClick={() => {
                showCreateProjectDialog();
              }}
            >
              Create new API Project
            </PrimaryButton>
          </div>
        ))}
    </div>
  );
};

const Projects = () => {
  return (
    <Dashboard selectedIndex={1}>
      <Content />
    </Dashboard>
  );
};

export default Projects;
