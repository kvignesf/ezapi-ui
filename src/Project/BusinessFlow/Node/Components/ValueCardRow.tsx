import { Delete } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import { Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ValueCardRowProps } from '../../interfaces';
export const ValueCardRow = (props: ValueCardRowProps) => {
    const {
        data,
        onDelete,
        onDone,
        disabled = false,
        nodeType = '',
        disableDelete = false,
        iconSelector = 'delete',
        onChange = () => {},
    } = props;

    const [dataValue, setDataValue] = useState(data.value);
    const [dataKey, setDataKey] = useState(data.key);
    const [render, setRender] = useState(false);

    useEffect(() => {
        onChange({
            key: dataKey,
            value: dataValue,
        });
    }, [render]);
    return (
        <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginBottom: '12px' }}>
            <Stack>
                <TextField
                    required={true}
                    variant="outlined"
                    value={dataKey}
                    disabled={disabled || nodeType === 'main'}
                    onChange={(e) => {
                        setDataKey(e.target.value);
                    }}
                    onBlur={() => {
                        setRender(!render);
                    }}
                    sx={{
                        width: '140px',
                    }}
                    inputProps={{ style: { height: '15px' } }}
                />
            </Stack>
            <Stack>
                <TextField
                    required={true}
                    value={dataValue}
                    disabled={disabled}
                    variant="outlined"
                    onChange={(e) => {
                        setDataValue(e.target.value);
                    }}
                    onBlur={() => {
                        setRender(!render);
                    }}
                    sx={{
                        width: '230px',
                    }}
                    inputProps={{ style: { height: '15px' } }}
                />
            </Stack>
            {!disableDelete &&
                nodeType !== 'main' &&
                (iconSelector === 'delete' ? (
                    <Delete
                        color={disabled ? 'disabled' : 'error'}
                        sx={{ alignSelf: 'center' }}
                        onClick={() => {
                            if (!disabled) {
                                onDelete();
                            }
                        }}
                    />
                ) : (
                    <DoneIcon
                        color="primary"
                        sx={{ alignSelf: 'center' }}
                        onClick={() => {
                            // @ts-expect-error
                            onDone();
                        }}
                    />
                ))}
        </Stack>
    );
};
