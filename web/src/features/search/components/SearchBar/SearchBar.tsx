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
import { Button, Divider, IconButton, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

import { theme } from "@/styles";

import { useSpanSearchStore } from "../../stores/spanSearchStore";
import { FilterBuilderDialog } from "../FilterBuilder";
import { FilterChip } from "../FilterChip/FilterChip";
import { styles } from "./styles";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const filtersState = useSpanSearchStore((state) => state.filtersState);

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
            open={open}
            onClose={handleClose}
            anchorEl={anchorEl}
          />
          {filtersState.filters.map((filter, index) => (
            <FilterChip key={index} filter={filter} />
          ))}
        </Stack>
        {filtersState.filters.length > 0 && (
          <Stack direction="row" sx={styles.clear}>
            <Divider
              orientation="vertical"
              sx={{ borderColor: theme.palette.grey[700], marginRight: "13px" }}
            />
            <IconButton onClick={filtersState.clearFilters} size="small">
            <IconButton
              sx={styles.clearButton}
              onClick={filtersState.clearFilters}
              size="small"
            >
              <Close fontSize="inherit" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
