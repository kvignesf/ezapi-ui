import { Card, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

import Collapse from '../../../icons/collapse.svg';
import DialogIcon from '../../../icons/dialogIcon.svg';
import FilterIcon from '../../../icons/filter.svg';
import RunIcon from '../../../icons/runIcon.svg';

interface FilterNodeProps extends NodeProps {}

const FilterNode = (props: FilterNodeProps) => {
    const [collapse, setCollapse] = useState(true);

    return (
        <>
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={props.isConnectable}
            />
            <Card sx={{ width: '512px' }}>
                <Stack
                    direction={'row'}
                    sx={{ borderBottom: '1px solid #C0CCDA', height: '52px', padding: '24px 16px' }}
                    justifyContent={'space-between'}
                >
                    <Stack direction={'row'}>
                        <img src={FilterIcon} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
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
                            Filter
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
                            onClick={() => {}}
                        />
                    </Stack>
                </Stack>
                {!collapse && (
                    <>
                        <Stack
                            justifyContent={'space-around'}
                            sx={{ padding: '24px 16px', height: '120px', borderBottom: '1px solid #C0CCDA' }}
                        >
                            <Typography sx={{ fontSize: '14px', fontWeight: 600 }} color="text.primary" gutterBottom>
                                Replace Expression
                            </Typography>
                            <TextField
                                required={true}
                                variant="outlined"
                                onChange={() => {}}
                                sx={{
                                    width: '480px',
                                }}
                                inputProps={{ style: { height: '15px' } }}
                            />
                        </Stack>
                        <Stack justifyContent={'space-around'} sx={{ padding: '24px 16px', height: '120px' }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600 }} color="text.primary" gutterBottom>
                                Exclude Expression
                            </Typography>
                            <TextField
                                required={true}
                                variant="outlined"
                                onChange={() => {}}
                                sx={{
                                    width: '480px',
                                }}
                                inputProps={{ style: { height: '15px' } }}
                            />
                        </Stack>
                    </>
                )}
            </Card>
        </>
    );
};

export { FilterNode, FilterNodeProps };
