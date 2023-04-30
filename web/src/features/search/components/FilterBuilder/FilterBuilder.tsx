/**
 * Copyright 2022 Cisco Systems, Inc.
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
import React, { useEffect, useState } from "react";

import { useAvailableTags } from "../../api/availableTags";
import { useSpanSearchStore } from "../../stores/spanSearchStore";
import { AvailableTag, TagGroup } from "../../types/availableTags";
import {
  FilterValueTypes,
  KeyValueFilter,
  Operator,
  OperatorCategory,
  ValueInputMode,
} from "../../types/common";
import { OperatorSelector } from "./OperatorSelector";
import { styles } from "./styles";
import { TagSelector } from "./TagSelector";
import { ValueSelector } from "./ValueSelector";

export type FilterDialogProps = {
  anchorEl: HTMLButtonElement | HTMLDivElement | null;
  open: boolean;
  onClose: () => void;
  initialFilter?: KeyValueFilter;
};

const valueTypeByOperators: { [key: string]: ValueInputMode } = {
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

const operatorCategoryFromValueType = (
  valueType?: string
): OperatorCategory => {
  if (!valueType) return "text";
  else if (["Str"].includes(valueType)) return "text";
  else if (["Int", "Double"].includes(valueType)) return "number";
  else if (valueType === "Bool") return "boolean";

  return "text";
};

export const FilterBuilderDialog = ({
  onClose,
  open,
  anchorEl,
  initialFilter,
}: FilterDialogProps) => {
  const initialFormErrors: FormErrors = { tag: false, value: false };
  const { data: availableTags } = useAvailableTags();
  
  const availableTagsOptions = availableTags?.pages.flatMap(
    (page) => page.Tags
  );

  const initialState: FilterBuilderDialogState = {
    tag: initialFilter
      ? availableTagsOptions?.find((x) => x.name === initialFilter?.key) || null
      : null,
    formError: initialFormErrors,
    value: initialFilter?.value || [],
    operator: initialFilter?.operator || "in",
  };
  const [dialogState, setDialogState] =
    useState<FilterBuilderDialogState>(initialState);
  const valueInputMode = valueTypeByOperators[dialogState.operator];
  const createOrUpdateFilter = useSpanSearchStore(
    (state) => state.filtersState.createOrUpdateFilter
  );

  useEffect(() => {
    if (initialFilter) {
      setDialogState(initialState);
    }
  }, [initialFilter]);

  const onOperatorChange = (operator: Operator) => {
    setDialogState((prevState) => {
      const shouldResetValue =
        valueTypeByOperators[prevState.operator] !==
        valueTypeByOperators[operator];
      return {
        ...prevState,
        operator,
        value: shouldResetValue ? [] : prevState.value,
        formError: { ...prevState.formError, value: false },
      };
    });
  };

  const onTagChange = (tag: AvailableTag | null) => {
    setDialogState((prevState) => {
      const newState: FilterBuilderDialogState = {
        ...prevState,
        tag,
        value: [],
        operator: "in",
      };
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

  const convertSingleValue = (
    tagType: string | undefined,
    v: string | number
  ): string | number => {
    if (!tagType) {
      return v;
    }
    if (tagType === "Str") {
      return v.toString();
    }
    if (tagType === "Int" || tagType == "Double") {
      return Number(v);
    }
    // TODO: add it back
    // if (tagType === "Bool") {
    //   return v.toString().toLowerCase() === "true"
    // }
    return v;
  };

  const convertValue = (
    tagType: string | undefined,
    v: FilterValueTypes
  ): FilterValueTypes => {
    return Array.isArray(v)
      ? v.map((currentVal) => convertSingleValue(tagType, currentVal))
      : convertSingleValue(tagType, v);
  };

  const validateForm = (state: FilterBuilderDialogState): FormErrors => {
    const errors: FormErrors = { ...initialFormErrors };
    const stateInputMode = valueTypeByOperators[state.operator];
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
    } else {
      let convertedValues = convertValue(state.tag?.type, state.value);
      convertedValues = Array.isArray(convertedValues)
        ? convertedValues
        : [convertedValues];
      errors.value =
        convertedValues.filter(
          (v) => v === undefined || (typeof v === "number" && isNaN(v))
        ).length != 0;
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
      value: convertValue(dialogState.tag?.type, dialogState.value),
    };
    createOrUpdateFilter(
      { keyValueFilter: newFilter },
      initialFilter && { keyValueFilter: initialFilter }
    );
    
    if (dialogState?.tag) {
      const recentlyUsedKeysJSON = localStorage.getItem('recently_used_keys');
      const recentlyUsedKeys: AvailableTag[] = recentlyUsedKeysJSON ? JSON.parse(recentlyUsedKeysJSON) : [];
      recentlyUsedKeys.push({ ...dialogState.tag, group: TagGroup.RECENTLY_USED });
      localStorage.setItem("recently_used_keys", JSON.stringify(recentlyUsedKeys))
    }

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
                disabled={!!initialFilter}
              />
              <OperatorSelector
                value={dialogState.operator}
                operatorCategory={operatorCategoryFromValueType(
                  dialogState.tag?.type
                )}
                onChange={onOperatorChange}
              />
            </Stack>
            {valueInputMode !== "none" ? (
              <Stack>
                <ValueSelector
                  tag={dialogState.tag?.name || ""}
                  value={dialogState.value}
                  onChange={onValueChange}
                  valueInputMode={valueInputMode}
                  error={dialogState.formError.value}
                  operator={dialogState.operator}
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
