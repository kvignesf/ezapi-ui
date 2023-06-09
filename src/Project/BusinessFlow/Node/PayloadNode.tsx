import responseMapperAtom from '@/shared/atom/reponseMapperAtom';
import ErrorWithMessage from '@/shared/components/ErrorWithMessage';
import { operationAtomWithMiddleware } from '@/shared/utils';
import { Button } from '@material-ui/core';
import { Card, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NodeProps, useNodeId } from 'reactflow';
import { useRecoilState } from 'recoil';
import Json from '../../../icons/Json.svg';
import Collapse from '../../../icons/collapse.svg';
import DialogIcon from '../../../icons/dialogIcon.svg';
import { NODE_TYPES } from '../constants';
import useNodeHook from '../hooks/useNodeHook';
import { AggregateCard } from '../interfaces';
import { NodeData } from '../interfaces/flow';
import { fetchAllAggregateCards } from '../services';
import { ResponseTab } from './Components/ResponseTab';

interface PayloadNodeProps extends NodeProps {}
interface DropDownProps {
    id: string;
    name: string;
}

const PayloadNode = (props: PayloadNodeProps): React.ReactElement => {
    const cardId: string = useNodeId() || '';
    const [collapse, setCollapse] = useState(false);
    const delayTimeSet = 2500;

    const [isFullMapping, setIsFullMapping] = useState(true);
    const [showResponseMapping, setShowResponseMapping] = useRecoilState(responseMapperAtom);
    const [isJsonValid, setIsJsonValid] = useState(true);

    const { projectId = '' }: { projectId: string } = useParams();
    const [operationData, _] = useRecoilState(operationAtomWithMiddleware);
    const operationId = operationData?.operation?.operationId;
    const [dropDownData, setDropDownData] = useState<DropDownProps[]>([]);
    const [selectedItem, setSelectedItem] = useState<DropDownProps | null>(null);

    const {
        node,
        isLoading,
        isNodeDataLoaded,
        isUpdateNodeOnServerDone,
        triggerDelayedNodeSaveOnServer,
        loadNodeDataFromServer,
    } = useNodeHook({
        nodeId: cardId,
        getUpdatedNodeData: getUpdatedNodeDataFn,
        collapse: collapse,
    });
    function getUpdatedNodeDataFn() {
        const newNodeData = props.data as NodeData;

        return {
            ...newNodeData,
            responsePayloadData: {
                customMapping: false,
                cardId: selectedItem?.id,
            },
        };
    }

    useEffect(() => {
        if (collapse) {
            loadNodeDataFromServer();
        }
    }, [collapse]);

    useEffect(() => {
        if (node?.data?.responsePayloadData?.cardId) {
            const name = dropDownData.find((x) => x.id === node?.data?.responsePayloadData?.cardId)?.name;
            setSelectedItem({ id: node?.data?.responsePayloadData?.cardId, name: name ?? '' });
        }
    }, [node]);

    const prepareData = async () => {
        const allCardsDataFromServer = await fetchAllAggregateCards({ operationId, projectId });
        const sortedData = allCardsDataFromServer
            .filter(
                (card: AggregateCard) =>
                    card.type === NODE_TYPES.EXTERNAL_API_NODE || card.type === NODE_TYPES.EXTERNAL_API_NODE_LOOP,
            )
            .map((card: AggregateCard) => ({
                name: card.name,
                id: card.id,
            }));

        const sorted2 = sortedData.filter((x: any) => x !== undefined);
        setDropDownData(sorted2);
    };

    useEffect(() => {
        if (collapse) prepareData();
    }, [collapse]);

    return (
        <Card sx={{ width: '390px' }}>
            <Stack
                direction={'row'}
                sx={{ borderBottom: '1px solid #C0CCDA', height: '52px', padding: '24px 16px' }}
                justifyContent={'space-between'}
            >
                <Stack direction={'row'}>
                    <img src={Json} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
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
                        Payload-builder
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
                </Stack>
            </Stack>
            {collapse && (
                <Stack justifyContent={'space-between'} sx={{ padding: '12px 16px 24px 16px', minHeight: '188px' }}>
                    <RadioGroup
                        aria-labelledby="controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={isFullMapping}
                        onChange={(e) => {
                            setIsFullMapping(e.target.value === 'true');
                        }}
                    >
                        <Stack direction={'row'}>
                            <FormControlLabel value={true} control={<Radio />} label="Map Full Response" />
                            <FormControlLabel value={false} control={<Radio />} label="Custom Mapping" />
                        </Stack>
                    </RadioGroup>
                    {isFullMapping && (
                        <Autocomplete
                            value={selectedItem}
                            options={dropDownData}
                            getOptionLabel={(option) => option.name}
                            onChange={(_event: SyntheticEvent, newValue) => {
                                setSelectedItem(newValue);
                            }}
                            clearIcon={null}
                            openOnFocus={true}
                            fullWidth={true}
                            style={{ width: '300px' }}
                            renderInput={(params) => <TextField {...params} label="Select a Card..." />}
                        />
                    )}

                    <Stack width={'100%'} direction={'row-reverse'} paddingTop={'24px'}>
                        {isFullMapping ? (
                            <Button
                                style={{ width: '100px', background: '#1565C0', color: '#FFF' }}
                                variant="contained"
                                onClick={() => {
                                    triggerDelayedNodeSaveOnServer();
                                }}
                            >
                                SAVE
                            </Button>
                        ) : (
                            <Button
                                style={{ width: '200px', background: '#1565C0', color: '#FFF' }}
                                variant="contained"
                                onClick={() => {
                                    setShowResponseMapping(true);
                                }}
                            >
                                Add Response Mapping
                            </Button>
                        )}
                    </Stack>
                    <Stack sx={{ width: '100%' }}>
                        <ResponseTab
                            editable={false}
                            isResponse={false}
                            displayTitle={false}
                            value={node?.data?.responsePayloadData?.data ?? {}}
                        />
                    </Stack>
                    {!isJsonValid && <ErrorWithMessage message={'invalid JSON'} className={'mb-3'} contained isError />}
                </Stack>
            )}
        </Card>
    );
};

export { PayloadNode, PayloadNodeProps };
