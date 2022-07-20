import { useQuery } from "react-query";
import { useMutation } from "react-query";
import client, { endpoint } from "../../../shared/network/client";
import { queries } from "../../../shared/network/queryClient";
import { getApiError } from "../../../shared/utils";

const getStoredProcedures = async ({ projectId }) => {
  try {
    const { data } = await client.get(
      `${endpoint.storedProcedures}/d23c2b69-444e-480d-9979-d48c103f37a2`
    );
    // const { data } = await client.get(
    //   `${endpoint.storedProcedures}/projectId`
    // );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetStoredProcedures = () => {
  const mutation = useMutation(getStoredProcedures, {});

  return mutation;
};
