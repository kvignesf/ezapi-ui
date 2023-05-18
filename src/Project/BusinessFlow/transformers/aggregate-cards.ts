import { AggregateCard, Node } from '../interfaces';
import { prepareBranchData, prepareExternalAPIData, prepareFilterData, prepareMainData } from './utils';

export const prepareAggregateCard = (responseData: any): AggregateCard => {
    const aggregateCard: AggregateCard = {
        id: responseData['_id'],
        projectId: responseData.projectId,
        operationId: responseData.operationId,
        type: responseData.type,
        name: responseData.name,
        parentNode: responseData.parentNode || '',
        inputNodeIds: responseData.inputNodeIds || [],
        runData: prepareExternalAPIData(responseData.runData),
        branchData: prepareBranchData(responseData.branchData),
        mainData: prepareMainData(responseData.mainData),
        filterData: prepareFilterData(responseData.mainData),
        // systemApi: node.systemApi,
    };
    return aggregateCard;
};

export const prepareAggregateCards = (responseData: any[]): AggregateCard[] => {
    return responseData.map((card) => prepareAggregateCard(card));
};

export const prepareAggregateCardFromNode = (node: Node, projectId: string, operationId: string): AggregateCard => {
    const aggregateCard: AggregateCard = {
        id: node.id,
        projectId,
        operationId,
        type: node.type as string,
        name: node.data.commonData.name,
        parentNode: node.data.commonData.parentNode || '',
        inputNodeIds: node.data.commonData.inputNodeIds || [],
        runData: prepareExternalAPIData(node.data.runData),
        branchData: prepareBranchData(node.data.branchData),
        mainData: prepareMainData(node.data.mainData),
        filterData: prepareFilterData(node.data.filterData),
        // systemApi: node.systemApi,
    };
    return aggregateCard;
};
