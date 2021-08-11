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
import routes, { generateRoute } from "../shared/routes";
import { useQueryClient } from "react-query";
import { queries } from "../shared/network/queryClient";

const Header = ({
  projectDetails,
  logoutMutation: { isLoading: isLoggingOut, mutate: logout },
}) => {
  const history = useHistory();
  const firstName = getFirstName();
  const lastName = getLastName();
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);

  const navigateBack = () => {
    history.goBack();
  };

  const handleProfileMenuClick = (event) => {
    setProfilemenuAnchorEl(event?.currentTarget);
  };

  return (
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
  );
};

const ProjectPayment = () => {
  const { projectId, orderId } = useParams();
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
  const logoutMutation = useLogout();
  const { isLoading: isLoggingOut, mutate: logout } = logoutMutation;
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      isInitiatePaymentSuccess &&
      !_.isEmpty(initiatePaymentData?.clientSecret)
    ) {
      confirmPayment({
        secret: initiatePaymentData?.clientSecret,
        card: elements.getElement(CardElement),
        billingDetails: billingDetailsRef?.current?.values,
        // billingDetails: {},
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
    if (_.isEmpty(initiatePaymentData?.clientSecret)) {
      initiatePayment({
        projectId,
        productId: basicProductData?.product?.productId,
        billingDetails,
        orderId,
      });
    } else {
      confirmPayment({
        secret: initiatePaymentData?.clientSecret,
        card: elements.getElement(CardElement),
        billingDetails: billingDetailsRef?.current?.values,
        stripe,
      });
    }
  };

  const navigateBack = () => {
    // history.goBack();
    history.replace(generateRoute(routes.projects, projectId));
  };

  const handleCloseDialog = () => {
    if (isPaymentSuccess()) {
      resetConfirmPayment();
      resetInitiatePayment();
      invalidateProject();
      navigateBack();
    } else if (initiatePaymentError) {
      resetConfirmPayment();
      resetInitiatePayment();
    }

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

  const invalidateProject = () => {
    queryClient.invalidateQueries(`${queries.projects}-${projectId}`);
  };

  if (isFetchingProjectDetails) {
    return (
      <div className='flex flex-col'>
        <Header
          projectDetails={projectDetails}
          logoutMutation={logoutMutation}
        />

        <LoaderWithMessage message='Loading project details' />
      </div>
    );
  }

  if (projectDetailsError) {
    return (
      <div className='flex flex-col'>
        <Header
          projectDetails={projectDetails}
          logoutMutation={logoutMutation}
        />

        <ErrorWithMessage message='Failed to fetch project details' />
      </div>
    );
  }

  if (isFetchingBasicProduct || isFetchingBasicProductBg) {
    return (
      <div className='flex flex-col'>
        <Header
          projectDetails={projectDetails}
          logoutMutation={logoutMutation}
        />

        <LoaderWithMessage message='Loading plan details' />
      </div>
    );
  }

  if (getBasicProductError) {
    return (
      <div className='flex flex-col'>
        <Header
          projectDetails={projectDetails}
          logoutMutation={logoutMutation}
        />

        <ErrorWithMessage message='Failed to fetch plan details' />
      </div>
    );
  }

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
        <PaymentStatusDialog
          onClose={handleCloseDialog}
          onButtonClick={() => {
            console.log("isPaymentSuccess()", isPaymentSuccess());
            if (isPaymentSuccess()) {
              resetConfirmPayment();
              resetInitiatePayment();
              invalidateProject();
              navigateBack();
            } else {
              handleCloseDialog();
            }
          }}
          initiatePaymentMutation={initiatePaymentMutation}
          confirmPaymentMutation={confirmPaymentMutation}
        />
      </Dialog>

      <Header projectDetails={projectDetails} logoutMutation={logoutMutation} />

      <div className='w-full flex flex-row p-12 h-full'>
        {basicProductData && (
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
        )}

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
