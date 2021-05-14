import { useMutation } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { getApiError } from "../../../shared/utils";

const addOperation = async ({ name }) => {
  try {
    const { data } = await client.post(endpoint.operation, {
      operationName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddOperation = () => {
  const mutation = useMutation(addOperation);
  return mutation;
};

const editOperation = async ({ name }) => {
  try {
    const { data } = await client.patch(endpoint.operation, {
      operationName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useEditOperation = () => {
  const mutation = useMutation(editOperation);
  return mutation;
};
