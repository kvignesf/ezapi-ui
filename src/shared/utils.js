import { useEffect, useState } from "react";
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

  const url = error?.config?.url;

  if (error?.response?.status === 400) {
    if (url && url === endpoint.login) {
      return new Error("Failed to get the user details, please try again.");
    }

    return new Error("Invalid data provided, please check and retry");
  } else if (url && !_.isEmpty(url) && url.includes("/uploads")) {
    return new Error(error?.response?.data?.aiResponse?.error);
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

export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};
