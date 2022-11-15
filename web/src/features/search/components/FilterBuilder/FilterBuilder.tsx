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
import { KeyValueFilter, Operator, SearchFilter } from "../../types/spanQuery";
import { ValueTypes, ValueInputMode } from "../../types/spanQuery";

export type FilterDialogProps = {
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  onClose: () => void;
  onApply: (filter: SearchFilter) => void;
};

const valueSelectModeByOperators: { [key: string]: ValueInputMode } = {
  in: "select",
  not_in: "select",
  contains: "text",
  not_contains: "text",
  exists: "none",
  not_exists: "none",
  gt: "numeric",
  gte: "numeric",
  lt: "numeric",
  lte: "numeric",
};

export const FilterBuilderDialog = ({
  onClose,
  open,
  anchorEl,
  onApply,
}: FilterDialogProps) => {
  const [filter, setFilter] = useState<availableTag | null>(null);
  const [operator, setOperator] = useState<Operator>("in");
  const [value, setValue] = useState<ValueTypes>([]);
  const [valueSelectMode, setValueSelectMode] = useState<ValueInputMode>(
    valueSelectModeByOperators.in
  );

  const handleOperatorChange = (value: Operator) => {
    setValueSelectMode(valueSelectModeByOperators[value]);
    setOperator(value);
  };

  const handleClose = () => {
    setFilter(null);
    setOperator("in");
    setValue([]);
    setValueSelectMode(valueSelectModeByOperators.in);
    onClose();
  };

  const handleApply = () => {
    const newFilter: KeyValueFilter = {
      key: filter?.name || "",
      operator: operator,
      value: value,
    };
    onApply({ keyValueFilter: newFilter });
    handleClose();
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
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <FilterSelector filter={filter} onChange={setFilter} />
            <OperatorSelector
              operator={operator}
              onChange={handleOperatorChange}
            />
          </Stack>
          {valueSelectMode !== "none" ? (
            <Stack>
              <ValueSelector
                tag={filter?.name || ""}
                value={value}
                onChange={setValue}
                valueInputMode={valueSelectMode}
              />
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Popover>
  );
};
