import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError } from "../shared/utils";

const getProjects = async () => {
  try {
    const { data } = await client.get(endpoint.projects);
    return data;
    throw Error("Something failed");
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetProjects = () => {
  const mutation = useQuery([queries.projects], getProjects);

  return mutation;
};
