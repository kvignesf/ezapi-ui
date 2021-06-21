import _ from "lodash";
import { useMutation } from "react-query";

import client from "../network/client";
import { getApiError } from "../utils";

const syncOperation = async ({
  projectId,
  resourceId,
  pathId,
  operationId,
  requestData,
  responseData,
}) => {
  try {
    const { data: saveRequestApiData } = await client.post(
      `/operationData/sinkRequest/${operationId}`,
      {
        projectId,
        resourceId,
        pathId,
        ...requestData,
      }
    );

    const { data: saveResponseApiData } = await client.post(
      `/operationData/sinkResponse/${operationId}`,
      {
        projectId,
        resourceId,
        pathId,
        responseData,
      }
    );

    return {
      saveRequestApiData,
      saveResponseApiData,
    };
  } catch (error) {
    throw getApiError(error);
  }
};

export const useSyncOperation = () => {
  const mutation = useMutation(syncOperation, {
    onSuccess: (data) => {},
  });

  return mutation;
};

const getOperation = async ({ projectId, resourceId, pathId, operationId }) => {
  try {
    const { data: getRequestApiData } = await client.post(
      `/operationData/request/${operationId}`,
      { projectId, resourceId, pathId }
    );

    const { data: getResponseApiData } = await client.post(
      `/operationData/response/${operationId}`,
      { projectId, resourceId, pathId }
    );

    return {
      getRequestApiData,
      getResponseApiData,
    };
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetOperation = () => {
  const mutation = useMutation(getOperation, {
    onSuccess: (data) => {},
  });

  return mutation;
};
