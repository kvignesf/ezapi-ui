import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { KeyValueProps, ValueCardProps } from '../../interfaces';
import { ValueCardRow } from './ValueCardRow';

export const ValueCard = (props: ValueCardProps): React.ReactElement => {
    const {
        value,
        disabled = false,
        onChange = () => {},
        onDone,
        onDelete,
        isDrawer = false,
        disableAdd = false,
        onSubmit = () => {},
        disableDelete = false,
        iconSelector = 'delete',
        nodeType = '',
    } = props;

    const [data, setData] = useState<KeyValueProps[]>(value ?? []);

    useEffect(() => {
        setData(value ?? []);
    }, [value]);

    return (
        <Stack
            sx={{
                border: '1px solid #C0CCDA',
                borderRadius: '2.5%',
                width: '460px',
                height: isDrawer ? '320px' : '200px',
                overflow: 'auto',
                padding: '12px 18px',
                whiteSpace: 'nowrap',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <Stack>
                <Stack direction="row">
                    <div className="flex flex-row justify-start bg-neutral-gray6 rounded-md p-1 py-2 mb-2">
                        <p
                            className="flex-1 text-smallLabel ml-7 text-neutral-gray2 uppercase"
                            style={{ width: '130px' }}
                        >
                            Key
                        </p>
                        <p className="flex-1 text-smallLabel uppercase text-neutral-gray2" style={{ width: '200px' }}>
                            Value
                        </p>
                        <div className="w-12" />
                    </div>
                </Stack>
                {data?.map((item, index) => {
                    return (
                        <ValueCardRow
                            key={index}
                            nodeType={nodeType}
                            data={item}
                            onDone={onDone}
                            onDelete={() => {
                                const updatedData = data.filter((value, index2) => value && index !== index2);
                                onChange(updatedData);
                                onDelete;
                            }}
                            disabled={disabled}
                            disableDelete={disableDelete}
                            onChange={(value: KeyValueProps) => {
                                const updatedData = data.map((item, index2) => {
                                    if (index === index2) {
                                        return value;
                                    } else {
                                        return item;
                                    }
                                });
                                onChange(updatedData);
                            }}
                        />
                    );
                })}
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginBottom: '12px' }}>
                <Stack>
                    {!disableAdd && nodeType !== 'main' && (
                        <Button
                            onClick={() => {
                                const length = data.length;
                                setData([
                                    ...data,
                                    {
                                        key: '',
                                        value: '',
                                    },
                                ]);
                            }}
                            startIcon={<Add />}
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, textTransform: 'none', height: '36px' }}
                            disabled={disabled}
                        >
                            Add
                        </Button>
                    )}
                </Stack>

                {/* <Stack>
                    <Button
                        onClick={() => {
                            const length = data.length;
                            onSubmit();
                        }}
                        variant="contained"
                        sx={{
                            mt: 2,
                            textTransform: 'none',
                            bgcolor: 'green',
                            color: 'white',
                            height: '36px',
                            '&:hover': {
                                backgroundColor: 'darkgreen',
                            },

                        }}
                        disabled={disabled}
                    >
                        Submit
                    </Button>
                </Stack> */}
            </Stack>
        </Stack>
    );
};
