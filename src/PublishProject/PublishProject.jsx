import React, { useState, useEffect } from "react";
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
  useGetProducts,
  useInitiatePayment,
  useMakePayment,
} from "./paymentQueries";
import { useFormik } from "formik";

const PublishProject = () => {
  const { id: projectId } = useParams();
  const history = useHistory();
  const {
    isLoading: isFetchingProjectDetails,
    isFetching: isFetchingProjectDetailsBg,
    isSuccess: isProjectDetailsFetched,
    error: projectDetailsError,
    data: projectDetails,
  } = useFetchProjectDetails(projectId, { refetchOnWindowFocus: false });
  const {
    isLoading: isFetchingProducts,
    isFetching: isFetchingProductsBg,
    error: productsError,
    data: productsData,
  } = useGetProducts(projectId);
  const {
    isLoading: isConfirmingPayment,
    error: confirmPaymentError,
    isSuccess: isConfirmPaymentSuccess,
    data: confirmPaymentData,
    mutate: confirmPayment,
    reset: resetConfirmPayment,
  } = useConfirmPayment();
  const {
    isLoading: isInitiatingPayment,
    error: initiatePaymentError,
    data: initiatePaymentData,
    isSuccess: isInitiatePaymentSuccess,
    mutate: initiatePayment,
    reset: resetInitiatePayment,
  } = useInitiatePayment();
  const [userRole, setRole] = useState(null);
  const firstName = getFirstName();
  const lastName = getLastName();
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);
  const { isLoading: isLoggingOut, mutate: logout } = useLogout();
  const [product, setProduct] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    onSubmit: (values) => {
      resetInitiatePayment();
      resetConfirmPayment();

      initiatePaymentProcess(values);
    },
  });

  useEffect(() => {
    if (
      isInitiatePaymentSuccess &&
      !_.isEmpty(initiatePaymentData?.clientSecret)
    ) {
      confirmPayment({
        secret: initiatePaymentData?.clientSecret,
        card: elements.getElement(CardElement),
        billingDetails: formik?.values,
        stripe,
      });
    }
  }, [isInitiatePaymentSuccess, initiatePaymentData]);

  useEffect(() => {
    if (productsData?.products && !_.isEmpty(productsData?.products)) {
      setProduct(productsData?.products[0]);
    }
  }, [productsData]);

  useEffect(() => {
    if (projectDetails) {
      // Get user role
      if (projectDetails?.members && !_.isEmpty(projectDetails?.members)) {
        const userEmail = getEmailId();
        const currentUserDetails = projectDetails?.members?.find(
          (member) => member?.email === userEmail
        );

        setRole(currentUserDetails?.role);
      }

      if (
        projectDetails?.status?.toLowerCase() !== "in_progress" &&
        projectDetails?.status?.toLowerCase() !== "complete"
      ) {
        navigateBack();
      }
    }
  }, [projectDetails]);

  const initiatePaymentProcess = ({ name, phone, email, address }) => {
    if (product) {
      initiatePayment({
        projectId,
        productId: product?.productId,
        billingDetails: {
          name,
          phone,
          email,
          address,
        },
      });
    }
  };

  const navigateBack = () => {
    history.goBack();
  };

  const handleProfileMenuClick = (event) => {
    setProfilemenuAnchorEl(event?.currentTarget);
  };

  return (
    <div>
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

      {isFetchingProducts && (
        <LoaderWithMessage message='Loading payment details' />
      )}

      {productsError && (
        <ErrorWithMessage message='Failed to fetch payment details' />
      )}

      {productsData?.products && !_.isEmpty(productsData?.products) && (
        <div className='container p-4 flex flex-row justify-evenly'>
          <div className='flex flex-col'>
            <p className='mb-4'>Choose a product</p>

            {productsData?.products.map((product) => {
              return (
                <p key={product?.productId}>
                  {product?.name} - {product?.price} ({product?.currency})
                </p>
              );
            })}
          </div>

          <div className='w-full flex flex-col'>
            <form
              onSubmit={formik.handleSubmit}
              className='flex flex-col items-start'
            >
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                type='text'
                name='name'
                onChange={formik.handleChange}
                value={formik.values.name}
                disabled={isInitiatingPayment || isConfirmingPayment}
                required
                className='mb-3 border-1'
              />

              <label htmlFor='phone'>Phone</label>
              <input
                id='phone'
                type='text'
                name='phone'
                onChange={formik.handleChange}
                value={formik.values.phone}
                disabled={isInitiatingPayment || isConfirmingPayment}
                required
                className='mb-3 border-1'
              />

              <label htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                name='email'
                onChange={formik.handleChange}
                value={formik.values.email}
                disabled={isInitiatingPayment || isConfirmingPayment}
                required
                className='mb-3 border-1'
              />

              <label htmlFor='address'>Billing Address</label>
              <input
                id='address'
                type='text'
                name='address'
                onChange={formik.handleChange}
                value={formik.values.address}
                disabled={isInitiatingPayment || isConfirmingPayment}
                required
                className='mb-3 border-1'
              />

              <CardElement
                className='w-1/2 mb-3 mt-6 border-1'
                disabled={isInitiatingPayment || isConfirmingPayment}
              />

              {!isInitiatingPayment && !isConfirmingPayment && (
                <button
                  type='submit'
                  disabled={!stripe}
                  className='mb-4 border-1'
                >
                  Pay
                </button>
              )}

              <p className='mt-4 mb-3'>Status - </p>

              {isInitiatingPayment && <p>Initiating payment</p>}

              {initiatePaymentError && (
                <p>
                  Failed to initiate payment - {initiatePaymentError?.message}
                </p>
              )}

              {isConfirmingPayment && <p>Confirming payment</p>}

              {confirmPaymentError && (
                <p>
                  Failed while confirming payment -
                  {confirmPaymentError?.message}
                </p>
              )}

              {isConfirmPaymentSuccess && !confirmPaymentData?.error && (
                <p>Payment confirmed successfully</p>
              )}
              {isConfirmPaymentSuccess && confirmPaymentData?.error && (
                <p>Payment failed - {confirmPaymentData?.error?.message}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishProject;
