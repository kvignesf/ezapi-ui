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

const getSchemaRecommendations = async ({ projectId, schema }) => {
  try {
    const { data } = await client.post(endpoint.schemaRecommendations, {
      projectId,
      schema,
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetSchemaRecommendations = () => {
  const mutation = useMutation(getSchemaRecommendations, {});

  return mutation;
};

// const saveSchemaRecommendation = async ({
//   projectId,
//   schema,
//   schemaSchemaibute,
//   path,
//   level,
//   tableName,
//   tableSchemaibute,
// }) => {
//   if (!tableName) {
//     throw Error("Please select a table name");
//   }

//   if (!tableSchemaibute) {
//     throw Error("Please select a column name");
//   }

//   try {
//     const { data } = await client.post(endpoint.saveSchemaibuteMatch, {
//       projectId,
//       schema,
//       schemaSchemaibute,
//       path,
//       level,
//       tableName,
//       tableSchemaibute,
//     });
//     return data;
//   } catch (error) {
//     throw getApiError(error);
//   }
// };

// export const useSaveSchemaRecommendations = () => {
//   const mutation = useMutation(saveSchemaRecommendation, {});

//   return mutation;
// };
