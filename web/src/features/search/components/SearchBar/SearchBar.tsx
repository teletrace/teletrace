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

import { Close, FilterList } from "@mui/icons-material";
import { Button, Chip, Divider, IconButton, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

import { theme } from "@/styles";

import { SearchFilter, Timeframe, FilterValueTypes } from "../../types/common";
import { FilterBuilderDialog } from "../FilterBuilder";
import { styles } from "./styles";
import { stringify } from "querystring";

const OPERATORS_FORMAT: { [operator_key: string]: string } = {
  in: "IN",
  not_in: "NOT IN",
  contains: "CONTAINS",
  not_contains: "NOT CONTAINS",
  exists: "EXISTS",
  not_exists: "NOT EXISTS",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
};

const MAX_FILTER_LENGTH = 100;

export type SearchBarProps = {
  filters: Array<SearchFilter>;
  timeframe: Timeframe;
  onFilterAdded: (entry: SearchFilter) => void;
  onFilterDeleted: (entry: SearchFilter) => void;
  onClearFilters: () => void;
};

export function SearchBar({
  filters,
  timeframe,
  onFilterAdded,
  onFilterDeleted,
  onClearFilters,
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [ellipsMode, setEllipeMode] = useState<boolean>(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatStrValue = (value: string, filterLength: number) => {
    if (filterLength > MAX_FILTER_LENGTH) {
      value = value.substring(0, MAX_FILTER_LENGTH) + "...";
    }
    return '"' + value + '"';
  };

  const formatArrayValue = (value: (string | number)[], filterLen: number) => {
    const arrLen = value.length;
    let newValue;
    if (typeof value[0] === "string") {
      if (arrLen > 1) {
        newValue = '["' + value[0] + '"...+' + (arrLen - 1) + "]";
      }
      newValue = formatStrValue(value[0], filterLen);
    } else {
      if (arrLen > 1) {
        newValue = "[" + value[0] + "...+" + (arrLen - 1) + "]";
      } else {
        newValue = value[0];
      }
    }
    return newValue;
  };

  const formatFilterValue = (value: FilterValueTypes, filterLen: number) => {
    debugger;
    if (typeof value === "string") {
      return formatStrValue(value, filterLen);
    } else if (Array.isArray(value)) {
      return formatArrayValue(value, filterLen);
    } else {
      return value;
    }
  };

  const buildFilterLabel = (
    key: string,
    operator: string,
    value: FilterValueTypes
  ) => {
    const filterLen =
      `${key}`.length + `${operator}`.length + `${value}`.length;
    operator = OPERATORS_FORMAT[operator];
    const newValue = formatFilterValue(value, filterLen);
    return key + " " + operator + " " + newValue;
  };

  return (
    <Paper sx={styles.searchBarPaper}>
      <Stack direction="row" spacing={0.5} sx={styles.searchBar}>
        <Stack sx={styles.filtersBar} direction="row" spacing={0.5}>
          <Button
            variant="contained"
            size="small"
            startIcon={<FilterList />}
            onClick={handleOpen}
          >
            Add Filter
          </Button>

          <FilterBuilderDialog
            timeframe={timeframe}
            filters={filters}
            open={open}
            onClose={handleClose}
            onApply={onFilterAdded}
            anchorEl={anchorEl}
          />
          {filters.map((filter) => (
            <Chip
              key={`${filter.keyValueFilter.key} ${filter.keyValueFilter.operator}`}
              size="small"
              label={buildFilterLabel(
                filter.keyValueFilter.key,
                filter.keyValueFilter.operator,
                filter.keyValueFilter.value
              )}
              //label={`${filter.keyValueFilter.key} ${filter.keyValueFilter.operator} ${filter.keyValueFilter.value}`}
              onDelete={() => onFilterDeleted(filter)}
            />
          ))}
        </Stack>
        <Stack direction="row" sx={styles.clear}>
          <Divider
            orientation="vertical"
            sx={{ borderColor: theme.palette.grey[700], marginRight: "13px" }}
          />
          <IconButton onClick={onClearFilters} size="small">
            <Close fontSize="inherit" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
