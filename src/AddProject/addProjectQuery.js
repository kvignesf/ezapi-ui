import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError } from "../shared/utils";
import projectAtom from "./projectAtom";

const addProject = async ({ name, invitees }) => {
  try {
    const { data } = await client.post(endpoint.project, {
      projectName: name,
      invites: invitees,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddProject = () => {
  /*
    This is a chain API in the following order - 
    1. /project (POST) - uploads basic details of the project - name, invites
    2. /project/{project_id}/upload (POST) - uploads the spec files
    3. /project/{project_id}/upload (POST) - uploads the db files
  */
  const aiMutation = useAiMatcher();
  const dbMutation = useUploadProjectDbs(aiMutation);
  const specsMutation = useUploadProjectSpecs(dbMutation);
  const projectDetails = useRecoilValue(projectAtom);

  const mutation = useMutation(addProject, {
    onSuccess: (data) => {
      specsMutation.mutate({
        id: data?.projectId,
        files: projectDetails?.specs,
        type: "apiSpec",
      });
    },
  });

  return {
    addProjectMutation: mutation,
    uploadDbMutation: dbMutation,
    uploadSpecsMutation: specsMutation,
    aiMatcherMutation: aiMutation,
  };
};

const uploadProjectSpecs = async ({ id, files }) => {
  const bodyFormData = new FormData();

  files.forEach((file) => {
    bodyFormData.append("upload", file);
  });
  bodyFormData.append("type", "apiSpec");

  try {
    const { data } = await client.post(
      endpoint.projects + `/${id}/uploads`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const useUploadProjectSpecs = (dbMutation) => {
  const projectDetails = useRecoilValue(projectAtom);

  const mutation = useMutation(uploadProjectSpecs, {
    onSuccess: (data) => {
      if (data?.projectId) {
        dbMutation.mutate({
          id: data?.projectId,
          files: projectDetails?.dbs,
        });
      }
    },
  });

  return mutation;
};

const uploadProjectDbs = async ({ id, files }) => {
  const bodyFormData = new FormData();

  files.forEach((file) => {
    bodyFormData.append("upload", file);
  });

  bodyFormData.append("type", "db");

  try {
    const { data } = await client.post(
      endpoint.projects + `/${id}/uploads`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const useUploadProjectDbs = (aiMutation) => {
  const mutation = useMutation(uploadProjectDbs, {
    onSuccess: (data) => {
      if (data?.projectId) {
        aiMutation.mutate({
          projectId: data?.projectId,
        });
      }
    },
  });

  return mutation;
};

const aiMatcher = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.aiMatcher, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const useAiMatcher = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(aiMatcher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.projects);
    },
  });

  return mutation;
};
