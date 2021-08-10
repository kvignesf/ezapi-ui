import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  CircularProgress,
  Dialog,
  Fade,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import AppIcon from "../shared/components/AppIcon";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import LoaderWithMessage from "../shared/components/LoaderWithMessage";
import ErrorWithMessage from "../shared/components/ErrorWithMessage";
import { useFetchProjectDetails } from "../Project/projectQueries";
import { useCanEdit } from "../shared/utils";
import { getFirstName, getLastName, getEmailId } from "../shared/storage";
import Colors from "../shared/colors";
import { useLogout } from "../shared/query/authQueries";
import {
  useConfirmPayment,
  useGetBasicProduct,
  useGetProducts,
  useInitiatePayment,
  useMakePayment,
} from "./paymentQueries";
import BillingDetailsForm from "./BillingDetailsForm";
import CardDetailsForm from "./CardDetailsForm";
import ProductDetails from "./ProductDetails";
import PaymentStatusDialog from "./PaymentStatusDialog";
import { PaymentStatus } from "./paymentUtils";

const ProjectPayment = () => {
  const { id: projectId } = useParams();
  const history = useHistory();
  const {
    isLoading: isFetchingProjectDetails,
    isFetching: isFetchingProjectDetailsBg,
    isSuccess: isProjectDetailsFetched,
    error: projectDetailsError,
    data: projectDetails,
  } = useFetchProjectDetails(projectId, {
    refetchOnWindowFocus: false,
  });
  // const {
  //   isLoading: isFetchingProducts,
  //   isFetching: isFetchingProductsBg,
  //   error: productsError,
  //   data: productsData,
  // } = useGetProducts(projectId);
  const {
    isLoading: isFetchingBasicProduct,
    isFetching: isFetchingBasicProductBg,
    error: getBasicProductError,
    data: basicProductData,
  } = useGetBasicProduct();
  const initiatePaymentMutation = useInitiatePayment();
  const confirmPaymentMutation = useConfirmPayment();
  const [userRole, setRole] = useState(null);
  const firstName = getFirstName();
  const lastName = getLastName();
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);
  const { isLoading: isLoggingOut, mutate: logout } = useLogout();
  const [dialog, setDialog] = useState({
    show: false,
    data: null,
    type: null,
  });
  const billingDetailsRef = useRef();
  const cardDetailsRef = useRef();
  const stripe = useStripe();
  const elements = useElements();
  const {
    isLoading: isInitiatingPayment,
    error: initiatePaymentError,
    data: initiatePaymentData,
    isSuccess: isInitiatePaymentSuccess,
    mutate: initiatePayment,
    reset: resetInitiatePayment,
  } = initiatePaymentMutation;
  const {
    isLoading: isConfirmingPayment,
    error: confirmPaymentError,
    isSuccess: isConfirmPaymentSuccess,
    data: confirmPaymentData,
    mutate: confirmPayment,
    reset: resetConfirmPayment,
  } = confirmPaymentMutation;

  useEffect(() => {
    if (
      isInitiatePaymentSuccess &&
      !_.isEmpty(initiatePaymentData?.clientSecret)
    ) {
      confirmPayment({
        secret: initiatePaymentData?.clientSecret,
        card: elements.getElement(CardElement),
        // billingDetails: billingDetailsRef?.current?.values,
        billingDetails: {},
        stripe,
      });
    }
  }, [isInitiatePaymentSuccess, initiatePaymentData]);

  useEffect(() => {
    if (projectDetails) {
      // Fetch and set user role
      if (projectDetails?.members && !_.isEmpty(projectDetails?.members)) {
        const userEmail = getEmailId();
        const currentUserDetails = projectDetails?.members?.find(
          (member) => member?.email === userEmail
        );

        setRole(currentUserDetails?.role);
      }

      // Project is not valid state
      if (
        projectDetails?.status?.toLowerCase() !== "in_progress" &&
        projectDetails?.status?.toLowerCase() !== "complete"
      ) {
        navigateBack();
      }

      // Cannot make payment
      if (projectDetails?.projectBillingPlan?.toLowerCase() !== "none") {
        navigateBack();
      }
    }
  }, [projectDetails]);

  useEffect(() => {
    // User no access
    if (projectDetailsError?.message?.toLowerCase() === "no_access") {
      navigateBack();
    }
  }, [projectDetailsError]);

  const initiatePaymentProcess = (billingDetails) => {
    initiatePayment({
      projectId,
      productId: basicProductData?.product?.productId,
      billingDetails,
    });
  };

  const navigateBack = () => {
    history.goBack();
  };

  const handleProfileMenuClick = (event) => {
    setProfilemenuAnchorEl(event?.currentTarget);
  };

  const handleCloseDialog = () => {
    resetConfirmPayment();
    resetInitiatePayment();

    setDialog({
      show: false,
      type: null,
      data: null,
    });
  };

  const isPaymentSuccess = () => {
    return (
      isConfirmPaymentSuccess &&
      confirmPaymentData?.paymentIntent?.status === "succeeded"
    );
  };

  return (
    <div>
      <Dialog
        aria-labelledby='payment-dialog'
        open={
          isInitiatingPayment ||
          initiatePaymentError ||
          isConfirmingPayment ||
          confirmPaymentError ||
          confirmPaymentData ||
          isConfirmPaymentSuccess ||
          dialog?.show
        }
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {
          <PaymentStatusDialog
            onClose={handleCloseDialog}
            onButtonClick={() => {
              if (isPaymentSuccess()) {
                resetConfirmPayment();
                resetInitiatePayment();

                history.replace(`/projects/${projectId}`);
              } else {
                handleCloseDialog();
              }
            }}
            initiatePaymentMutation={initiatePaymentMutation}
            confirmPaymentMutation={confirmPaymentMutation}
          />
        }
      </Dialog>

      <header className='px-2 border-b-2 flex flex-row justify-between items-center bg-white'>
        <div className='flex flex-row py-2 items-center'>
          <AppIcon
            style={{ marginRight: "1rem" }}
            onClick={(event) => {
              event?.preventDefault();
              event?.stopPropagation();

              navigateBack();
            }}
          >
            <ArrowBackIcon />
          </AppIcon>

          <p className='text-overline1'>{projectDetails?.projectName}</p>
        </div>

        <div className='flex flex-row py-2'>
          <div>
            <InitialsAvatar
              firstName={firstName}
              lastName={lastName}
              className='cursor-pointer'
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();

                handleProfileMenuClick(e);
              }}
            />

            <Menu
              id='profile-menu'
              anchorEl={profileMenuAnchorEl}
              keepMounted
              open={Boolean(profileMenuAnchorEl)}
              onClose={() => {
                setProfilemenuAnchorEl(null);
              }}
              TransitionComponent={Fade}
              style={{ borderRadius: "1rem", zIndex: "100" }}
            >
              <MenuItem
                onClick={() => {
                  setProfilemenuAnchorEl(null);
                  logout();
                }}
                style={{ color: Colors.accent.red }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>

      {isFetchingProjectDetails ||
        (isFetchingProjectDetailsBg && (
          <LoaderWithMessage message='Loading project details' />
        ))}

      {projectDetailsError && (
        <ErrorWithMessage message='Failed to fetch project details' />
      )}

      {isFetchingBasicProduct ||
        (isFetchingBasicProductBg && (
          <LoaderWithMessage message='Loading plan details' />
        ))}

      {getBasicProductError && (
        <ErrorWithMessage message='Failed to fetch plan details' />
      )}

      <div className='w-full flex flex-row p-12'>
        <div className='flex-1 mr-6 px-6'>
          <BillingDetailsForm
            formRef={billingDetailsRef}
            disabled={isInitiatingPayment || isConfirmingPayment}
          />

          <CardDetailsForm
            formRef={cardDetailsRef}
            disabled={isInitiatingPayment || isConfirmingPayment}
          />
        </div>

        {basicProductData && (
          <div className='flex-1'>
            <ProductDetails
              product={basicProductData?.product}
              disabled={
                isInitiatingPayment || isConfirmingPayment || isLoggingOut
              }
              project={projectDetails}
              onPurchaseClick={() => {
                billingDetailsRef.current.handleSubmit();
                cardDetailsRef.current.handleSubmit();

                if (
                  billingDetailsRef.current.isValid &&
                  cardDetailsRef.current.isValid &&
                  billingDetailsRef?.current?.values?.fullName &&
                  billingDetailsRef?.current?.values?.addressLine1
                ) {
                  initiatePaymentProcess(billingDetailsRef.current.values);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPayment;
