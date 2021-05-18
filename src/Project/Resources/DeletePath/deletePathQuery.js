import { useMutation, useQueryClient } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { queries } from "../../../shared/network/queryClient";
import { getApiError } from "../../../shared/utils";

const deletePath = async ({ id }) => {
  try {
    const { data } = await client.delete(`${endpoint.paths}/${id}`);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useDeletePath = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(deletePath, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.resources);
    },
  });
  return mutation;
};
