import _ from 'lodash';
import { useQuery } from 'react-query';
import client, { endpoint } from '../shared/network/client';
import { queries } from '../shared/network/queryClient';
import { getApiError, getOs } from '../shared/utils';

const getProductVideos = async () => {
  try {
    const { data } = await client.get(endpoint.productVideos);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const useGetProductVideos = () => {
  return useQuery([queries.productVideos], getProductVideos, {
    refetchOnWindowFocus: false,
  });
};
