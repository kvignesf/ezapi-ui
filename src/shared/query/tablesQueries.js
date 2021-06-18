import { useMutation } from "react-query";
import client, { endpoint } from "../network/client";
import { getApiError } from "../utils";

const getTables = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.tablesLookup, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetTables = () => {
  const mutation = useMutation(getTables, {});

  return mutation;
};
