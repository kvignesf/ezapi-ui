import { useStripe } from "@stripe/react-stripe-js";
import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Messages from "../shared/messages";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError, delay } from "../shared/utils";

const getProducts = async () => {
  try {
    const { data } = await client.get(endpoint.products);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetProducts = (options = {}) => {
  const query = useQuery([queries.products], getProducts, {
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

const getBasicProduct = async () => {
  try {
    const { data } = await client.get(endpoint.basicProduct);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetBasicProduct = (options = {}) => {
  const query = useQuery([queries.basicProduct], getBasicProduct, {
    refetchOnWindowFocus: false,
    ...options,
  });

  return query;
};

const getBillingDetails = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.billingDetails, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetBillingDetails = () => {
  return useMutation(getBillingDetails);
};

const initiatePayment = async ({ projectId, productId }) => {
  try {
    const { data } = await client.post(endpoint.initiatePayment, {
      projectId,
      productId,
      // orderId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useInitiatePayment = () => {
  return useMutation(initiatePayment);
};

const confirmPayment = async ({ card, billingDetails, secret, stripe }) => {
  try {
    const result = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: card,
        billing_details: {
          address: {
            city: billingDetails?.city,
            country: billingDetails?.country,
            line1: billingDetails?.addressLine1,
            line2: billingDetails?.addressLine2,
            state: billingDetails?.state,
            postal_code: billingDetails?.zip,
          },
          email: billingDetails?.email,
          phone: _.isEmpty(billingDetails?.phone) ? "-" : billingDetails?.phone,
          name: billingDetails?.fullName,
        },
      },
    });

    // Delay added so that the stripe updates the backend
    await delay(2000);
    console.log(result);
    return result;
  } catch (error) {
    throw Error(Messages.PAYMENT_FAILURE);
  }
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  const { projectId } = useParams();

  return useMutation(confirmPayment, {
    onSuccess: (data) => {
      // if (data?.paymentIntent?.status?.toLowerCase() === "succeeded") {
      //   queryClient.invalidateQueries(`${queries.projects}-${projectId}`);
      // }
    },
  });
};
