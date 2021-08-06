import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";

const PaymentStatusDialog = ({ response, onButtonClick }) => {
  const isPaymentSuccess = () => {
    return response?.status === "succeeded";
  };

  return (
    <div>
      <div className='p-4 flex flex-row justify-between border-b-1'>
        <p className='text-subtitle2'>
          {isPaymentSuccess() ? "Payment Success" : "Payment Failure"}
        </p>
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
      <div className='p-4 py-6'>
        {publishProjectData?.success ? (
          <p className='text-overline2'>{`Project ${projectName} successfully published. You can now download the specs and artifacts.`}</p>
        ) : (
          <p className='text-overline2'>{publishProjectData?.message}</p>
        )}

        {publishProjectError && !isHavingPublishErrors() && (
          <p className='text-overline2'>{publishProjectError?.message}</p>
        )}

        {publishProjectError && isPublishLimitReached() && (
          <p className='text-overline2'>
            You have reached max publish limit, you need to contact the EzAPI
            team to publish this project.
          </p>
        )}

        {publishProjectError && isFreePublishesExhausted() && (
          <p className='text-overline2'>
            You have reached your published project limit. You can still publish
            this project by upgrading.
          </p>
        )}
      </div>
      <div className='p-4 border-t-1 flex flex-row justify-end'>
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
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            onButtonClick();
          }}
        >
          OK
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PaymentStatusDialog;
