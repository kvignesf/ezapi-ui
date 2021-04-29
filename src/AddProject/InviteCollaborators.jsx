import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { useRecoilState } from 'recoil';
import _ from 'lodash';

import projectAtom from './projectAtom';
import { isEmailValid } from '../shared/utils';
import Colors from '../shared/colors';

const InviteCollaborators = () => {
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);

  const handleChange = (collaborators) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.collaborators = [];
      collaborators.forEach((collaborator) => {
        if (
          !_.find(updatedProjectDetails.collaborators, collaborator) &&
          isEmailValid(collaborator)
        ) {
          updatedProjectDetails.collaborators.push(collaborator);
        }
      });

      console.log('collaborators', collaborators);

      return updatedProjectDetails;
    });
  };

  console.log('final collabs', projectDetails.collaborators);

  return (
    <div className='h-80 pt-4'>
      <p className='text-mediumLabel mb-2'>Invite users to collaborate</p>

      <ChipInput
        defaultValue={[]}
        dataSource={projectDetails?.collaborators}
        onChange={(chips) => handleChange(chips)}
        onBeforeAdd={(chip) => {
          return isEmailValid(chip);
        }}
        allowDuplicates={false}
        fullWidth
        disableUnderline
        color='primary'
        style={{
          border: `1px solid ${Colors.neutral.gray4}`,
          marginBottom: '1rem',
          borderRadius: '4px',
          padding: '0.25rem 0.75rem',
        }}
      />
    </div>
  );
};

export default InviteCollaborators;
