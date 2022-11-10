import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Popover,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FilterSelector } from "./FilterSelector";
import { OperatorSelector } from "./OperatorSelector";
import { ValueSelector } from "./ValueSelector";
import { styles } from "./styles";
import { useState } from "react";
import { availableTag } from "../../types/availableTags";
import { Operator } from "../../types/spanQuery";
import { ValueTypes } from "../../types/spanQuery";

export type FilterDialogProps = {
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  onClose: () => void;
};

const valueSelectModeByOperators = {
  equals: "select",
  not_equals: "select",
  in: "multiSelect",
  not_in: "multiSelect",
  contains: "input",
  not_contains: "input",
  exists: "none",
  not_exists: "none",
  gt: "numeric",
  gte: "numeric",
  lt: "numeric",
  lte: "numeric",
};

export const FilterBuilderDialog = (props: FilterDialogProps) => {
  const [filter, setFilter] = useState<availableTag | null>(null);
  const [operator, setOperator] = useState<Operator>("in");
  const [value, setValue] = useState<ValueTypes>([]);
  const [valueSelectMode, setValueSelectMode] = useState<string>(
    valueSelectModeByOperators.in
  );
  const { onClose, open, anchorEl } = props;

  const handleOperatorChange = (value: Operator) => {
    setValueSelectMode(valueSelectModeByOperators[value]);
    setOperator(value);
  };

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
        <div>{filter?.name}</div>
        <div>{operator}</div>
        <div>{valueSelectMode}</div>
        <Stack direction="row">
          <FilterSelector filter={filter} onChange={setFilter} />
          <OperatorSelector
            operator={operator}
            onChange={handleOperatorChange}
          />
        </Stack>
        <Stack>
          <ValueSelector
            value={value}
            onChange={setValue}
            selectMode={valueSelectMode}
          />
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
