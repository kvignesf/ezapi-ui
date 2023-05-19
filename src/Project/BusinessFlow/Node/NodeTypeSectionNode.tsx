import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import axios, { CancelTokenSource } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Handle, HandleType, Node, Position, useNodeId, XYPosition } from 'reactflow';
import ApiIcon from '../../../icons/ApiIcon.svg';
import BranchIcon from '../../../icons/branch.svg';
import FilterIcon from '../../../icons/filter.svg';
import FunctionIcon from '../../../icons/FunctionIcon.svg';
import Json from '../../../icons/Json.svg';
import LoopIcon from '../../../icons/LoopIcon.svg';
import { BusinessFlowContext } from '../BusinessFlowContext';
import { NODE_TYPES } from '../constants';
import { NodeProps, UpdateNodeAPIProps } from '../interfaces';
import { NewAggregateCard } from '../interfaces/aggregate-cards';
import { createAggregateCard, updateNodeOnServer } from '../services';
import { MyReactFlowState } from '../store';
import { prepareAggregateCardFromNode, prepareNodeFromAggregateCard } from '../transformers';

interface NodeTypeSelectionState {
    type: string;
    data: any;
}

function NodeTypeSectionNode(props: NodeProps) {
    const nodeId: string = useNodeId() || '';
    const { useStore, projectId, operationId } = useContext(BusinessFlowContext);
    const { xPos, yPos } = props;

    //const store = useStoreApi();

    const setNodeType = useStore((state: MyReactFlowState) => state.setNodeType);
    const addChildNode = useStore((state: MyReactFlowState) => state.addChildNode);

    const nodes = useStore((state: MyReactFlowState) => state.nodes);
    const numberOfNodes = (nodeType: string) => nodes.filter((node: Node) => node.type === nodeType).length;
    const [updateNodeDataProps, setUpdateNodeDataProps] = useState<NodeTypeSelectionState | null>();

    useEffect(() => {
        const source: CancelTokenSource = axios.CancelToken.source();

        const updateNodeDataOnServerFn = async () => {
            if (updateNodeDataProps) {
                console.log('NodeTypeSectionNode.nodes', nodes);

                const updatedNode: any = { ...nodes.find((node: Node) => node.id === nodeId) };
                updatedNode.type = updateNodeDataProps.type;
                updatedNode.data = {
                    ...updateNodeDataProps.data,
                };

                const updatedNodeRequestData: UpdateNodeAPIProps = {
                    card: prepareAggregateCardFromNode(updatedNode, projectId, operationId),
                    position: updatedNode.position,
                    setNodeType,
                };
                await updateNodeOnServer(updatedNodeRequestData, source);
            }
        };

        updateNodeDataOnServerFn();

        return () => {
            source.cancel('Cancelled previous request to update a node on server');
        };
    }, [updateNodeDataProps]);

    const attachNewExternalNodeToFilterNode = async () => {
        const newAggregateCardPosition: XYPosition = {
            x: xPos + 600,
            y: yPos,
        };

        const newAggregateCard: NewAggregateCard = {
            projectId,
            operationId,
            type: NODE_TYPES.EXTERNAL_API_NODE,
            name: `New Node ${nodes.length}`,
            parentNode: nodeId,
            inputNodeIds: [nodeId],
            runData: {
                method: 'post',
                url: '',
                headers: [],
                body: {
                    data: {},
                },
            },
            branchData: {
                conditions: [],
            },
            mainData: {},
        };
        const createdAggregateCard = await createAggregateCard(newAggregateCard);
        const newNode = prepareNodeFromAggregateCard(createdAggregateCard, newAggregateCardPosition);

        addChildNode({
            newNode: newNode,
            handleId: nodeId,
            handleType: 'source' as HandleType,
            triggerSaveFlowState: false,
            triggerUpdateHistory: false,
        });

        return newNode;
    };

    const handleNodeType = async (type: string) => {
        switch (type) {
            case 'API':
                setUpdateNodeDataProps({
                    type: NODE_TYPES.EXTERNAL_API_NODE,
                    data: {
                        commonData: {
                            ...props.data.commonData,
                        },
                        runData: {
                            ...(props.data.runData || {}),
                            method: 'GET',
                            url: '',
                            headers: [],
                            body: {
                                data: {},
                            },
                        },
                    },
                });
                break;
            case 'BRANCH':
                setNodeType(nodeId, NODE_TYPES.BRANCH_NODE, {
                    conditions: [],
                });
                break;
            case 'LOOP':
                setNodeType(nodeId, NODE_TYPES.LOOP_NODE, {});
                break;
            case 'FILTER':
                console.log('FILTER.props.data', props.data);
                const newNode = await attachNewExternalNodeToFilterNode();
                setUpdateNodeDataProps({
                    type: NODE_TYPES.FILTER_NODE,
                    data: {
                        commonData: {
                            ...props.data.commonData,
                            name: `New Filter ${numberOfNodes(NODE_TYPES.FILTER_NODE) + 1}`,
                        },
                        runData: {},
                        mainData: {},
                        filterData: {
                            ...(props.data.filterData || {}),
                            filterType: 'filter exclude and replace',
                            sourceNodeId: props.data.commonData.parentNode || '',
                            targetNodeId: newNode.id,
                            replacedFields: [],
                            excludedFields: [],
                        },
                    },
                });
                break;
            case 'PAYLOAD_BUILDER':
                setNodeType(nodeId, NODE_TYPES.PAYLOAD_BUILDER_NODE, {});
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={props.isConnectable}
            />
            <Stack sx={{ width: '182px', bgcolor: 'background.paper', border: '1px solid #C0CCDA' }}>
                <nav>
                    <List disablePadding>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleNodeType('API')}>
                            <ListItemButton disableGutters>
                                <ListItemIcon sx={{ minWidth: '35px', marginLeft: '14px' }}>
                                    <img src={ApiIcon} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
                                </ListItemIcon>
                                <ListItemText primary="API" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleNodeType('BRANCH')}>
                            <ListItemButton disableGutters>
                                <ListItemIcon sx={{ minWidth: '35px', marginLeft: '14px' }}>
                                    <img
                                        src={BranchIcon}
                                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Branch" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleNodeType('LOOP')}>
                            <ListItemButton disableGutters>
                                <ListItemIcon sx={{ minWidth: '35px', marginLeft: '14px' }}>
                                    <img
                                        src={LoopIcon}
                                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Loop" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleNodeType('FILTER')}>
                            <ListItemButton disableGutters>
                                <ListItemIcon sx={{ minWidth: '35px', marginLeft: '14px' }}>
                                    <img
                                        src={FilterIcon}
                                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Filter" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleNodeType('FUNCTION')}>
                            <ListItemButton disableGutters>
                                <ListItemIcon sx={{ minWidth: '35px', marginLeft: '14px' }}>
                                    <img
                                        src={FunctionIcon}
                                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Function" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleNodeType('PAYLOAD_BUILDER')}>
                            <ListItemButton disableGutters>
                                <ListItemIcon sx={{ minWidth: '35px', marginLeft: '14px' }}>
                                    <img src={Json} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
                                </ListItemIcon>
                                <ListItemText primary="Payload Builder" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Stack>
        </>
    );
}

export { NodeTypeSectionNode };
