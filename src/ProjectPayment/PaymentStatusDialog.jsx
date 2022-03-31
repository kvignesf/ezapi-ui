import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import { CircularProgress } from "@material-ui/core";
import routes, { generateRoute } from "../shared/routes";
import AppIcon from "../shared/components/AppIcon";
import { ReactComponent as SuccessLogo } from "../static/images/success-icon.svg";
import { ReactComponent as FailureLogo } from "../static/images/failure-icon.svg";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import { PaymentStatus } from "./paymentUtils";
import Messages from "../shared/messages";
import { useHistory, useLocation, useParams } from "react-router-dom";

const PaymentStatusDialog = ({
  response,
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
}) => {
  const history = useHistory();
  console.log(response);
  const isPaymentSuccess = () => {
    if (response == 200) {
      return true;
    } else {
      return false;
    }
  };

  const getContentMessage = () => {
    if (isConfirmingPayment) {
      return "Confirming Payment";
    } else if (isPaymentSuccess()) {
      return "Payment successful";
    } else if (!isPaymentSuccess()) {
      return (
        confirmPaymentData?.error?.message + " Please try again." ??
        confirmPaymentError?.message + " Please try again." ??
        Messages.PAYMENT_RETRY
      );
    }

    return "-";
  };

  return (
    <div>
      <div className="p-4 flex flex-row justify-between border-b-1">
        {!isConfirmingPayment && (
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

      <div className="p-4 py-6">
        {isPaymentSuccess() ? (
          <div className="w-full flex flex-col items-center justify-center mb-3">
            <SuccessLogo className="mb-2" />
            <p className="text-subtitle2">Successful!</p>
          </div>
        ) : (confirmPaymentError || !isPaymentSuccess()) &&
          !isConfirmingPayment ? (
          <div className="w-full flex flex-col items-center justify-center mb-3">
            <FailureLogo className="mb-2" />
            <p className="text-subtitle2">Failure!</p>
          </div>
        ) : (
          "idkidkidk"
        )}

        <p className="text-overline2">{getContentMessage()}</p>
      </div>

      <div className="p-4 border-t-1 flex flex-row justify-end">
        {!isConfirmingPayment ? (
          <PrimaryButton
            onClick={() => {
              if (isPaymentSuccess()) {
                // resetConfirmPayment();
                // resetInitiatePayment();
                // resetVerifyMutation();
                // resetPublishMutation();
                // invalidateProject();
                // navigateBack();
                console.log("back pls");
                history.push(routes.pricing);
              } else {
                console.log("wronggg");
                // handleCloseDialog();
              }
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
