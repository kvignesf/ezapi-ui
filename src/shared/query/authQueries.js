import axios from "axios";
import _ from "lodash";
import { useMutation, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import client, { endpoint } from "../network/client";
import { clearQueryCache, queries } from "../network/queryClient";
import routes from "../routes";
import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setFirstName,
  setLastName,
  setUserId,
} from "../storage";
import { getApiError } from "../utils";

const login = async ({ linkedInAuthToken, redirect_uri }) => {
  if (!linkedInAuthToken || _.isEmpty(linkedInAuthToken)) {
    throw Error("Need to login using LinkedIn");
  }

  try {
    const { data } = await client.post(endpoint.login, {
      code: linkedInAuthToken,
      redirect_uri: redirect_uri,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useLogin = () => {
  const mutation = useMutation(login, {
    onSuccess: (data) => {
      if (data) {
        setAccessToken(data?.jwtToken);
        setFirstName(data?.userData?.firstName);
        setLastName(data?.userData?.lastName);
        setUserId(data?.userData?.user_id);
      }
    },
  });

  return mutation;
};

const logout = async () => {
  const accessToken = getAccessToken();

  /**
   * Clearing the tokens optimistically
   * so that even if user refreshes while
   * logging out, he/she will be taken to sign in page
   */
  clearSession();

  if (accessToken && !_.isEmpty(accessToken)) {
    try {
      const { data } = await client.post(
        endpoint.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw getApiError(error);
    }
  }
};

export const useLogout = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const mutation = useMutation(logout, {
    onSuccess: (data) => {
      clearQueryCache(queryClient);
      history.replace(routes.signIn);
    },
    onError: (err) => {
      clearQueryCache(queryClient);
      history.replace(routes.signIn);
    },
  });

  return mutation;
};
