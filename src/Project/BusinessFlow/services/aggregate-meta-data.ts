import client from '@/shared/network/client';
import { getApiError } from '@/shared/utils';

import { CancelTokenSource } from 'axios';
import { AggregateMetaData, DeleteNodesAPIProps, FetchAPIProps } from '../interfaces';
import { prepareNodesAndEdgesFromAggregateMetaDataResponse } from '../transformers/flow';

export async function saveAggregateMetaData({ projectId, operationId, nodes, edges }: AggregateMetaData) {
    const url = `${process.env.REACT_APP_API_URL}/aggregateMetadata/${operationId}`;
    const requestData = {
        projectId,
        nodes,
        edges,
    };
    try {
        const { data } = await client.post(url, requestData);
        return data;
    } catch (error) {
        throw getApiError(error);
    }
}

export async function fetchAggregateMetaData({ projectId, operationId }: FetchAPIProps, source?: CancelTokenSource) {
    const baseUrl = process.env.REACT_APP_API_URL;

    const paramsObj = { projectId };
    const searchParams = new URLSearchParams(paramsObj);

    const url = `${baseUrl}/aggregateMetadata/${operationId}?${searchParams.toString()}`;

    const defaultResponse = {
        nodes: [],
        edges: [],
        projectId,
        operationId,
    };

    try {
        const response = await client.get(url, { cancelToken: source?.token });
        return prepareNodesAndEdgesFromAggregateMetaDataResponse(response.data);
    } catch (error) {
        console.log('error', getApiError(error));
        return defaultResponse;
    }
}

export async function deleteNodesOnServer(props: DeleteNodesAPIProps) {
    const url = `${process.env.REACT_APP_API_URL}/aggregateCards`;

    const { projectId, operationId, cardIdsToDelete, updatedAggregateMetadata, updatedResponseMapper } = props;

    const deleteDataObj = {
        projectId,
        operationId,
        cardIdsToDelete,
        updatedAggregateMetadata,
        updatedResponseMapper,
    };
    try {
        const response = await client.delete(url, { data: deleteDataObj });
        console.log(response);
    } catch (error) {
        throw getApiError(error);
    }
}
