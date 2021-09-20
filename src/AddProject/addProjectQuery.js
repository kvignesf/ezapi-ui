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

export const useAddProject = (onSuccess) => {
  /*
    This is a chain API in the following order - 
    1. /project (POST) - uploads basic details of the project - name, invites
    2. /project/{project_id}/upload (POST) - uploads the spec files
    3. /project/{project_id}/upload (POST) - uploads the db files
  */
  const aiMutation = useAiMatcher(onSuccess);
  const dbMutation = useUploadProjectDbs(aiMutation, onSuccess);
  const specsMutation = useUploadProjectSpecs(dbMutation, onSuccess);
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(addProject, {
    onSuccess: (data) => {
      if (!_.isEmpty(projectDetails?.specs)) {
        specsMutation.mutate({
          projectId: data?.projectId,
          files: projectDetails?.specs,
        });
      } else if (!_.isEmpty(projectDetails?.dbs)) {
        dbMutation.mutate({
          projectId: data?.projectId,
          files: projectDetails?.dbs,
        });
      } else {
        onSuccess(data?.projectId);
        queryClient.invalidateQueries(queries.projects);
      }
    },
  });

  return {
    addProjectMutation: mutation,
    uploadDbMutation: dbMutation,
    uploadSpecsMutation: specsMutation,
    aiMatcherMutation: aiMutation,
  };
};

const uploadProjectSpecs = async ({ projectId, files }) => {
  const bodyFormData = new FormData();

  files.forEach((file) => {
    bodyFormData.append("upload", file);
  });
  bodyFormData.append("type", "apiSpec");

  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/uploads`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const useUploadProjectSpecs = (dbMutation, onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectSpecs, {
    onSuccess: (data) => {
      if (data?.projectId) {
        if (!_.isEmpty(projectDetails?.dbs)) {
          dbMutation.mutate({
            projectId: data?.projectId,
            files: projectDetails?.dbs,
          });
        } else {
          onSuccess(data?.projectId);
          queryClient.invalidateQueries(queries.projects);
        }
      }
    },
  });

  return mutation;
};

const uploadProjectDbs = async ({ projectId, files }) => {
  const bodyFormData = new FormData();

  files.forEach((file) => {
    bodyFormData.append("upload", file);
  });

  bodyFormData.append("type", "db");

  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/uploads`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const useUploadProjectDbs = (aiMutation, onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectDbs, {
    onSuccess: (data) => {
      if (data?.projectId) {
        if (
          !_.isEmpty(projectDetails?.dbs) &&
          !_.isEmpty(projectDetails?.specs)
        ) {
          aiMutation.mutate({
            projectId: data?.projectId,
          });
        } else {
          onSuccess(data?.projectId);
          queryClient.invalidateQueries(queries.projects);
        }
      }
    },
  });

  return mutation;
};

const aiMatcher = async ({ projectId }) => {
  try {
    const { data } = await client.post(
      endpoint.aiMatcher,
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

const useAiMatcher = (onSuccess) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(aiMatcher, {
    onSuccess: (data) => {
      onSuccess(data?.projectId);
      queryClient.invalidateQueries(queries.projects);
    },
  });

  return mutation;
};
