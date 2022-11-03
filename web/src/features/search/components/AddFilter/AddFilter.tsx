import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  PopoverActions,
  TextField,
} from "@mui/material";

export interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddFilterDialog(props: FilterDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Filter Key</DialogTitle>
      <DialogContent>
        <TextField autoFocus id="key" label="key" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
