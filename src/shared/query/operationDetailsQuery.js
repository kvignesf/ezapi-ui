import _ from "lodash";
import { useMutation } from "react-query";

import client from "../network/client";
import { getApiError } from "../utils";

const syncOperationRequest = async ({
  projectId,
  resourceId,
  pathId,
  operationId,
  ...rest
}) => {
  try {
    const { data } = await client.post(
      `/operationData/sinkRequest/${operationId}`,
      {
        projectId,
        resourceId,
        pathId,
        ...rest,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useSyncOperationRequest = () => {
  const mutation = useMutation(syncOperationRequest, {
    onSuccess: (data) => {},
  });

  return mutation;
};

const syncOperationResponse = async ({
  projectId,
  resourceId,
  pathId,
  operationId,
  ...rest
}) => {
  try {
    const { data } = await client.post(
      `/operationData/sinkResponse/${operationId}`,
      {
        projectId,
        resourceId,
        pathId,
        ...rest,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useSyncOperationResponse = () => {
  const mutation = useMutation(syncOperationResponse, {
    onSuccess: (data) => {},
  });

  return mutation;
};

const getOperationRequest = async ({
  projectId,
  resourceId,
  pathId,
  operationId,
}) => {
  try {
    const { data } = await client.post(
      `/operationData/request/${operationId}`,
      { projectId, resourceId, pathId }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetOperationRequest = () => {
  const mutation = useMutation(getOperationRequest, {
    onSuccess: (data) => {},
  });

  return mutation;
};

const getOperationResponse = async ({
  projectId,
  resourceId,
  pathId,
  operationId,
}) => {
  try {
    const { data } = await client.post(
      `/operationData/response/${operationId}`,
      { projectId, resourceId, pathId }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetOperationResponse = () => {
  const mutation = useMutation(getOperationResponse, {
    onSuccess: (data) => {},
  });

  return mutation;
};
