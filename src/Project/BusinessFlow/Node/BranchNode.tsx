import branchQueryAtom from '@/shared/atom/branchQueryAtom';
import selectedNodeAtom from '@/shared/atom/selectedNodeAtom';
import { Add } from '@mui/icons-material';
import { Button, Card, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Edge, Handle, NodeProps, Position, useNodeId } from 'reactflow';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import BranchIcon from '../../../icons/branch.svg';
import Collapse from '../../../icons/collapse.svg';
import DialogIcon from '../../../icons/dialogIcon.svg';
import RunIcon from '../../../icons/runIcon.svg';
import { BusinessFlowContext } from '../BusinessFlowContext';
import { MAXIMUM_BRANCH_CONDITIONS } from '../constants';
import useNodeHook from '../hooks/useNodeHook';
import { BranchCondition } from '../interfaces/aggregate-cards';
import { NodeData } from '../interfaces/flow';
import { MyReactFlowState } from '../store';
import { Branch } from './Components/Branch';
import { ResponseTab } from './Components/ResponseTab';

interface BranchNodeProps extends NodeProps {}

const BranchNode = (props: BranchNodeProps) => {
    const cardId: string = useNodeId() || '';
    const { useStore } = useContext(BusinessFlowContext);

    const edges = useStore((state: MyReactFlowState) => state.edges);
    const outEdges = edges.filter((edge: Edge) => edge.source === cardId && edge.sourceHandle);

    const nodeRef: any = useRef();

    const [branchConditions, setBranchConditions] = useState<BranchCondition[]>([]);
    const [disableAdd, setDisableAdd] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [collapse, setCollapse] = useState(true);

    const [selectedBranchCondition, setSelectedBranchCondition] = useRecoilState(branchQueryAtom);
    const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);

    const [dimensions, setDimensions] = useState({ width: 20, height: 100 });

    const { node, setNode, isNodeDataLoaded, setTriggerNodeSaveOnServer, triggerDelayedNodeSaveOnServer } = useNodeHook(
        {
            nodeId: cardId,
            getUpdatedNodeData: getUpdatedNodeDataFn,
            collapse: collapse,
        },
    );

    function getUpdatedNodeDataFn() {
        const newNodeData = (_.isEmpty(props.data) ? {} : props.data) as NodeData;
        return { ...newNodeData, branchData: { conditions: branchConditions } };
    }

    useEffect(() => {
        if (isNodeDataLoaded && node && props.data.branchData) {
            const conditions = props.data.branchData.conditions || [];
            setNode({
                ...node,
                data: {
                    ...node.data,
                    branchData: { conditions },
                },
            });
        }
    }, [props]);

    useEffect(() => {
        if (node && node.data.branchData && node.data.branchData.conditions) {
            setBranchConditions(node.data.branchData.conditions);
        }
    }, [node]);

    useEffect(() => {
        if (branchConditions.length) {
            if (
                branchConditions.length >= MAXIMUM_BRANCH_CONDITIONS ||
                branchConditions[branchConditions.length - 1].conditionType == 'else'
            ) {
                setDisableAdd(true);
            } else {
                setDisableAdd(false);
            }
        }
    }, [branchConditions]);

    useLayoutEffect(() => {
        if (nodeRef.current) {
            setDimensions({
                width: nodeRef.current.offsetWidth + dimensions.width,
                height: nodeRef.current.offsetHeight + dimensions.height + 100,
            });
        }
    }, []);

    // const positionHandle = (index: number) => {
    //     if (index === 1 || index === 2) {
    //         return (dimensions.height / 3) * index;
    //     } else if (index === 3) {
    //         return 0;
    //     } else if (index === 4) {
    //         return dimensions.height;
    //     }
    //     return (dimensions.height / 3) * index;
    // };

    const positionHandle = (_index: number) => {
        if (collapse) {
            return 20;
        }

        if (branchConditions.length === 1) {
            return Math.round(dimensions.height / 2);
        } else if (branchConditions.length === 2) {
            return Math.round(dimensions.height / 4) + _index * 100;
        } else if (branchConditions.length === 3) {
            return Math.round(dimensions.height / 5) + _index * 100;
        }

        return Math.round(dimensions.height / branchConditions.length) + _index * 100;
    };

    const renderOutEdgeHandles = useMemo(() => {
        return outEdges.map((edge: Edge) => {
            const handleId = edge.sourceHandle ? edge.sourceHandle : edge.source;
            return (
                <Handle
                    key={handleId}
                    type="source"
                    id={handleId}
                    position={Position.Right}
                    style={{ background: '#555' }}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={false}
                    className="react-flow__handle__muted"
                />
            );
        });
    }, [outEdges]);

    const renderBranchHandles = useMemo(() => {
        return branchConditions.map((branchCondition: BranchCondition, index: number) => (
            <Handle
                key={branchCondition.conditionId}
                id={branchCondition.conditionId}
                type="source"
                position={Position.Right}
                style={{ background: '#555', top: positionHandle(index + 1) }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={props.isConnectable}
            />
        ));
    }, [branchConditions, dimensions, collapse]);

    const renderBranchConditions = useMemo(() => {
        return branchConditions.map((branchCondition: BranchCondition, index) => (
            <Stack key={`branch-stack-${branchCondition.conditionId ?? index}`}>
                <Branch
                    onClick={() => {
                        if (branchCondition.conditionType !== 'else') {
                            setSelectedBranchCondition(branchCondition.conditionId);
                            setSelectedNode(cardId);
                        }
                    }}
                    branchCondition={branchCondition}
                    index={index}
                    positionHandle={positionHandle}
                    isConnectable={props.isConnectable}
                    branchConditions={branchConditions}
                    setBranchConditions={setBranchConditions}
                    setTriggerNodeSaveOnServer={setTriggerNodeSaveOnServer}
                    triggerDelayedNodeSaveOnServer={triggerDelayedNodeSaveOnServer}
                />
            </Stack>
        ));
    }, [branchConditions]);

    return (
        <div ref={nodeRef}>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={props.isConnectable}
            />
            {Boolean(collapse && outEdges.length) && renderOutEdgeHandles}
            {Boolean(!collapse && branchConditions.length) && renderBranchHandles}

            <Card sx={{ width: '512px' }}>
                <Stack
                    direction={'row'}
                    sx={{ borderBottom: '1px solid #C0CCDA', height: '52px', padding: '24px 16px' }}
                    justifyContent={'space-between'}
                >
                    <Stack direction={'row'}>
                        <img src={BranchIcon} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
                        <Typography
                            sx={{
                                fontSize: '16px',
                                alignSelf: 'center',
                                marginBottom: '0',
                                fontWeight: 600,
                                paddingLeft: '8px',
                            }}
                            color="text.primary"
                            gutterBottom
                        >
                            Branch
                        </Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={1}>
                        <img
                            src={Collapse}
                            style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                            onClick={() => {
                                setCollapse(!collapse);
                            }}
                        />
                        <img src={DialogIcon} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
                        <img
                            src={RunIcon}
                            style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                            onClick={() => {
                                setShowResponse(!showResponse);
                            }}
                        />
                    </Stack>
                </Stack>
                {!collapse && (
                    <>
                        <Stack
                            justifyContent={'space-around'}
                            sx={{ padding: '24px 16px', borderBottom: '1px solid #C0CCDA' }}
                        >
                            {/* {branchConditions.map((branchCondition: BranchCondition, index) => (
                                <Branch
                                    key={`branch-node-${branchCondition.conditionId ?? index}`}
                                    branchCondition={branchCondition}
                                    index={index}
                                    positionHandle={positionHandle}
                                    isConnectable={props.isConnectable}
                                    branchConditions={branchConditions}
                                    setBranchConditions={setBranchConditions}
                                    setTriggerNodeSaveOnServer={setTriggerNodeSaveOnServer}
                                    triggerDelayedNodeSaveOnServer={triggerDelayedNodeSaveOnServer}
                                />
                            ))} */}
                            {renderBranchConditions}

                            <Button
                                color={'primary'}
                                variant="contained"
                                sx={{ marginTop: '24px', height: '30px', textTransform: 'none' }}
                                onClick={() => {
                                    let conditionType: string = 'if';
                                    if (branchConditions.length) {
                                        conditionType = 'else';
                                    }
                                    const newBranchCondition: BranchCondition = {
                                        conditionId: uuidv4(),
                                        conditionType: conditionType,
                                        rawExpression: '',
                                        detailedExpression: '',
                                        targetNodeIds: [],
                                    };
                                    setBranchConditions([...branchConditions, newBranchCondition]);

                                    triggerDelayedNodeSaveOnServer();
                                }}
                                startIcon={<Add />}
                                disabled={disableAdd}
                            >
                                Add Branch
                            </Button>
                        </Stack>
                    </>
                )}
                {showResponse && (
                    <Stack width="100%">
                        <ResponseTab />
                    </Stack>
                )}
            </Card>
        </div>
    );
};

export { BranchNode, BranchNodeProps };
