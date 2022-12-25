import axios from "axios";
import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import Messages from "../messages";

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
  setEmailId,
} from "../storage";
import { getApiError } from "../utils";

const login = async ({ linkedInAuthToken, redirect_uri }) => {
  if (!linkedInAuthToken || _.isEmpty(linkedInAuthToken)) {
    throw Error(Messages.LINKEDIN_REQUIRED);
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

/* export const LoginWithGoogle = async ({}) => { 
  try {
    const { data } = await client.get(endpoint.auth_workos);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const googleLogin = async ({}) => { 
  try {
    const { data } = await client.get(endpoint.googleLogin);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGoogleLogin = () => {
  return useQuery([queries.googleLogin], googleLogin, {
  });
}; */

const github = async ({ code, redirect_uri }) => {
  try {
    const { data } = await client.post(endpoint.github_auth, {
      code: code,
      redirect_uri: redirect_uri
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
        setEmailId(data?.userData?.email);
      }
    },
  });

  return mutation;
};

export const useGithubLogin = () => {
  const mutation = useMutation(github, {
    onSuccess: (data) => {
      //console.log("datafromnode", data);
      if (data) {
        setAccessToken(data?.jwtToken);
        setFirstName(data?.userData?.firstName);
        setLastName(data?.userData?.lastName);
        setUserId(data?.userData?.user_id);
        setEmailId(data?.userData?.email);
      }
      //window.location.reload(false);
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
      //history.replace(routes.signIn);
      //window.location = history.location.pathname;
      window.location = window.location.origin;
    },
    onError: (err) => {
      clearQueryCache(queryClient);
      //history.replace(routes.signIn);
      window.location = window.location.origin;
    },
  });

  return mutation;
};
