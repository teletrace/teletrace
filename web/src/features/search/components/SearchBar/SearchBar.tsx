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

import { FilterList, Close } from "@mui/icons-material";
import { Button, Chip, Divider, IconButton, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

import { theme } from "@/styles";

import { SearchFilter, Timeframe } from "../../types/common";
import { FilterBuilderDialog } from "../FilterBuilder";
import { styles } from "./styles";

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

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
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
              label={`${filter.keyValueFilter.key} ${filter.keyValueFilter.operator} ${filter.keyValueFilter.value}`}
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
