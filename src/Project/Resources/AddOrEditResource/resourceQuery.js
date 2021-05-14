import { useMutation } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { getApiError } from "../../../shared/utils";

const addResource = async ({ name }) => {
  try {
    const { data } = await client.post(endpoint.resource, {
      resourceName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddResource = () => {
  const mutation = useMutation(addResource);
  return mutation;
};

const editResource = async ({ name }) => {
  try {
    const { data } = await client.patch(endpoint.resource, {
      resourceName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useEditResource = () => {
  const mutation = useMutation(editResource);
  return mutation;
};
