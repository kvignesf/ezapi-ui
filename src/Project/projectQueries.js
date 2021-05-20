import { useQuery } from "react-query";

import client, { endpoint } from "../shared/network/client";
import { queries } from "../shared/network/queryClient";
import { getApiError } from "../shared/utils";

const fetchProjectDetails = async ({ queryKey }) => {
  const { projectId } = queryKey[1];

  if (projectId) {
    try {
      const { data } = await client.get(`${endpoint.project}/${projectId}`);
      return data;
    } catch (error) {
      throw getApiError(error);
    }
  }
};

export const useFetchProjectDetails = (projectId, options = {}) => {
  const query = useQuery(
    [queries.projects, { projectId }],
    fetchProjectDetails,
    {
      ...options,
    }
  );

  return query;
};
