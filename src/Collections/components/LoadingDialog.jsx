import { Dialog, DialogContent } from '@mui/material';
import { ThreeDots } from 'react-loader-spinner';

const LoadingDialog = () => {
    return (
        <Dialog
            open={true}
            disableEscapeKeyDown
            disableBackdropClick
            PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}
        >
            <DialogContent>
                <ThreeDots height="30" width="30" color="white" visible={true} />
            </DialogContent>
        </Dialog>
    );
};

export default LoadingDialog;
