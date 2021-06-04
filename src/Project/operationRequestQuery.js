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

const getOperationRequest = async ({ queryKey }) => {
  try {
    const { operationId } = queryKey[1];

    const { data } = await client.get(`/operationData/request/${operationId}`);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetOperationRequest = (operationId, options = {}) => {
  const query = useQuery(
    [`${queries.resources}-${operationId}`, { operationId }],
    getOperationRequest,
    {
      ...options,
    }
  );

  return query;
};
