import React from "react";
import CloseIcon from "@material-ui/icons/Close";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton } from "../shared/components/AppButton";

const PublishProjectMessage = ({
  publishProjectError,
  publishProjectData,
  resetMutationState,
  closeSuccessMessage,
  projectName,
}) => {
  return (
    <div>
      <div className='p-4 flex flex-row justify-between border-b-1'>
        <p className='text-subtitle2'>
          {publishProjectData?.success
            ? "Publish Successful"
            : "Publish Failure"}
        </p>
        <AppIcon
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            if (publishProjectData?.success) {
              closeSuccessMessage();
            } else {
              resetMutationState();
            }
          }}
        >
          <CloseIcon />
        </AppIcon>
      </div>
      <div className='p-4 py-6'>
        {publishProjectData?.success ? (
          <p className='text-overline2'>{`Project ${projectName} successfully published. You can now download the specs and artifacts.`}</p>
        ) : (
          <p className='text-overline2'>{publishProjectData?.message}</p>
        )}

        {publishProjectError && (
          <p className='text-overline2'>{publishProjectError?.message}</p>
        )}
      </div>
      <div className='p-4 border-t-1 flex flex-row justify-end'>
        <PrimaryButton
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            if (publishProjectData?.success) {
              closeSuccessMessage();
            } else {
              resetMutationState();
            }
          }}
        >
          OK
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PublishProjectMessage;
