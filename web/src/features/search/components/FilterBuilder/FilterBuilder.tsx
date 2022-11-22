import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Popover,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";

import { AvailableTag } from "../../types/availableTags";
import {
  FilterValueTypes,
  KeyValueFilter,
  Operator,
  SearchFilter,
  ValueInputMode,
} from "../../types/common";
import { FilterSelector } from "./FilterSelector";
import { OperatorSelector } from "./OperatorSelector";
import { styles } from "./styles";
import { ValueSelector } from "./ValueSelector";

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

export type FormErrors = {
  filter: boolean;
  value: boolean;
};

export const FilterBuilderDialog = ({
  onClose,
  open,
  anchorEl,
  onApply,
}: FilterDialogProps) => {
  const [filter, setFilter] = useState<AvailableTag | null>(null);
  const [operator, setOperator] = useState<Operator>("in");
  const [value, setValue] = useState<FilterValueTypes>([]);
  const [valueSelectMode, setValueSelectMode] = useState<ValueInputMode>(
    valueSelectModeByOperators.in
  );
  const initialFormErrors: FormErrors = {
    filter: false,
    value: false,
  };
  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);

  const handleOperatorChange = (value: Operator) => {
    setValueSelectMode(valueSelectModeByOperators[value]);
    setOperator(value);
    setFormErrors({ filter: formErrors.filter, value: false });
  };

  const handleClose = () => {
    setFilter(null);
    setOperator("in");
    setValue([]);
    setValueSelectMode(valueSelectModeByOperators.in);
    setFormErrors(initialFormErrors);
    onClose();
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = initialFormErrors;
    if (filter === null || filter.name === "") {
      errors.filter = true;
    }
    if (
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (value instanceof Array && value.length === 0)
    ) {
      errors.value = true;
    }

    return errors;
  };

  const handleApply = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const errors = validateForm();
    if (errors.filter || errors.value) {
      setFormErrors(errors);
      return;
    }
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
      <form onSubmit={handleApply}>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <FilterSelector
                value={filter}
                onChange={(value) => {
                  setFilter(value);
                  setFormErrors({ ...formErrors, filter: false });
                }}
                error={formErrors.filter}
              />
              <OperatorSelector
                value={operator}
                onChange={handleOperatorChange}
              />
            </Stack>
            {valueSelectMode !== "none" ? (
              <Stack>
                <ValueSelector
                  tag={filter?.name || ""}
                  value={value}
                  onChange={(v) => {
                    setValue(v);
                    setFormErrors({ ...formErrors, value: false });
                  }}
                  valueInputMode={valueSelectMode}
                  error={formErrors.value}
                />
              </Stack>
            ) : null}
          </Stack>
        </DialogContent>
        <Divider sx={{ borderBottomWidth: 2, backgroundColor: "black" }} />
        <DialogActions>
          <Button size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="small" variant="contained" type="submit">
            Apply
          </Button>
        </DialogActions>
      </form>
    </Popover>
  );
};
