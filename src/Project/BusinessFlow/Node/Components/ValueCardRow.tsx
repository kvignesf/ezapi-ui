import { Delete } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ValueCardRowProps } from '../../interfaces';
export const ValueCardRow = (props: ValueCardRowProps) => {
    const {
        data,
        onDelete,
        onDone,
        isHeader = false,
        disabled = false,
        nodeType = '',
        cardType = 'node',
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
                {isHeader ? (
                    <Autocomplete
                        options={['Authorization']}
                        freeSolo
                        clearIcon={null}
                        inputValue={data.key}
                        onInputChange={(event, newInputValue) => {
                            console.log(event);
                            onChange({ key: newInputValue, value: data.value });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                variant="outlined"
                                disabled={disabled || nodeType === 'main'}
                                sx={{ width: cardType === 'node' ? '140px' : '520px' }}
                                inputProps={{ ...params.inputProps, style: { height: '15px' } }}
                            />
                        )}
                    />
                ) : (
                    <TextField
                        required={true}
                        variant="outlined"
                        value={data.key}
                        disabled={disabled || nodeType === 'main'}
                        onChange={(e) => {
                            onChange({ key: e.target.value, value: data.value });
                        }}
                        sx={{ width: cardType === 'node' ? '140px' : '420px' }}
                        inputProps={{ style: { height: '15px' } }}
                    />
                )}
            </Stack>

            <Stack>
                <TextField
                    required={true}
                    value={data.value}
                    disabled={disabled}
                    variant="outlined"
                    onChange={(e) => {
                        onChange({ key: data.key, value: e.target.value });
                    }}
                    sx={{
                        width: cardType === 'node' ? '230px' : '690px',
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
