import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

import { PrimaryButton, TextButton } from '../../shared/components/AppButton';
import AppIcon from '../../shared/components/AppIcon';

const DeleteProject = ({ project, onClose }) => {
  return (
    <>
      <div className='flex flex-row justify-between items-center px-4 py-2 mb-2'>
        <h5>Delete Project</h5>

        <AppIcon onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <p className='px-4 pb-4 text-body2'>{`Are you sure want to delete “${project?.name}” API project? Once deleted you can’t get it back.`}</p>

      <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end p-4'>
        <TextButton
          onClick={() => {
            onClose();
          }}
          classes='mr-3'
        >
          Cancel
        </TextButton>

        <PrimaryButton type='submit' classes='bg-accent-red'>
          Delete
        </PrimaryButton>
      </div>
    </>
  );
};

export default DeleteProject;
