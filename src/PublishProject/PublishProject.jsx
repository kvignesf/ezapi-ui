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
import { useGetProducts, useMakePayment } from "./paymentQueries";

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
    data: products,
  } = useGetProducts(projectId);
  const {
    isLoading: isMakingPayment,
    error: paymentError,
    mutate: makePayment,
  } = useMakePayment();
  const [userRole, setRole] = useState(null);
  const firstName = getFirstName();
  const lastName = getLastName();
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);
  const { isLoading: isLoggingOut, mutate: logout } = useLogout();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {},
    });

    if (paymentMethod && !error) {
      makePayment({
        projectId,
        productId: 1,
        token: paymentMethod,
      });
    }
  };

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

      {isMakingPayment && <LoaderWithMessage message='Making payment' />}

      {!isMakingPayment &&
        products?.products &&
        !_.isEmpty(products?.products) && (
          <div className='container p-4 flex flex-row justify-evenly'>
            <div className='flex flex-col'>
              <p className='mb-4'>Choose a product</p>

              {products?.products.map((product) => {
                return (
                  <p key={product?.productId}>
                    {product?.name} - {product?.price} ({product?.currency})
                  </p>
                );
              })}
            </div>

            <div className='w-full flex flex-col'>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col items-start'
              >
                <label className='mb-3'>
                  Name:
                  <input type='text' name='name' required />
                </label>
                <label className='mb-3'>
                  Phone:
                  <input type='text' name='phone' required />
                </label>
                <label className='mb-3'>
                  Email:
                  <input type='text' name='email' required />
                </label>

                <CardElement className='w-1/2 mb-3' />
                <button type='submit' disabled={!stripe}>
                  Pay
                </button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default PublishProject;
