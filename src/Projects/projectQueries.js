import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { saveAs } from "file-saver";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError } from "../shared/utils";

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
    const { data } = await client.post(endpoint.downloadSpec, {
      projectId,
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
    const { data } = await client.post(endpoint.downloadArtifact, {
      projectId,
    });
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
        // const link = data?.downloadUrl;
        const link =
          "https://storage.googleapis.com/ezpai-poc/proj_af8a3781-a410-49ae-9f07-e01645490783/proj_spec.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ezapi-filecopyservice%40civic-access-286104.iam.gserviceaccount.com%2F20210623%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210623T133826Z&X-Goog-Expires=901&X-Goog-SignedHeaders=host&X-Goog-Signature=981a27042ca3d92de0c125ca16b0ba92c38ca1c2d785c8010061b6aa63f616cd8d5f852107f8a07e903c5a47ba73702927c080c8e6bfd06ea881dc6d222505bf5fa28915084c76859ff35570f836baeb06f0b88307a968c17561996f2c31b606bb1fd83bf7383098df604cfbfff21d717524a1b64486014e5c5237fbc1ba2aaf14e3adf62e74068497ea1678e345a107eb61ed00676fde76b8736baa7d0fcd432313edf5947eab2092fb8fd1311643e6b4d00a7ec2395e4f2143763848ecdcdd38d9c041802b210a2fd6f6410698eaa126aa98000c724ce515b2b274f9bd246466dc556a7560ea559d3055fd4c02ccbda627d0d99c210688777490440c4e874d";

        const filename = link.substring(link.lastIndexOf("/") + 1);
        saveAs(link, filename);
      }
    },
  });

  return mutation;
};
