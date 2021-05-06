import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

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
  const dbMutation = useUploadProjectDbs();
  const specsMutation = useUploadProjectSpecs(dbMutation);
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);

  const mutation = useMutation(addProject, {
    onSuccess: (data) => {
      setProjectDetails((currState) => {
        return {
          ...currState,
          id: data?._id,
        };
      });

      specsMutation.mutate({
        id: data?._id,
        files: projectDetails?.specs,
        type: "apiSpec",
      });
    },
  });

  return {
    addProjectMutation: mutation,
    uploadDbMutation: dbMutation,
    uploadSpecsMutation: specsMutation,
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
      dbMutation.mutate({
        id: projectDetails?.id,
        files: projectDetails?.dbs,
        type: "db",
      });
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

const useUploadProjectDbs = () => {
  const mutation = useMutation(uploadProjectDbs);

  return mutation;
};
