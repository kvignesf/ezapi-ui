import _ from "lodash";
import { useQuery, useMutation } from "react-query";

import client, { endpoint } from "../shared/network/client";
import { queries } from "../shared/network/queryClient";
import { getApiError } from "../shared/utils";

const syncOperationRequest = async ({
  projectId,
  resourceId,
  pathId,
  operationId,
  operationRequest,
}) => {
  try {
    const { data } = await client.post(
      `/operationData/sinkRequest/${operationId}`,
      {
        projectId,
        resourceId,
        pathId,
        operationRequest,
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
