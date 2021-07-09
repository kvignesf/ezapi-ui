import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import Scrollbar from "react-smooth-scrollbar";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton } from "../shared/components/AppButton";

const ProjectVerificationErrors = ({ onClose, response }) => {
  return (
    <div
      className='flex flex-col'
      onClick={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
      }}
    >
      <div className='flex flex-row p-4 justify-between border-b-1'>
        <p className='text-subtitle2'>Project Validation Failure</p>
        <AppIcon
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            onClose();
          }}
        >
          <CloseIcon />
        </AppIcon>
      </div>

      <div className='p-4'>
        <p className='text-overline2 mb-2'>
          Looks like there are a few issues found in this project. Kindly
          resolve them to proceed.
        </p>
        <Scrollbar>
          <div className='max-h-96'>
            {response?.map((responseItem) => {
              return (
                <div className='mb-2'>
                  <p className='text-overline1 mb-1'>{`/${responseItem?.resource_name}/${responseItem?.path_name}/${responseItem?.operation_name}`}</p>

                  {responseItem?.errors?.map((errorMessage) => {
                    return (
                      <p className='text-overline2 mb-1 text-accent-red'>{`- ${errorMessage}`}</p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Scrollbar>
      </div>

      <div className='border-t-1 p-4 flex flex-row justify-end'>
        <PrimaryButton
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            onClose();
          }}
        >
          OK
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ProjectVerificationErrors;
