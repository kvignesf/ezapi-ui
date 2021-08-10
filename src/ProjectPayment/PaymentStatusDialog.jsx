import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import { PaymentStatus } from "./paymentUtils";
import { CircularProgress } from "@material-ui/core";

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
        confirmPaymentData?.error?.message ??
        confirmPaymentError?.message ??
        "Something went wrong while making payment"
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
