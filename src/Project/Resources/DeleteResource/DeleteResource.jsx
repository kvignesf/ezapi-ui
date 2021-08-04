import React from "react";
import { CircularProgress } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { useDeleteResource } from "./deleteResourceQuery";
import AppIcon from "../../../shared/components/AppIcon";
import {
  PrimaryButton,
  TextButton,
} from "../../../shared/components/AppButton";
import { useParams } from "react-router";

const DeleteResource = ({
  resource: { resourceId, resourceName },
  onClose,
}) => {
  const { id: projectId } = useParams();
  const {
    isLoading: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
    mutate: deleteItem,
  } = useDeleteResource();

  const handleOnDelete = () => {
    deleteItem({ resourceId, projectId });
  };

  if (isDeleteSuccess) {
    onClose();
    return null;
  }

  return (
    <div
      onClick={(event) => {
        event?.preventDefault();
        event?.stopPropagation();
      }}
    >
      <div className='flex flex-row justify-between items-center px-4 py-4 mb-2'>
        <h5>Delete Resource</h5>

        {!isDeleting && (
          <AppIcon onClick={onClose}>
            <CloseIcon />
          </AppIcon>
        )}
      </div>

      <>
        <p className='px-4 pb-4 text-body2'>{`Are you sure want to delete the resource “${resourceName}”? Once deleted you can’t get it back.`}</p>

        {deleteError && (
          <p className='text-accent-red text-overline2 my-2 ml-4'>
            {deleteError?.message}
          </p>
        )}

        <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end p-4'>
          {!isDeleting ? (
            <>
              <TextButton
                onClick={() => {
                  onClose();
                }}
                classes='mr-3'
              >
                Cancel
              </TextButton>

              <PrimaryButton
                type='submit'
                classes='bg-accent-red'
                onClick={handleOnDelete}
              >
                Delete
              </PrimaryButton>
            </>
          ) : (
            <CircularProgress size='24px' />
          )}
        </div>
      </>
    </div>
  );
};

export default DeleteResource;
