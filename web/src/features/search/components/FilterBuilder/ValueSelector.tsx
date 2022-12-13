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

import { FormLabel, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import {
  FilterValueTypes,
  SearchFilter,
  Timeframe,
  ValueInputMode,
} from "../../types/common";
import { TagValuesRequest } from "../../types/tagValues";
import { AutoCompleteValueSelector } from "./AutoCompleteValueSelector";
import { styles } from "./styles";

export type ValueSelectorProps = {
  tag: string;
  timeframe: Timeframe;
  filters: Array<SearchFilter>;
  query?: TagValuesRequest;
  value: FilterValueTypes;
  valueInputMode: ValueInputMode;
  onChange: (value: FilterValueTypes) => void;
  error: boolean;
};

export const ValueSelector = ({
  tag,
  timeframe,
  filters,
  value,
  valueInputMode,
  onChange,
  error,
}: ValueSelectorProps) => {
  const errorHelperText = error ? "Value is required" : "";

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(event?.target?.value ?? "");
  };

  return (
    <>
      <FormControl required sx={styles.valueSelector}>
        <FormLabel required={false}>Value</FormLabel>
        {valueInputMode === "select" ? (
          <AutoCompleteValueSelector
            error={error}
            filters={filters}
            timeframe={timeframe}
            value={Array.isArray(value) ? value : [value]}
            onChange={onChange}
            tag={tag}
          />
        ) : null}
        {valueInputMode === "text" ? (
          <TextField
            error={error}
            helperText={errorHelperText}
            size="small"
            variant="outlined"
            value={value}
            onChange={handleInputChange}
          />
        ) : null}
        {valueInputMode === "numeric" ? (
          <TextField
            error={error}
            helperText={errorHelperText}
            size="small"
            variant="outlined"
            type="number"
            value={value}
            onChange={handleInputChange}
          />
        ) : null}
      </FormControl>
    </>
  );
};
