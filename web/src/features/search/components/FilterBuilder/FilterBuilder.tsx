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
  Timeframe,
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
  timeframe: Timeframe;
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
  timeframe,
  onClose,
  open,
  anchorEl,
  onApply,
}: FilterDialogProps) => {
  const [tag, setTag] = useState<AvailableTag | null>(null);
  const [operator, setOperator] = useState<Operator>("in");
  const [value, setValue] = useState<FilterValueTypes>([]);
  const initialFormErrors: FormErrors = {
    filter: false,
    value: false,
  };
  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);
  const valueInputMode = valueSelectModeByOperators[operator];
  const handleOperatorChange = (value: Operator) => {
    setOperator(value);
    setFormErrors({ filter: formErrors.filter, value: false });
  };

  const handleClose = () => {
    setTag(null);
    setOperator("in");
    setValue([]);
    setFormErrors(initialFormErrors);
    onClose();
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = initialFormErrors;
    if (tag === null || tag.name === "") {
      errors.filter = true;
    }
    if (valueInputMode == "none") {
      errors.value = false;
    } else if (
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
      key: tag?.name || "",
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
                value={tag}
                onChange={(value) => {
                  setTag(value);
                  setFormErrors({ ...formErrors, filter: false });
                }}
                error={formErrors.filter}
              />
              <OperatorSelector
                value={operator}
                onChange={handleOperatorChange}
              />
            </Stack>
            {valueInputMode !== "none" ? (
              <Stack>
                <ValueSelector
                  timeframe={timeframe}
                  tag={tag?.name || ""}
                  value={value}
                  onChange={(v) => {
                    setValue(v);
                    setFormErrors({ ...formErrors, value: false });
                  }}
                  valueInputMode={valueInputMode}
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
