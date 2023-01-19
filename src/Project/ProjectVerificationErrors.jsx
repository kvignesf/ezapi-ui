import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import Scrollbar from "react-smooth-scrollbar";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import routes from '../shared/routes';
import { useHistory } from 'react-router-dom';

const ProjectVerificationErrors = ({ onClose, error }) => {
  /* const getLocationName = (responseItem) => {
    let location;

    if (responseItem?.resource_name) {
      location = "/" + responseItem?.resource_name;
    }

    if (responseItem?.path_name) {
      location += "/" + responseItem?.path_name;
    }

    if (responseItem?.operation_name) {
      location += "/" + responseItem?.operation_name;
    }

    return location;
  }; */
  const history = useHistory();

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
        <div className="max-h-96">
          <p className="text-overline2 mb-1 text-accent-red">{`- ${
            error?.message ?? ""
          }`}</p>
        </div>
      </div>
      <div className="border-t-1 p-4 flex flex-row justify-end">
        {error?.message.includes("upgrade") ?
        < >
        <TextButton
        onClick={(e) => {
          e?.preventDefault();
          e?.stopPropagation();

          onClose();
        }}
      >
        Cancel
      </TextButton>
      
        <PrimaryButton
          onClick={() => {
          history.push(routes.pricing);
          }
        }>
          Upgrade
        </PrimaryButton>
        </>
        :
        
        <PrimaryButton
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            onClose();
          }}
        >
          OK
        </PrimaryButton>
        }
      </div>
    </div>
  );
};

export default ProjectVerificationErrors;