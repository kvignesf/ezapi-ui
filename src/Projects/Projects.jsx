import React, { useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp";
import TimeAgo from "react-timeago";
import _ from "lodash";
import classNames from "classnames";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { Dialog } from "@material-ui/core";

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

const MembersImages = ({ members, ...rest }) => {
  return (
    <div className='flex flex-row cursor-pointer' {...rest}>
      {_.isEmpty(members) ? (
        <p className='capitalize text-brand-secondary text-overline2'>
          Invite Collaborators
        </p>
      ) : null}

      {members?.map((member, index) => {
        if (index < 3) {
          return (
            <InitialsAvatar
              firstName={member?.firstName}
              lastName={member?.lastName}
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

      {members?.length > 3 ? (
        <p className='text-overline2 self-center ml-2'>
          + {members?.length - 3} more
        </p>
      ) : null}
    </div>
  );
};

const Content = ({ showCreateProjectDialog }) => {
  const {
    data: fetchedProjects,
    isLoading: isFetchingProjects,
    error: fetchProjectsError,
    isFetching: isFetchingProjectsBg,
  } = useGetProjects();

  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const projects = [
    {
      name: "name1",
      members: [
        {
          firstName: "Firstname",
          lastName: "Lastname",
          email: "first@last.com",
        },
        {
          firstName: "Firstname",
          lastName: "Lastname",
          email: "first@last.com",
        },
        {
          firstName: "Firstname",
          lastName: "Lastname",
          email: "first@last.com",
        },
        {
          firstName: "Firstname",
          lastName: "Lastname",
          email: "first@last.com",
        },
      ],
      lastModifiedDate: "2021-04-30T13:50:27.87",
    },
    {
      name: "name1",
      members: null,
      lastModifiedDate: "2021-04-30T13:50:27.87",
    },
    {
      name: "name1",
      members: [
        {
          firstName: "Firstname",
          lastName: "Lastname",
          email: "first@last.com",
        },
        {
          firstName: "Firstname",
          lastName: "Lastname",
          email: "first@last.com",
        },
      ],
      lastModifiedDate: "2021-04-30T13:50:27.87",
    },
  ];

  const showMembersDialog = (members) => {
    setDialog({
      show: true,
      type: "members",
      data: members,
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

  const handleOnOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnView = (project) => {};

  const handleOnInvite = (project) => {
    showMembersDialog(project?.members);
  };

  const handleOnRename = (project) => {
    showRenameProjectDialog(project);
  };

  const handleOnDeleteApi = (project) => {
    showDeleteProjectDialog(project);
  };

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
      >
        {dialog?.type === "members" && (
          <ModifyCollaborators
            onClose={handleCloseDialog}
            invitedCollaborators={dialog?.data}
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
            <th className='rounded-tr-md rounded-br-md'></th>
          </tr>

          {projects.map((project) => {
            const datetime = new Date(project?.lastModifiedDate);

            return (
              <tr className='text-overline2'>
                <td className='p-3'>{project.name}</td>
                <td>
                  <MembersImages
                    members={project?.members}
                    onClick={() => {
                      showMembersDialog(project?.members);
                    }}
                  />
                </td>
                <td>
                  <TimeAgo date={datetime} />
                </td>

                <td align='right'>
                  <AppIcon onClick={handleOnOptionsClick}>
                    <MoreVertIcon />
                  </AppIcon>
                </td>

                <Menu
                  id='fade-menu'
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
                  </MenuItem>
                </Menu>
              </tr>
            );
          })}
        </table>
      )}

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
