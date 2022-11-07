import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Popover,
  PopoverActions,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FilterSelector } from "./FilterSelector";
import { OperatorSelector } from "./OperatorSelector";
import { ValueSelector } from "./ValueSelector";
import { styles } from "./styles";

export interface FilterDialogProps {
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  onClose: () => void;
}

export const FilterBuilderDialog = (props: FilterDialogProps) => {
  const { onClose, open, anchorEl } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Popover
      onClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        style: styles.filterBuilder,
      }}
    >
      <DialogContent>
        <Stack direction="row">
          <FilterSelector />
          <OperatorSelector />
        </Stack>
        <Stack>
          <ValueSelector />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Apply</Button>
      </DialogActions>
    </Popover>
  );
};
