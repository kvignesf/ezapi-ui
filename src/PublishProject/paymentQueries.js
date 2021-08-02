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

const makePayment = async ({ projectId, productId, token }) => {
  try {
    const { data } = await client.post(endpoint.payment, {
      projectId,
      productId,
      token,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useMakePayment = () => {
  return useMutation(makePayment);
};
