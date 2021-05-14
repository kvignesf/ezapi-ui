import { useMutation } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { getApiError } from "../../../shared/utils";

const addPath = async ({ name }) => {
  try {
    const { data } = await client.post(endpoint.path, {
      pathName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddPath = () => {
  const mutation = useMutation(addPath);
  return mutation;
};

const editPath = async ({ name }) => {
  try {
    const { data } = await client.patch(endpoint.path, {
      pathName: name,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useEditPath = () => {
  const mutation = useMutation(editPath);
  return mutation;
};
