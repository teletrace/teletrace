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

type FilterBuilderDialogState = {
  tag: AvailableTag | null;
  formError: FormErrors;
  value: FilterValueTypes;
  operator: Operator;
};

export const FilterBuilderDialog = ({
  timeframe,
  onClose,
  open,
  anchorEl,
  onApply,
}: FilterDialogProps) => {
  const initialState: FilterBuilderDialogState = {
    tag: null,
    formError: { filter: false, value: false },
    value: [],
    operator: "in",
  };
  const [dialogState, setDialogState] =
    useState<FilterBuilderDialogState>(initialState);
  const valueInputMode = valueSelectModeByOperators[dialogState.operator];

  const onOperatorChange = (operator: Operator) => {
    setDialogState((prevState) => {
      const newState = { ...prevState };
      newState.operator = operator;
      newState.value = [];
      newState.formError = { ...prevState.formError, value: false };
      return newState;
    });
  };

  const onTagChange = (tag: AvailableTag | null) => {
    setDialogState((prevState) => {
      const newState = { ...prevState };
      newState.tag = tag;
      newState.value = [];
      if (prevState.formError.filter) {
        newState.formError = { ...validateForm(newState), value: false };
      }
      return newState;
    });
  };

  const onValueChange = (value: FilterValueTypes) => {
    setDialogState((prevState) => {
      const newState = { ...prevState };
      newState.value = value;
      if (prevState.formError.value) {
        newState.formError = {
          ...prevState.formError,
          value: validateForm(newState).value,
        };
      }
      return newState;
    });
  };

  const handleClose = () => {
    setDialogState(initialState);
    onClose();
  };

  const validateForm = (state: FilterBuilderDialogState): FormErrors => {
    const errors: FormErrors = { filter: false, value: false };
    const stateInputMode = valueSelectModeByOperators[state.operator];
    if (state.tag === null || state.tag.name === "") {
      errors.filter = true;
    }
    if (stateInputMode == "none") {
      errors.value = false;
    } else if (
      state.value === null ||
      (typeof state.value === "string" && state.value.trim() === "") ||
      (state.value instanceof Array && state.value.length === 0)
    ) {
      errors.value = true;
    }
    return errors;
  };

  const handleApply = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const errors = validateForm(dialogState);
    if (errors.filter || errors.value) {
      setDialogState((prevState) => {
        const newState = { ...prevState };
        newState.formError = validateForm(prevState);
        return newState;
      });

      return;
    }
    const newFilter: KeyValueFilter = {
      key: dialogState.tag?.name || "",
      operator: dialogState.operator,
      value: dialogState.value,
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
                value={dialogState.tag}
                onChange={onTagChange}
                error={dialogState.formError.filter}
              />
              <OperatorSelector
                value={dialogState.operator}
                onChange={onOperatorChange}
              />
            </Stack>
            {valueInputMode !== "none" ? (
              <Stack>
                <ValueSelector
                  timeframe={timeframe}
                  tag={dialogState.tag?.name || ""}
                  value={dialogState.value}
                  onChange={onValueChange}
                  valueInputMode={valueInputMode}
                  error={dialogState.formError.value}
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
