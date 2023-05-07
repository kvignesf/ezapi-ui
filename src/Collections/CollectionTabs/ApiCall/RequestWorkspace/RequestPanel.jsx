import React from "react";
import axios from "axios";
import UrlEditor from "./UrlEditor";
import RequestTabs from "./RequestTabs";
import { accessToken, requestParams, responseInfo } from "../../../CollectionsAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function Request({ setLoading }) {
  const request = useRecoilValue(requestParams);
  const authToken = useRecoilValue(accessToken);
  const setResponse = useSetRecoilState(responseInfo);
  const convertKeyValueToObject = (keyPairs) => {
    return [...keyPairs].reduce((data, pair) => {
      const key = pair.keyItem;
      const value = pair.valueItem;

      if (key === "") return data;
      return {
        ...data,
        [key]: value,
      };
    }, {});
  };

  const handleOnInputSend = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data;
    const startTime = Date.now(); // Start tracking elapsed time
    if (request.body === undefined || request.body === null) {
      console.error("The request body is undefined or null.");
    } else {
      try {
        data = request.body;
      } catch (e) {
        console.error("Something is wrong with the JSON data.", e);
      }
    }
    try {
      const headers = convertKeyValueToObject(request.header);
      if (authToken && authToken.length > 0) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      if (request.proxy === "Proxy") {
        const data = {
          url: request.url,
          method: request.method,
          params: convertKeyValueToObject(request.queryParams),
          headers,
          data: request.body,
        };
        const response = await axios({
          url: "https://proxy.ezapi.ai",
          data,
          method: "POST",
        });

        setResponse({
          status: response.status,
          headers: response.headers,
          data: response.data,
          time: ((Date.now() - startTime) / 1000).toFixed(2),
          size: (new Blob([JSON.stringify(response)]).size / 1024).toFixed(2),
          error: false,
        });
      } else {
        const requestOptions = {
          method: request.method,
          headers,
        };

        if (request.method === "GET" || request.method === "HEAD") {
          requestOptions.body = undefined;
        } else {
          requestOptions.body = data;
        }

        const response = await fetch(request.url, requestOptions);

        const responseHeaders = response.headers;
        // Convert the headers to an object
        const headersObject = {};
        for (const [key, value] of responseHeaders) {
          headersObject[key] = value;
        }

        setResponse({
          status: response.status,
          headers: headersObject,
          data: await response.json(),
          time: ((Date.now() - startTime) / 1000).toFixed(2),
          size: (new Blob([JSON.stringify(response)]).size / 1024).toFixed(2),
          error: false,
        });
      }
    } catch (error) {
      setResponse({
        status: error.status || 404,
        headers: {},
        data: {},
        time: ((Date.now() - startTime) / 1000).toFixed(2),
        size: 0,
        error: true,
        errorMessage: error.message,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <UrlEditor onInputSend={handleOnInputSend} />
      <RequestTabs />
    </>
  );
}
