import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import { CircularProgress } from "@material-ui/core";

import AppIcon from "../shared/components/AppIcon";
import { ReactComponent as SuccessLogo } from "../static/images/success-icon.svg";
import { ReactComponent as FailureLogo } from "../static/images/failure-icon.svg";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import { PaymentStatus } from "./paymentUtils";

const PaymentStatusDialog = ({
  onButtonClick,
  onClose,
  confirmPaymentMutation: {
    isLoading: isConfirmingPayment,
    error: confirmPaymentError,
    isSuccess: isConfirmPaymentSuccess,
    data: confirmPaymentData,
    mutate: confirmPayment,
    reset: resetConfirmPayment,
  },
  initiatePaymentMutation: {
    isLoading: isInitiatingPayment,
    error: initiatePaymentError,
    data: initiatePaymentData,
    isSuccess: isInitiatePaymentSuccess,
    mutate: initiatePayment,
    reset: resetInitiatePayment,
  },
}) => {
  const isPaymentSuccess = () => {
    return (
      isConfirmPaymentSuccess &&
      confirmPaymentData?.paymentIntent?.status === "succeeded"
    );
  };

  const getContentMessage = () => {
    if (isInitiatingPayment) {
      return "Initialising Payment";
    } else if (initiatePaymentError) {
      return initiatePaymentError?.message;
    } else if (isConfirmingPayment) {
      return "Confirming Payment";
    } else if (isPaymentSuccess()) {
      return "Payment successful";
    } else if (!isPaymentSuccess()) {
      return (
        confirmPaymentData?.error?.message + " Please try again." ??
        confirmPaymentError?.message + " Please try again." ??
        "Something went wrong while making payment, please try again."
      );
    }

    return "-";
  };

  return (
    <div>
      <div className='p-4 flex flex-row justify-between border-b-1'>
        <p className='text-subtitle2'>
          {isInitiatingPayment
            ? "Payment Initialisation"
            : initiatePaymentError || confirmPaymentError
            ? "Payment Failure"
            : isConfirmingPayment
            ? "Payment Confirmation"
            : isPaymentSuccess()
            ? "Payment Success"
            : "Payment Failure"}
        </p>
        {!isInitiatingPayment && !isConfirmingPayment && (
          <AppIcon
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();

              onClose();
            }}
          >
            <CloseIcon />
          </AppIcon>
        )}
      </div>

      <div className='p-4 py-6'>
        {isPaymentSuccess() ? (
          <div className='w-full flex flex-col items-center justify-center mb-3'>
            <SuccessLogo className='mb-2' />
            <p className='text-subtitle2'>Successful!</p>
          </div>
        ) : (initiatePaymentError ||
            confirmPaymentError ||
            !isPaymentSuccess()) &&
          !isInitiatingPayment &&
          !isConfirmingPayment ? (
          <div className='w-full flex flex-col items-center justify-center mb-3'>
            <FailureLogo className='mb-2' />
            <p className='text-subtitle2'>Failure!</p>
          </div>
        ) : null}

        <p className='text-overline2'>{getContentMessage()}</p>
      </div>

      <div className='p-4 border-t-1 flex flex-row justify-end'>
        {!isInitiatingPayment && !isConfirmingPayment ? (
          <PrimaryButton
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();

              onButtonClick();
            }}
          >
            OK
          </PrimaryButton>
        ) : (
          <CircularProgress size={24} />
        )}
      </div>
    </div>
  );
};

export default PaymentStatusDialog;
