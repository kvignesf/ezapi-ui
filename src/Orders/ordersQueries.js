import _ from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { saveAs } from 'file-saver';

import client, { endpoint } from '../shared/network/client';
import { clearQueryCache, queries } from '../shared/network/queryClient';
import routes from '../shared/routes';
import { clearSession, setAccessToken } from '../shared/storage';
import { getApiError, getOs } from '../shared/utils';
import { getAccessToken } from '../shared/storage';
const acc_token = getAccessToken();

const getOrders = async () => {
  try {
    const { data } = await client.get(endpoint.orders, {
      headers: {
        Authorization: acc_token,
      },
    });
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetOrders = () => {
  return useQuery([queries.orders], getOrders, {
    refetchOnWindowFocus: false,
  });
};
