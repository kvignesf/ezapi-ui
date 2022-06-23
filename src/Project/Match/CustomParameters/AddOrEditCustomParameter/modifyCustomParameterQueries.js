import { useMutation, useQueryClient } from "react-query";
import client, { endpoint } from "../../../../shared/network/client";
import { queries } from "../../../../shared/network/queryClient";
import { getApiError } from "../../../../shared/utils";

const addCustomParameter = async ({
  projectId,
  name,
  type,
  tableName,
  columnName,
  functionName,
  filters,
  filtersRelation = [],
}) => {
  try {
    let isFiltersEmpty = false;
    if (filters?.length === 1) {
      if (filters[0].columnName.length === 0 || filters[0].conditionKey.length === 0 || filters[0].value.length === 0) {
       isFiltersEmpty = true
      }
    }
    const { data } = await client.post(endpoint.addCustomParameter, {
      projectID: projectId,
      data: {
        name,
        type,
        tableName,
        columnName,
        functionName,
        filters : isFiltersEmpty ? []: filters,
      },
    });
    return data;
  } catch (e) {
    throw e;
  }
};

export const useAddCustomParameter = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(addCustomParameter, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.customParameters);
    },
  });

  return mutation;
};

const editCustomParameter = async ({
  projectId,
  customParamID,
  name,
  type,
  tableName,
  columnName,
  functionName,
  filters,
}) => {
  try {
    let isFiltersEmpty = false;
    if (filters?.length === 1) {
      if (filters[0].columnName.length === 0 || filters[0].conditionKey.length === 0 || filters[0].value.length === 0) {
       isFiltersEmpty = true
      }
    }
    const { data } = await client.patch(endpoint.editCustomParameter, {
      projectID: projectId,
      customParamID,
      data: {
        name,
        type,
        tableName,
        columnName,
        functionName,
        filters : isFiltersEmpty ? []: filters,
      },
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useEditCustomParameter = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(editCustomParameter, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.customParameters);
    },
  });

  return mutation;
};
