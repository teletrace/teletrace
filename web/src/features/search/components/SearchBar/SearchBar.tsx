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

import { FilterList } from "@mui/icons-material";
import { Button, Chip, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

import { SearchFilter } from "../../types/common";
import { FilterBuilderDialog } from "../FilterBuilder";
import { TimeFrameTypes } from "../TimeFrameSelector";

export type SearchBarProps = {
  filters: Array<SearchFilter>;
  timeframe: TimeFrameTypes;
  onFilterAdded: (entry: SearchFilter) => void;
  onFilterDeleted: (entry: SearchFilter) => void;
};

export function SearchBar({
  filters,
  timeframe,
  onFilterAdded,
  onFilterDeleted,
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
    <Paper sx={{ height: "40px", padding: "8px" }}>
      <Stack direction="row" spacing={0.5}>
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
    </Paper>
  );
}
