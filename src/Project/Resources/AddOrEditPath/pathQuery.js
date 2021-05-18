import { useMutation } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
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
  const mutation = useMutation(addPath);
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
  const mutation = useMutation(editPath);
  return mutation;
};
