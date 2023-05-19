export const FLOW_NODE_FIELDS: string[] = [
    'id',
    'type',
    'parentNode',
    'inputNodeIds',
    'position',
    'width',
    'height',
    'selected',
    'positionAbsolute',
    'dragging',
];
export const FLOW_EDGE_FIELDS: string[] = ['id', 'source', 'target', 'selected', 'animated'];

export const NODE_FIELDS: string[] = ['type', 'name', 'parentNode', 'inputNodeIds', 'runData'];

export const EXTRA_NODE_FIELDS: string[] = [
    'nonDeletable',
    'width',
    'height',
    'positionAbsolute',
    'selected',
    'dragging',
];
export const EXTERNAL_API_NODE_DATA_FIELDS: string[] = [
    'url',
    'method',
    'headers',
    'queryParams',
    'pathParams',
    'body',
    'output',
];

export const BRANCH_DATA_CONDITON_FIELDS: string[] = [
    'conditionId',
    'conditionType',
    'rawExpression',
    'detailedExpression',
    'targetNodeIds',
];
export const MAIN_DATA_CONDITON_FIELDS: string[] = ['headers', 'queryParams', 'pathParams', 'body'];

export const FILTER_DATA_CONDITON_FIELDS: string[] = [
    'filtertype',
    'sourceNodeId',
    'targetNodeId',
    'replacedFields',
    'excludedFields',
];
/*
    url?: string;
    method?: Method;
    headers?: KeyValueProps[];
    queryParams?: KeyValueProps[];
    pathParams?: KeyValueProps[];
    body?: any;
    output?: ExternalAPIResponse;
*/

const PAYLOAD_BUILDER_NODE = 'payloadBuilderNode';
const FILTER_NODE = 'filterNode';
const BRANCH_NODE = 'branchNode';
const LOOP_NODE = 'loopNode';
const START_NODE = 'startNode';
const SELECTION_NODE = 'selectionNode';
const EXTERNAL_API_NODE = 'externalAPINode';
const MAIN_NODE = 'mainNode';

export const NODE_TYPES = {
    PAYLOAD_BUILDER_NODE,
    FILTER_NODE,
    BRANCH_NODE,
    LOOP_NODE,
    START_NODE,
    SELECTION_NODE,
    EXTERNAL_API_NODE,
    MAIN_NODE,
};

const MAIN_NODE_ID = 'main-node';
const START_NODE_ID = 'start-node';
const END_NODE_ID = 'end-node';

export const NON_DELETABLE_NODE_IDS = [MAIN_NODE_ID, START_NODE_ID, END_NODE_ID, MAIN_NODE];

export const MAXIMUM_BRANCH_CONDITIONS = 5;
