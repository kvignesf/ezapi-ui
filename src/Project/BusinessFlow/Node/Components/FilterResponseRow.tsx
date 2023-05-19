import { Delete } from '@mui/icons-material';
import { Stack, TextField } from '@mui/material';
import { FilterRowData } from '../../interfaces/aggregate-cards';

interface FilterResponseRowProps {
    data: FilterRowData;
    onDelete: Function;
}

export const FilterResponseRow = ({ data, onDelete = () => {} }: FilterResponseRowProps) => {
    console.log(data.attributeName, 'kl');
    return (
        <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginBottom: '12px' }} gap={2}>
            <Stack sx={{ flexBasis: '0', flexGrow: 1, textAlign: 'center' }}>
                <TextField
                    variant="outlined"
                    sx={{
                        maxWidth: '100%',
                    }}
                    inputProps={{ style: { height: '15px' } }}
                    value={data.attributeName}
                />
            </Stack>
            <Delete
                color={'error'}
                sx={{ alignSelf: 'center' }}
                onClick={() => {
                    onDelete();
                }}
            />
        </Stack>
    );
};
