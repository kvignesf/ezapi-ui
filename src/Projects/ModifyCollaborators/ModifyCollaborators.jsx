import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import _ from 'lodash';

import AppIcon from '../../shared/components/AppIcon';
import InviteCollaborators from '../../shared/components/InviteCollaborators';
import { PrimaryButton } from '../../shared/components/AppButton';
import InitialsAvatar from '../../shared/components/InitialsAvatar';

const ExistingCollaborator = ({ collab }) => {
  return (
    <div className='flex flex-row items-center mb-2'>
      <InitialsAvatar
        firstName={collab?.firstName}
        lastName={collab?.lastName}
        className='border-none mr-3'
      />

      <div className='flex flex-col w-full'>
        <p className='text-mediumLabel'>
          {collab?.firstName} {collab?.lastName}
        </p>
        <p className='text-overline2 text-neutral-gray4'>{collab?.email}</p>
      </div>

      <AppIcon onClick={() => {}}>
        <MoreVertIcon />
      </AppIcon>
    </div>
  );
};

const ModifyCollaborators = ({ invitedCollaborators, onClose }) => {
  const handleCollaboratorsChange = (newCollabs) => {};

  const handleSendInvite = () => {};

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
          style={{ width: '100%', marginRight: '1rem' }}
        />
        <PrimaryButton classes='self-end' onClick={handleSendInvite}>
          Send Invite
        </PrimaryButton>
      </div>

      {!_.isEmpty(invitedCollaborators) ? (
        <div className='border-t-2 pt-3'>
          {invitedCollaborators?.map((collab) => {
            return <ExistingCollaborator collab={collab} />;
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ModifyCollaborators;
