import _ from "lodash";
import { useMutation, useQueryClient } from "react-query";

import client, { endpoint } from "../../../../shared/network/client";
import { queries } from "../../../../shared/network/queryClient";
import { getApiError } from "../../../../shared/utils";

const addParameter = async ({
  projectId,
  attribute,
  description,
  dataType,
  required,
  possibleValues,
}) => {
  try {
    const { data } = await client.post(endpoint.addParameter, {
      projectId,
      data: {
        name: attribute,
        type: dataType,
        description,
        possibleValues: possibleValues?.split(",")?.map((item) => {
          return item.trim(" ");
        }),
        isRequired: required,
      },
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useAddParameter = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(addParameter, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(queries.parameters);
    },
  });

  return mutation;
};
