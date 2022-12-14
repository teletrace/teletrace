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
  Autocomplete,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { formatNumber } from "@/utils/format";

import { useTagValuesWithAll } from "../../api/tagValues";
import { FilterValueTypes, SearchFilter, Timeframe } from "../../types/common";
import { TagValue } from "../../types/tagValues";
import { styles } from "./styles";

const useGetTagOptions = (
  tag: string,
  timeframe: Timeframe,
  filters: Array<SearchFilter>,
  selectedOptions: (string | number)[],
  search: string
) => {
  const searchQueryFilters: Array<SearchFilter> = search
    ? [
        ...filters,
        { keyValueFilter: { key: tag, operator: "contains", value: search } },
      ]
    : filters;
  const { data: searchTagValues, isFetching: isFetchingSearch } =
    useTagValuesWithAll(tag, timeframe, searchQueryFilters);
  // add selected options to options (if missing). Since we don't show them (due to filterSelectedOptions prop) the selected the count doesn't matter
  if (searchTagValues) {
    selectedOptions.forEach((item) => {
      if (!searchTagValues.find((e) => e.value === item)) {
        console.log(item);
        searchTagValues?.push({ value: item, count: 0 });
      }
    });
  }
  return { tagOptions: searchTagValues, isLoading: isFetchingSearch };
};

export type AutoCompleteValueSelectorProps = {
  tag: string;
  timeframe: Timeframe;
  filters: Array<SearchFilter>;
  value: (string | number)[];
  onChange: (value: FilterValueTypes) => void;
  error: boolean;
};

export const AutoCompleteValueSelector = ({
  tag,
  timeframe,
  filters,
  value,
  onChange,
  error,
}: AutoCompleteValueSelectorProps) => {
  const [search, setSearch] = useState("");
  const [searchDebounced] = useDebounce(search, 500);
  const { isLoading, tagOptions } = useGetTagOptions(
    tag,
    timeframe,
    filters,
    value,
    searchDebounced
  );
  const errorHelperText = error ? "Value is required" : "";
  const handleSelectChange = (
    event: React.SyntheticEvent<Element, Event>,
    eventValue: TagValue[]
  ) => {
    onChange(eventValue.map((v) => v.value));
  };

  const getSelectedValues = () => {
    return (
      tagOptions?.filter(
        (tagOption) => tagOption && value.includes(tagOption?.value)
      ) || []
    );
  };
  return (
    <Autocomplete
      multiple
      openOnFocus
      size="small"
      loading={isLoading}
      clearOnBlur={false}
      disableCloseOnSelect
      value={getSelectedValues() || null}
      id={"value-selector"}
      options={
        tagOptions?.filter(
          (option) =>
            value.includes(option.value) ||
            option.value.toString().includes(search)
        ) || []
      }
      filterOptions={(x) => x}
      inputValue={search}
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onInputChange={(event, newInputValue) => {
        setSearch(newInputValue);
      }}
      getOptionLabel={(option) => option.value.toString()}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={errorHelperText}
          sx={styles.valueInput}
        />
      )}
      renderOption={(props, option) => (
        <ListItem {...props}>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            justifyContent="space-between"
          >
            <Typography>{option.value}</Typography>
            <Typography>{formatNumber(option.count)}</Typography>
          </Stack>
        </ListItem>
      )}
      onChange={handleSelectChange}
    ></Autocomplete>
  );
};