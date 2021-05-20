import { useMutation, useQueryClient } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { queries } from "../../../shared/network/queryClient";
import { getApiError } from "../../../shared/utils";

const addOperation = async ({ pathId, resourceId, name, type, desc }) => {
  try {
    const { data } = await client.patch(`${endpoint.operation}/add`, {
      pathId: pathId,
      resourceId: resourceId,
      operationName: name,
      operationType: type,
      operationDescription: desc,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddOperation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(addOperation, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.resources);
    },
  });
  return mutation;
};

const editOperation = async ({
  pathId,
  resourceId,
  operationId,
  name,
  type,
  desc,
}) => {
  try {
    const { data } = await client.patch(
      `${endpoint.operation}/edit/${operationId}`,
      {
        pathId: pathId,
        resourceId,
        operationName: name,
        operationType: type,
        operationDescription: desc,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useEditOperation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(editOperation, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.resources);
    },
  });
  return mutation;
};
