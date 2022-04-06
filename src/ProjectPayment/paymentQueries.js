import { useStripe } from '@stripe/react-stripe-js';
import _ from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Messages from '../shared/messages';
import { getAccessToken } from '../shared/storage';

import client, { endpoint } from '../shared/network/client';
import { clearQueryCache, queries } from '../shared/network/queryClient';
import routes from '../shared/routes';
import { clearSession, setAccessToken } from '../shared/storage';
import { getApiError, delay } from '../shared/utils';

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

const initiatePayment = async ({
  token,

  billingDetails,
}) => {
  // return true;
  try {
    const addCardResponse = await client.post(
      endpoint.addCard,
      {
        stripe_token: token,
        billing_address: {
          city: billingDetails?.city,
          country: billingDetails?.country,
          line1: billingDetails?.addressLine1,
          line2: billingDetails?.addressLine2,
          state: billingDetails?.state,
          postal_code: billingDetails?.zip,
        },
      },
      {
        headers: {
          Authorization: acc_token,
        },
      }
    );
    console.log(addCardResponse.data);
    if (addCardResponse.ok) {
      console.log(addCardResponse.json());
    }
    await delay(2000);
    console.log(addCardResponse);
    return addCardResponse;
  } catch (error) {
    // console.log('inside error');
    // console.log(error.message);
    // console.log(error);

    throw getApiError(error);
  }
};

export const useInitiatePayment = () => {
  return useMutation(initiatePayment);
};

const acc_token = getAccessToken();
const confirmPayment = async ({
  priceIDData,
  addCardResponse,
  token,
  card,
  billingDetails,
  secret,
  stripe,
}) => {
  console.log(token);
  try {
    const subscribeData = await client.post(
      endpoint.subscribe,
      {
        update_plan: true,
        price_id: priceIDData,
      },
      {
        headers: {
          Authorization: acc_token,
        },
        timeout: 480000,
      }
    );

    await delay(2000);

    return subscribeData;
  } catch (error) {
    throw Error(Messages.PAYMENT_FAILURE);
  }
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  const { projectId } = useParams();

  return useMutation(confirmPayment, {
    onSuccess: (data) => {
      // console.log(data);
      // if (data?.paymentIntent?.status?.toLowerCase() === "succeeded") {
      //   queryClient.invalidateQueries(`${queries.projects}-${projectId}`);
      // }
    },
  });
};
