import _ from "lodash";
import { useMutation, useQuery } from "react-query";
import aes from "crypto-js/aes";
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
    [`${queries.projects}-${projectId}`, { projectId }],
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


export const getTablesRelations = async (projectId) => {
  try {
						   
    const { data } = await client.post(
      endpoint.tableRelations,
      { projectId },
      {
        validateStatus: function (status) {
          return status == 200 || status == 400;
        },
        timeout: 300000,
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const tableMappings = async (
  projectId,
  filters,
  relations,
  password
) => {
  var ciphertext = aes
    .encrypt(password ?? "", process.env.REACT_APP_AES_ENCRYPTION_KEY)
    .toString();

  try {
    const { data } = await client.post(
      endpoint.tableMappings,
      {
        projectId: projectId,
        relations: relations,
        filters: filters,
        password: ciphertext,
      },
      {
        validateStatus: function (status) {
          return status == 200 || status == 400;
        },
        timeout: 120000,
      }
    );

    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const publishProject = async ({ projectId, newProjectDetails }) => {
  var ciphertext = aes
    .encrypt(
      newProjectDetails?.password,
      process.env.REACT_APP_AES_ENCRYPTION_KEY
    )
    .toString();
  try {
    const { data } = await client.post(
      endpoint.publishProject,
      {
        projectId,
												
        password: ciphertext,
      },
      {
        validateStatus: function (status) {
          return status == 200 || status == 400;
        },
		
        timeout: 120000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const usePublishProject = () => {
  const publishProjectMutation = useMutation(publishProject, {
    onSuccess: (data) => {},
  });

  return publishProjectMutation;
};

export const useSubmitProject = (projectId, newProjectDetails) => {
  //console.log(newProjectDetails);
  const publishProjectMutation = useMutation(publishProject);

  const verifyProjectMutation = useMutation(verifyProject, {
    onSuccess: (data) => {
      if (!data?.response || _.isEmpty(data?.response)) {
        publishProjectMutation.mutate({ projectId, newProjectDetails });
      }
    },
  });

  return { verifyProjectMutation, publishProjectMutation };
};

export const useVerifyProject = ({ projectId, newProjectDetails })  => {
  const verifyProjectMutation = useMutation(verifyProject, {
    onSuccess: (data) => {},
  });

  return verifyProjectMutation;
};
const getMandMappingTableData = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.mandMappingTableData, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetMandMappingTableData = () => {
  const mutation = useMutation(getMandMappingTableData, {});

  return mutation;
};

/* export const useGetEntityMapping = () => {
  const mutation = useMutation(tableMappings, {});

  return mutation;
}; */

