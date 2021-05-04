import _ from "lodash";
import { endpoint } from "./network/client";
import { getAccessToken } from "./storage";

export const isEmailValid = (email) => {
  var re = /\S+@\S+\.\S+/;
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
      if (url === endpoint.login || url.includes("trusted-release")) {
        return new Error("User Id or the password is not matching");
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
  if (error?.response?.status === 404) {
    return new Error("No data available!");
  }
  return new Error("Something went wrong, please try again");
};
