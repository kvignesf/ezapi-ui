import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import client, { endpoint } from "../shared/network/client";
import { clearQueryCache, queries } from "../shared/network/queryClient";
import routes from "../shared/routes";
import { clearSession, setAccessToken } from "../shared/storage";
import { getApiError } from "../shared/utils";

const updateProject = async ({
  id,
  projectName,
  addInvites,
  removeInvites,
}) => {
  let requestData = {};

  if (projectName && !_.isEmpty(projectName)) {
    requestData["projectName"] = projectName;
  }

  if (addInvites && !_.isEmpty(addInvites)) {
    requestData["addInvites"] = addInvites;
  }

  if (removeInvites && !_.isEmpty(removeInvites)) {
    requestData["removeInvites"] = removeInvites;
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

  const mutation = useMutation(updateProject, {
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
