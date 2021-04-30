import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GetAppIcon from '@material-ui/icons/GetApp';
import TimeAgo from 'react-timeago';
import _ from 'lodash';
import classNames from 'classnames';

import Dashboard from '../Dashboard';
import AppIcon from '../shared/components/AppIcon';
import { Dialog } from '@material-ui/core';
import AddProject from '../AddProject';
import InviteCollaborators from '../shared/components/InviteCollaborators';
import ModifyCollaborators from './ModifyCollaborators/ModifyCollaborators';
import InitialsAvatar from '../shared/components/InitialsAvatar';

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
                'rounded-full p-2 bg-brand-primarySubtle w-min',
                {
                  '-ml-2': index != 0,
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

const Content = () => {
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const projects = [
    {
      name: 'name1',
      members: [
        {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'first@last.com',
        },
        {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'first@last.com',
        },
        {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'first@last.com',
        },
        {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'first@last.com',
        },
      ],
      lastModifiedDate: '2021-04-30T13:50:27.87',
    },
    {
      name: 'name1',
      members: null,
      lastModifiedDate: '2021-04-30T13:50:27.87',
    },
    {
      name: 'name1',
      members: [
        {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'first@last.com',
        },
        {
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'first@last.com',
        },
      ],
      lastModifiedDate: '2021-04-30T13:50:27.87',
    },
  ];

  const showMembersDialog = (members) => {
    setDialog({
      show: true,
      type: 'members',
      data: members,
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
      type: null,
    });
  };

  return (
    <div className='p-3'>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='projects-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
      >
        {dialog?.type === 'members' && (
          <ModifyCollaborators
            onClose={handleCloseDialog}
            invitedCollaborators={dialog?.data}
          />
        )}
      </Dialog>

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
                <AppIcon>
                  <MoreVertIcon />
                </AppIcon>
              </td>
            </tr>
          );
        })}
      </table>
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
