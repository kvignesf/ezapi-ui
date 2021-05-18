import { useMutation, useQueryClient } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { queries } from "../../../shared/network/queryClient";
import { getApiError } from "../../../shared/utils";

const addPath = async ({ id, name }) => {
  try {
    const { data } = await client.post(endpoint.paths, {
      resourceId: id,
      pathName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddPath = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(addPath, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.resources);
    },
  });
  return mutation;
};

const editPath = async ({ id, name }) => {
  try {
    const { data } = await client.patch(`${endpoint.paths}/${id}/rename`, {
      pathName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useEditPath = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(editPath, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.resources);
    },
  });
  return mutation;
};
