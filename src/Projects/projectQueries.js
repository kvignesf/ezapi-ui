import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { saveAs } from "file-saver";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError, getOs } from "../shared/utils";

const getProjects = async () => {
  try {
    const { data } = await client.get(endpoint.project);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetProjects = () => {
  const mutation = useQuery([queries.projects], getProjects, {
    refetchOnWindowFocus: false,
  });

  return mutation;
};

const updateProject = async ({ id, projectName, removeInvites }) => {
  let requestData = {};

  if (projectName && !_.isEmpty(projectName)) {
    requestData["projectName"] = projectName;
  }

  if (removeInvites && !_.isEmpty(removeInvites)) {
    requestData["removeInvites"] = removeInvites.map((invite) => {
      return invite?.email;
    });
  }

  if (requestData && !_.isEmpty(requestData)) {
    try {
      const { data } = await client.patch(
        `${endpoint.project}/${id}/update`,
        requestData
      );
      return data;
    } catch (error) {
      throw getApiError(error);
    }
  }
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = new useMutation(updateProject, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.projects);
    },
  });

  return mutation;
};

const inviteCollaborators = async ({ id, collaborators }) => {
  try {
    const { data } = await client.post("/invite_collabrator", {
      projectId: id,
      emails: collaborators,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useInviteCollaborator = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(inviteCollaborators, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.projects);
    },
  });

  return mutation;
};

const downloadSpecs = async ({ projectId }) => {
  try {
    const osName = getOs();

    const { data } = await client.post(endpoint.downloadSpec, {
      projectId,
      os_type: osName,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useDownloadSpecs = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(downloadSpecs, {
    onSuccess: (data) => {
      if (data?.downloadUrl && !_.isEmpty(data?.downloadUrl)) {
        const link = data?.downloadUrl;

        // const filename = link.substring('link.lastIndexOf("/")' + 1);
        const filename = "project_spec";
        saveAs(link, filename);
      }
    },
  });

  return mutation;
};

const downloadArtifacts = async ({ projectId }) => {
  try {
    const osName = getOs();

    const { data } = await client.post(
      endpoint.downloadArtifact,
      {
        projectId,
        os_type: osName,
      },
      {
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useDownloadArtifacts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(downloadArtifacts, {
    onSuccess: (data) => {
      if (data?.downloadUrl && !_.isEmpty(data?.downloadUrl)) {
        const link = data?.downloadUrl;

        const filename = link.substring(link.lastIndexOf("/") + 1);
        saveAs(link, filename);
      }
    },
  });

  return mutation;
};

const downloadCodegen = async ({ projectId }) => {
  try {
    const osName = getOs();

    const { data } = await client.post(
      endpoint.downloadCodegen,
      {
        projectId,
      },
      {
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useDownloadCodegen = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(downloadCodegen, {
    onSuccess: (data) => {
      if (data?.downloadUrl && !_.isEmpty(data?.downloadUrl)) {
        const link = data?.downloadUrl;

        const filename = link.substring(link.lastIndexOf("/") + 1);
        saveAs(link, filename);
      }
    },
  });

  return mutation;
};
