import { KeyValueProps } from './common';
import { ExternalAPI } from './external-api';

export interface BranchCondition {
    conditionId: string;
    conditionType: string; // if, elif or else
    rawExpression: string;
    detailedExpression: string;
    targetNodeIds: string[];
}

export interface BranchData {
    conditions: BranchCondition[];
}

export interface MainData {
    headers?: KeyValueProps[];
    queryParams?: KeyValueProps[];
    pathParams?: KeyValueProps[];
    body?: any;
}

export interface FilterData {}

export interface NewAggregateCard {
    projectId: string;
    operationId: string;
    type: string;
    name: string;
    parentNode: string;
    inputNodeIds: string[];
    runData?: ExternalAPI;
    branchData?: BranchData;
    mainData?: MainData;
    filterData?: FilterData;
    systemApi?: {
        operationDataId: {
            type: String;
        };
        sysProjectId: {
            type: String;
        };
    };
}

export interface AggregateCard extends NewAggregateCard {
    id: string;
}

export interface AggregateCardResponse extends NewAggregateCard {
    _id: string;
}
