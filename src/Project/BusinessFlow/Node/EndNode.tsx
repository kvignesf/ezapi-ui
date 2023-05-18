import { Card, Stack, Typography } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';

interface EndNodeProps extends NodeProps {}

const EndNode = (props: EndNodeProps) => {
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
            <Card sx={{ width: '360px' }}>
                <Stack
                    direction={'row'}
                    sx={{ borderBottom: '1px solid #C0CCDA', height: '52px', padding: '24px 16px' }}
                    justifyContent={'space-between'}
                >
                    <Stack direction={'row'}>
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
                            End Node
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </>
    );
};

export { EndNode, EndNodeProps };
