import _ from "lodash";
import { endpoint } from "./network/client";
import { getAccessToken } from "./storage";

export const isEmailValid = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const isUserLoggedIn = () => {
  const token = getAccessToken();

  return token && !_.isEmpty(token);
};

export const getApiError = (error) => {
  console.log("Error", error);
  console.log("Error Response", error?.response);

  if (error?.response?.status === 400) {
    const url = error?.config?.url;

    if (url) {
      if (url === endpoint.login) {
        return new Error("Failed to get the user details, please try again.");
      } else if (url === endpoint.addUser) {
        const message = error?.response?.data?.error?.message;

        if (message === "Email or UserId already exists") {
          return new Error("Employee ID or email address already exists.");
        }
        return new Error("Something went wrong, please try again");
      }
    }
    return new Error("Invalid data provided, please check and retry");
  }

  return new Error("Something went wrong, please try again");
};

export const isArray = (object) => {
  return object?.type === "array";
};

export const isAttribute = (object) => {
  return object?.type && !_.isEmpty(object?.type);
};

export const isSchema = (object) => {
  return (
    object?.type === "ref" ||
    object?.type === "ezapi_ref" ||
    (object?.attributes && object?.refs)
  );
};

export const isFullMatch = (object) => {
  return object?.match_type?.toLowerCase() === "full";
};

export const isPartialMatch = (object) => {
  return object?.match_type?.toLowerCase() === "partial";
};

export const isNoMatch = (object) => {
  return (
    !object?.match_type || object?.match_type?.toLowerCase() === "no match"
  );
};
