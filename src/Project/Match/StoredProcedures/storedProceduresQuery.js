import { useQuery } from "react-query";
import { useMutation } from "react-query";
import client, { endpoint } from "../../../shared/network/client";
import { queries } from "../../../shared/network/queryClient";
import { getApiError } from "../../../shared/utils";

const getStoredProcedures = async ({ projectId }) => {
  try {
    const { data } = await client.get(
      `${endpoint.storedProcedures}/a318f549-bb1e-46bb-99f2-c24fc71acbfa`
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetStoredProcedures = () => {
  const mutation = useMutation(getStoredProcedures, {});

  return mutation;
};
