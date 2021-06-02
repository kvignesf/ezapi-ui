import _ from "lodash";
import { useMutation } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { getApiError } from "../../../shared/utils";

const getSubSchema = async ({ projectId, name, type, ref }) => {
  try {
    const { data } = await client.post(`${endpoint.subSchemaData}`, {
      projectId,
      name,
      type,
      ref,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetSubSchema = () => {
  const query = useMutation(getSubSchema);

  return query;
};
