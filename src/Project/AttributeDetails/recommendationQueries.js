import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";

import client, { endpoint } from "../../shared/network/client";
import { getApiError } from "../../shared/utils";

const getTables = async ({ projectId }) => {
  try {
    const { data } = await client.post(endpoint.tablesLookup, {
      projectId,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetTables = () => {
  const mutation = useMutation(getTables, {});

  return mutation;
};

const getAttrRecommendations = async ({ projectId, schema, attribute }) => {
  try {
    const { data } = await client.post(endpoint.recommendations, {
      projectId,
      schema,
      attribute,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetAttrRecommendations = () => {
  const mutation = useMutation(getAttrRecommendations, {});

  return mutation;
};
