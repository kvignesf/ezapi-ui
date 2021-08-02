import _ from "lodash";
import { useMutation, useQuery } from "react-query";

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
      if (error?.response?.status === 404) {
        throw Error("no_access");
      }
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

const verifyProject = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.verifyProject, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const publishProject = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.publishProject, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useSubmitProject = (projectId) => {
  const publishProjectMutation = useMutation(publishProject);

  const verifyProjectMutation = useMutation(verifyProject, {
    onSuccess: (data) => {
      if (!data?.response || _.isEmpty(data?.response)) {
        publishProjectMutation.mutate({ projectId });
      }
    },
  });

  return { verifyProjectMutation, publishProjectMutation };
};

export const usePublishProject = () => {
  const publishProjectMutation = useMutation(publishProject, {
    onSuccess: (data) => {},
  });

  return publishProjectMutation;
};

export const useVerifyProject = () => {
  const verifyProjectMutation = useMutation(verifyProject, {
    onSuccess: (data) => {},
  });

  return verifyProjectMutation;
};
