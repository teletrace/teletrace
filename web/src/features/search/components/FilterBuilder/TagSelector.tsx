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

import { Autocomplete, FormLabel, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import { useAvailableTags } from "../../api/availableTags";
import { AvailableTag } from "../../types/availableTags";
import { styles } from "./styles";

export type TagSelectorProps = {
  value: AvailableTag | null;
  onChange: (f: AvailableTag | null) => void;
  error: boolean;
};

export const TagSelector = ({ value, onChange, error }: TagSelectorProps) => {
  const { data: availableTags, isLoading } = useAvailableTags();

  const availableTagsOptions = availableTags?.pages.flatMap(
    (page) => page.Tags
  );

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: AvailableTag | null
  ) => {
    onChange(value);
  };

  return (
    <FormControl required sx={styles.tagsSelector}>
      <FormLabel required={false}>Key</FormLabel>
      <Autocomplete
        openOnFocus
        loading={isLoading}
        value={value}
        id="filter"
        size="small"
        options={availableTagsOptions || []}
        getOptionLabel={(option) => option.name}
        componentsProps={{ paper: { sx: styles.tagsDropdown } }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error ? "Filter is required" : ""}
          />
        )}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      ></Autocomplete>
    </FormControl>
  );
};
