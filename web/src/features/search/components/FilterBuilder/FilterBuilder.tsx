/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { OperatorSelector } from "./OperatorSelector";
import { styles } from "./styles";
import { TagSelector } from "./TagSelector";
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
  tag: boolean;
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
  const initialFormErrors: FormErrors = { tag: false, value: false };
  const initialState: FilterBuilderDialogState = {
    tag: null,
    formError: initialFormErrors,
    value: [],
    operator: "in",
  };
  const [dialogState, setDialogState] =
    useState<FilterBuilderDialogState>(initialState);
  const valueInputMode = valueSelectModeByOperators[dialogState.operator];

  const onOperatorChange = (operator: Operator) => {
    setDialogState((prevState) => ({
      ...prevState,
      operator,
      value: [],
      formError: { ...prevState.formError, value: false },
    }));
  };

  const onTagChange = (tag: AvailableTag | null) => {
    setDialogState((prevState) => {
      const newState = { ...prevState, tag, value: [] };
      // we want only to clear errors on tag changes and have new errors only on apply
      if (prevState.formError.tag) {
        newState.formError = { ...validateForm(newState), value: false };
      }
      return newState;
    });
  };

  const onValueChange = (value: FilterValueTypes) => {
    setDialogState((prevState) => {
      const newState = { ...prevState, value };
      // we want only to clear errors on value changes and have new errors only on apply
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
    const errors: FormErrors = { ...initialFormErrors };
    const stateInputMode = valueSelectModeByOperators[state.operator];
    if (state.tag === null || state.tag.name === "") {
      errors.tag = true;
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
    if (errors.tag || errors.value) {
      // notify about form errors
      setDialogState((prevState) => ({
        ...prevState,
        formError: validateForm(prevState),
      }));
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
              <TagSelector
                value={dialogState.tag}
                onChange={onTagChange}
                error={dialogState.formError.tag}
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
