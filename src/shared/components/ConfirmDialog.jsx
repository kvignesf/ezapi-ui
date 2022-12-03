import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";

const ConfirmDialog = ({ title, description, onCancel, onConfirm }) => {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            onConfirm();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
