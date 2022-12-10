import { useMutation } from "react-query";
import client, { endpoint } from "../network/client";
import { getApiError } from "../utils";

const getTablesLookup = async ({ projectId }) => {
  try {
    const { data } = await client.post(
      endpoint.tablesLookup,
      {
        projectId,
      },
      {
        timeout: 120000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetTablesLookup = () => {
  const mutation = useMutation(getTablesLookup, {});

  return mutation;
};

const getTablesData = async ({ projectId }) => {
  try {
    const { data } = await client.post(
      endpoint.tablesData,
      {
        projectId,
      },
      {
        timeout: 120000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetTablesData = () => {
  const mutation = useMutation(getTablesData, {});

  return mutation;
};
