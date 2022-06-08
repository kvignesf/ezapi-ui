import _ from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import client, { endpoint } from '../shared/network/client';
import { clearQueryCache, queries } from '../shared/network/queryClient';
import routes from '../shared/routes';
import { clearSession, setAccessToken } from '../shared/storage';
import { getApiError } from '../shared/utils';
import projectAtom from './projectAtom';
import Snackbar from '@mui/material/Snackbar';
import { getUserId } from '../shared/storage';

let keyPath, certPath, caCertPath, savedProjectId;

const pricingData = async () => {
  /* const loggedInUserId = getUserId();

  const { data } = await client.get(endpoint.products2, {
    headers: {
      user_id: loggedInUserId
    },
  }); */
  const { data } = await client.get(endpoint.products2);
  return data;
};

const userProfile = async () => {
  try {
    const { data } = await client.get(endpoint.userProfile);
    return data;
  } catch (error) {
    // throw getApiError(error);
  }
};

export const usePricingData = () => {
  return useQuery([queries.products], pricingData, {
    refetchOnWindowFocus: false,
    fetchPolicy: "no-cache", 
  });
};

export const useUserProfile = () => {
  return useQuery([queries.userProfile], userProfile, {
    refetchOnWindowFocus: false,
    fetchPolicy: "no-cache", 
  });
};

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

export const useExportDBSchema = (aiMutation, onSuccess) => {
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();
  const mutation = useMutation(exportDBSchema, {
    onSuccess: (data) => {
      if (data) {
        if (!_.isEmpty(projectDetails.specs) && data.projectId) {
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
    throw getApiError(error);
  }
};

export const useDatabaseConnection = (onSuccess) => {
  const mutation = useMutation(databaseConnectionTest);
  return mutation;
};

export const useAddProject = (onSuccess) => {
  /*
    This is a chain API in the following order - 
    1. /project (POST) - uploads basic details of the project - name, invites
    2. /project/{project_id}/upload (POST) - uploads the spec files
    3. /project/{project_id}/upload (POST) - uploads the db files
  */
  const loggedInUserId = getUserId();

  const dbConnectionTestMutation = useDatabaseConnection(onSuccess);
  const aiMutation = useAiMatcher(onSuccess);
  const dbMutation = useUploadProjectDbs(aiMutation, onSuccess);
  const exportDBSchemaMutation = useExportDBSchema(aiMutation, onSuccess);

  const CACertificateMutation = useUploadProjectCACertificate(
    dbConnectionTestMutation,
    exportDBSchemaMutation,
    onSuccess
  );

  const certificateMutation = useUploadProjectCertificate(
    CACertificateMutation,
    onSuccess
  );

  const keyMutation = useUploadProjectKey(certificateMutation, onSuccess);

  const specsMutation = useUploadProjectSpecs(
    exportDBSchemaMutation,
    keyMutation,
    dbMutation,
    onSuccess
  );

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
            dbtype: projectDetails?.dbType,
          });
        } else if (
          !_.isEmpty(projectDetails?.host) ||
          !_.isEmpty(projectDetails?.port) ||
          !_.isEmpty(projectDetails?.username) ||
          !_.isEmpty(projectDetails?.database) ||
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
              userId: loggedInUserId,
              test: false,
            });
          } else {
            exportDBSchemaMutation.mutate({
              projectId: data?.projectId,
              sslMode: 'N',
              server: projectDetails?.host,
              port: projectDetails?.port,
              username: projectDetails?.username,
              password: projectDetails?.password,
              database: projectDetails?.database,
              type: projectDetails?.type,
              keyPath: '',
              certPath: '',
              rootPath: '',
            });
          }
        } else {
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
    dbConnectionTestMutation: dbConnectionTestMutation,
    exportDBSchemaMutation: exportDBSchemaMutation,
    caCertificateMutation: CACertificateMutation,
    certificateMutation: certificateMutation,
    keyMutation: keyMutation,
  };
};

