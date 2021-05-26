import { useMutation } from "react-query";

import client, { endpoint } from "../../../shared/network/client";
import { getApiError } from "../../../shared/utils";

const getAllSchemas = async ({ projectId }) => {
  try {
    const { data } = await client.post(`${endpoint.schemasList}`, {
      // projectId,
      projectId: "30001",
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetAllSchemas = () => {
  const query = useMutation(getAllSchemas);

  return query;
};

const getSubSchema = async ({ projectId, name, type, ref }) => {
  try {
    const { data } = await client.post(`${endpoint.subSchemaData}`, {
      projectId: "30001",
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
