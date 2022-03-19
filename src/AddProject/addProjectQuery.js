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
import Snackbar from "@mui/material/Snackbar";
import { getUserId } from "../shared/storage";

const loggedInUserId = getUserId();
let keyPath, certPath, caCertPath, savedProjectId;

const exportDBSchema = async ({
  projectId,
  sslMode,
  server,
  port,
  username,
  password,
  database,
  type,
  keyPath,
  certPath,
  rootPath,
}) => {
  try {
    const { data } = await client.post(
      endpoint.exportDBSchema,
      {
        projectId: projectId,
        sslMode: sslMode,
        server: server,
        portNo: port,
        username: username,
        password: password,
        database: database,
        dbtype: type,
        keyPath: keyPath,
        certPath: certPath,
        rootPath: rootPath,
      },
      {
        timeout: 90000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useExportDBSchema = (aiMutaiton, onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const aiMutation = useAiMatcher(onSuccess);
  const queryClient = useQueryClient();


  const mutation = useMutation(exportDBSchema, {
    onSuccess: (data) => {
      if (data) {
        if (!_.isEmpty(projectDetails.specs) && data.projectId) {
          aiMutation.mutate({
            projectId: data?.projectId,
          });
        }
        else {
          onSuccess(data?.projectId);
          queryClient.invalidateQueries(queries.projects);
        }
      }
    },
  });
  return mutation;
};

const addProject = async ({ name, invitees }) => {
  try {
    const { data } = await client.post(
      endpoint.project,
      {
        projectName: name,
        invites: invitees,
      },
      {
        timeout: 90000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const databaseConnectionTest = async (formData) => {
  try {
    const { data } = await client.post(endpoint.testDBConnection, formData);
    return data;
  } catch (error) {
    console.log("**********", error);
    throw getApiError(error);
  }
};

export const useDatabaseConnection = (onSuccess) => {
  const mutation = useMutation(databaseConnectionTest, {
    onSuccess: (data) => {
      console.log("dataResponse : ", data);
      if (data.status === "success") {
        console.log("entered!!!");
      }
    },
  });
  return mutation;
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
  const specsMutation = useUploadProjectSpecs(
    aiMutation,
    dbMutation,
    onSuccess
  );
  const keyMutation = useUploadProjectKey(onSuccess);
  const certificateMutation = useUploadProjectCertificate(onSuccess);
  const exportDBSchemaMutation = useExportDBSchema(aiMutation, onSuccess);

  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(addProject, {
    onSuccess: (data) => {
      if (data) {
        savedProjectId = data.projectId;
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
        } else if (
          !_.isEmpty(projectDetails?.host) &&
          !_.isEmpty(projectDetails?.port) &&
          !_.isEmpty(projectDetails?.username) &&
          !_.isEmpty(projectDetails?.database) &&
          !_.isEmpty(projectDetails?.type)
        ) {
          if (
            !_.isEmpty(projectDetails?.keys) &&
            !_.isEmpty(projectDetails?.certificates) &&
            !_.isEmpty(projectDetails?.caCertificates)
          ) {
            keyMutation.mutate({
              projectId: data?.projectId,
              file: projectDetails?.keys[0],
            });
          } else {
            exportDBSchemaMutation.mutate({
              projectId: data?.projectId,
              sslMode: "N",
              server: projectDetails?.host,
              port: projectDetails?.port,
              username: projectDetails?.username,
              password: projectDetails?.password,
              database: projectDetails?.database,
              type: projectDetails?.type,
              keyPath: "",
              certPath: "",
              rootPath: "",
            });
          }
        }
        // if (!_.isEmpty(projectDetails?.keys)) {
        //   keyMutation.mutate({
        //     projectId: data?.projectId,
        //     file: projectDetails?.keys[0],
        //   });
        // }
        // if (!_.isEmpty(projectDetails?.certificates)) {
        //   certificateMutation.mutate({
        //     projectId: data?.projectId,
        //     file: projectDetails?.certificates[0],
        //   });
        // }
        // if (!_.isEmpty(projectDetails?.caCertificates)) {
        //   CACertificateMutation.mutate({
        //     projectId: data?.projectId,
        //     file: projectDetails?.caCertificates[0],
        //   });
        // }
        else {
          onSuccess(data?.projectId);
          queryClient.invalidateQueries(queries.projects);
        }
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

const uploadProjectKey = async ({ projectId, file }) => {
  const bodyFormData = new FormData();
  bodyFormData.append("upload", file);
  bodyFormData.append("userid", loggedInUserId);
  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/upload_To_GCP`,
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

const uploadProjectCertificate = async ({ projectId, file }) => {
  const bodyFormData = new FormData();
  bodyFormData.append("upload", file);
  bodyFormData.append("userid", loggedInUserId);
  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/upload_To_GCP`,
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

const uploadProjectCACertificate = async ({ projectId, file }) => {
  const bodyFormData = new FormData();
  // bodyFormData.append("upload", file);
  bodyFormData.append("upload", file);
  bodyFormData.append("userid", loggedInUserId);
  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/upload_To_GCP`,
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

export const useUploadProjectKey = (onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const certificateMutation = useUploadProjectCertificate(onSuccess);

  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectKey, {
    onSuccess: (data) => {
      if (data?.url) {
        keyPath = data.url;
        if (projectDetails?.certificates) {
          certificateMutation.mutate({
            projectId: savedProjectId,
            file: projectDetails?.certificates[0],
          });
        }
      }
    },
  });

  return mutation;
};

export const useUploadProjectCertificate = (onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const CACertificateMutation = useUploadProjectCACertificate(onSuccess);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectCertificate, {
    onSuccess: (data) => {
      if (data?.url) {
        certPath = data.url;
        if (projectDetails?.caCertificates) {
          CACertificateMutation.mutate({
            projectId: savedProjectId,
            file: projectDetails?.caCertificates[0],
          });
        }
      }
    },
  });

  return mutation;
};

export const useUploadProjectCACertificate = (onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const aiMutation = useAiMatcher(onSuccess);
  const exportDBSchemaMutation = useExportDBSchema(aiMutation, onSuccess);

  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectCACertificate, {
    onSuccess: (data) => {
      console.log("prprpr", data);
      if (data?.url) {
        caCertPath = data.url;
        if (keyPath && certPath && caCertPath) {
          exportDBSchemaMutation.mutate({
            projectId: savedProjectId,
            sslMode: "Y",
            server: projectDetails?.host,
            port: projectDetails?.port,
            username: projectDetails?.username,
            password: projectDetails?.password,
            database: projectDetails?.database,
            type: projectDetails?.type,
            keyPath: keyPath,
            certPath: certPath,
            rootPath: caCertPath,
          });
        }
      }
    },
  });

  return mutation;
};

export const useUploadProjectSpecs = (aiMutation, dbMutation, onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const keyMutation = useUploadProjectKey(onSuccess);
  const certificateMutation = useUploadProjectCertificate(onSuccess);
  const exportDBSchemaMutation = useExportDBSchema(aiMutation, onSuccess);
  const CACertificateMutation = useUploadProjectCACertificate(onSuccess);

  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectSpecs, {
    onSuccess: (data) => {
      if (data?.projectId) {
        if (!_.isEmpty(projectDetails?.dbs)) {
          dbMutation.mutate({
            projectId: data?.projectId,
            files: projectDetails?.dbs,
          });
        } else if (
          !_.isEmpty(projectDetails?.specs) &&
          !_.isEmpty(projectDetails?.host) &&
          !_.isEmpty(projectDetails?.port) &&
          !_.isEmpty(projectDetails?.username) &&
          !_.isEmpty(projectDetails?.database) &&
          !_.isEmpty(projectDetails?.type)
        ) {
          console.log("Manojjjj");
          if (
            !_.isEmpty(projectDetails?.keys) &&
            !_.isEmpty(projectDetails?.certificates) &&
            !_.isEmpty(projectDetails?.caCertificates)
          ) {
            keyMutation.mutate({
              projectId: data?.projectId,
              file: projectDetails?.keys[0],
            });
          } else {
            exportDBSchemaMutation.mutate({
              projectId: data?.projectId,
              sslMode: "N",
              server: projectDetails?.host,
              port: projectDetails?.port,
              username: projectDetails?.username,
              password: projectDetails?.password,
              database: projectDetails?.database,
              type: projectDetails?.type,
              keyPath: "",
              certPath: "",
              rootPath: "",
            });
          }
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
      console.log("##MANOJ");
      console.log("data:", data);
      if (data?.projectId) {
        if (
          !_.isEmpty(projectDetails?.specs) &&
          (!_.isEmpty(projectDetails?.dbs) ||
            (!_.isEmpty(projectDetails?.host) &&
              !_.isEmpty(projectDetails?.port) &&
              !_.isEmpty(projectDetails?.username) &&
              !_.isEmpty(projectDetails?.database) &&
              !_.isEmpty(projectDetails?.type)))
        ) {
          console.log("data:", data);
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
