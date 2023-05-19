import { ReactNode } from 'react';

import { KeyValueProps } from './common';

export interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
    noPadding?: Boolean;
}

export interface StructuredMappingData {
    relation: string;
    attributeName: string;
    attributeAPI: string;
    attributeType: string;
    attributeDataType: string;
    attributeRef: string;
    mappedAttributeName: string;
    mappedAttributeType: string;
    mappedAttributeAPI: string;
    mappedAttributeDataType: string;
    mappedAttributeRef: string;
}

export interface AggregateMappingProps {
    onClose: Function;
    nodeId: string;
    operationId: string;
    projectId: string;
    isResponse: boolean;
    inputNodeIds: string[];
}

export interface FilterDrawerProps {
    onClose: Function;
    nodeId: string;
    operationId: string;
    projectId: string;
    type: string;
    inputNodeIds: string[];
}

export interface AggregateMappingDataProps {
    projectId: string;
    operationId: string;
    cardId: string;
    relationsParams: StructuredMappingData[];
    relationsRequestBody: StructuredMappingData[];
    relationsHeaders: StructuredMappingData[];
}

export interface ResponseMappingDataProps {
    projectId: string;
    operationId: string;
    responseBody: StructuredMappingData[];
    responseHeaders: StructuredMappingData[];
}

export interface TreeNode {
    id: string;
    name: string;
    children: TreeNode[];
    type?: string;
    ref: string;
}

export interface MappingData {
    id: string;
    ref: string;
    parent: string;
    name: string;
    type?: string;
    relationId: string;
    relationRef: string;
    relationName: string;
    relationNode: string;
    relationParent: string;
}

export interface BranchQueryData {
    id: string;
    ref: string;
    name: string;
    conditionKey: string;
    value?: string | number;
    relationId?: string;
    relationRef?: string;
    relationName?: string;
    operator?: string;
}

export interface ValueCardRowProps {
    data: KeyValueProps;
    nodeType?: string;
    disableDelete?: boolean;
    onDelete: Function;
    disabled?: boolean;
    onChange: Function;
    iconSelector?: string;
    onDone?: Function;
}
export interface ValueCardProps {
    disableAdd?: boolean;
    disableDelete?: boolean;
    iconSelector?: string;
    onDone?: Function;
    onDelete?: Function;
    onSubmit?: Function;
    value?: KeyValueProps[];
    nodeType?: string;
    disabled?: boolean;
    onChange?: Function;
    isDrawer?: boolean;
}

export interface ResponseMapper {
    responseHeaders: KeyValueProps[];
    responseBody: KeyValueProps[];
}