const uploadProjectKey = async ({ projectId, file, userId, test }) => {
  const bodyFormData = new FormData();
  bodyFormData.append('upload', file);
  bodyFormData.append('userid', userId);
  bodyFormData.append('test', test);
  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/upload_To_GCP`,
      bodyFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const uploadProjectCertificate = async ({ projectId, file, userId, test }) => {
  const bodyFormData = new FormData();
  bodyFormData.append('upload', file);
  bodyFormData.append('userid', userId);
  bodyFormData.append('test', test);

  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/upload_To_GCP`,
      bodyFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

const uploadProjectCACertificate = async ({
  projectId,
  file,
  userId,
  test,
}) => {
  const bodyFormData = new FormData();
  bodyFormData.append('upload', file);
  bodyFormData.append('userid', userId);
  bodyFormData.append('test', test);
  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/upload_To_GCP`,
      bodyFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    bodyFormData.append('upload', file);
  });
  bodyFormData.append('type', 'apiSpec');
  bodyFormData.append('dbtype', 'spec');

  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/uploads`,
      bodyFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 480000,
      }
    );
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useUploadProjectKey = (certificateMutation, onSuccess) => {
  const loggedInUserId = getUserId();
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectKey, {
    onSuccess: (data) => {
      if (data?.url) {
        keyPath = data.url;
        if (projectDetails?.certificates) {
          if (data.test === true) {
            certificateMutation.mutate({
              projectId: loggedInUserId,
              file: projectDetails?.certificates[0],
              userId: loggedInUserId,
              test: true,
            });
          } else {
            certificateMutation.mutate({
              projectId: savedProjectId,
              file: projectDetails?.certificates[0],
              userId: loggedInUserId,
              test: false,
            });
          }
        }
      }
    },
  });

  return mutation;
};

export const useUploadProjectCertificate = (
  CACertificateMutation,
  onSuccess
) => {
  const loggedInUserId = getUserId();
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectCertificate, {
    onSuccess: (data) => {
      if (data?.url) {
        certPath = data.url;
        if (projectDetails?.caCertificates) {
          if (data.test === true) {
            CACertificateMutation.mutate({
              projectId: loggedInUserId,
              file: projectDetails?.caCertificates[0],
              userId: loggedInUserId,
              test: true,
            });
          } else {
            CACertificateMutation.mutate({
              projectId: savedProjectId,
              file: projectDetails?.caCertificates[0],
              userId: loggedInUserId,
              test: false,
            });
          }
        }
      }
    },
  });

  return mutation;
};

export const useUploadProjectCACertificate = (
  dbConnectionTestMutation,
  exportDBSchemaMutation,
  onSuccess
) => {
  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectCACertificate, {
    onSuccess: (data) => {
      if (data?.url) {
        caCertPath = data.url;
        if (data.test === true) {
          dbConnectionTestMutation.mutate({
            host: projectDetails.host,
            port: projectDetails.port,
            username: projectDetails.username,
            database: projectDetails.database,
            type: projectDetails.type,
            ssl: {
              sslFlag: true,
              certPath: certPath,
              keyPath: keyPath,
              rootPath: caCertPath,
            },
          });
        } else if (keyPath && certPath && caCertPath) {
          exportDBSchemaMutation.mutate({
            projectId: savedProjectId,
            sslMode: 'Y',
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

export const useUploadProjectSpecs = (
  exportDBSchemaMutation,
  keyMutation,
  dbMutation,
  onSuccess
) => {
  const loggedInUserId = getUserId();

  const projectDetails = useRecoilValue(projectAtom);
  const queryClient = useQueryClient();

  const mutation = useMutation(uploadProjectSpecs, {
    onSuccess: (data) => {
      if (data?.projectId) {
        if (!_.isEmpty(projectDetails?.dbs)) {
          dbMutation.mutate({
            projectId: data?.projectId,
            files: projectDetails?.dbs,
            dbtype: projectDetails?.dbType,
          });
        } else if (
          !_.isEmpty(projectDetails?.specs) ||
          !_.isEmpty(projectDetails?.host) ||
          !_.isEmpty(projectDetails?.port) ||
          !_.isEmpty(projectDetails?.username) ||
          !_.isEmpty(projectDetails?.database) ||
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
              userId: loggedInUserId,
            });
          } else {
            exportDBSchemaMutation.mutate({
              projectId: data?.projectId,
              sslMode: 'N',
              server: projectDetails?.host,
              port: projectDetails?.port,
              username: projectDetails?.username,
              password: projectDetails?.password,
              database: projectDetails?.database,
              type: projectDetails?.type,
              keyPath: '',
              certPath: '',
              rootPath: '',
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

const uploadProjectDbs = async ({ projectId, files, dbtype }) => {
  const bodyFormData = new FormData();

  files.forEach((file) => {
    bodyFormData.append('upload', file);
  });

  bodyFormData.append('type', 'db');
  bodyFormData.append('dbtype', dbtype);

  try {
    const { data } = await client.post(
      endpoint.projects + `/${projectId}/uploads`,
      bodyFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
          !_.isEmpty(projectDetails?.specs) &&
          (!_.isEmpty(projectDetails?.dbs) ||
            (!_.isEmpty(projectDetails?.host) &&
              !_.isEmpty(projectDetails?.port) &&
              !_.isEmpty(projectDetails?.username) &&
              !_.isEmpty(projectDetails?.database) &&
              !_.isEmpty(projectDetails?.type)))
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
