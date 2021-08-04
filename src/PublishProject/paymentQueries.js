import { useStripe } from "@stripe/react-stripe-js";
import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError } from "../shared/utils";

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

const initiatePayment = async ({ projectId, productId, billingDetails }) => {
  try {
    const { data } = await client.post(endpoint.initiatePayment, {
      projectId,
      productId,
      billingDetails,
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
        billing_details: billingDetails,
      },
    });

    return result;
    // .then(function (result) {
    //   if (result.error) {
    //     // Show error to your customer (e.g., insufficient funds)
    //     console.log(result.error.message);
    //   } else {
    //     // The payment has been processed!
    //     if (result.paymentIntent.status === "succeeded") {
    //       // Show a success message to your customer
    //       // There's a risk of the customer closing the window before callback
    //       // execution. Set up a webhook or plugin to listen for the
    //       // payment_intent.succeeded event that handles any business critical
    //       // post-payment actions.
    //     }
    //   }
    // });
  } catch (error) {
    console.log("error", error);
    throw Error("Something went wrong during payment");
  }
};

export const useConfirmPayment = () => {
  return useMutation(confirmPayment);
};
