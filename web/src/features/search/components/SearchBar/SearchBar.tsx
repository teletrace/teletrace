import { FilterList } from "@mui/icons-material";
import { Button, Chip, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

import { SearchFilter } from "../../types/spanQuery";
import { FilterBuilderDialog } from "../FilterBuilder";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addFilter = (filter: SearchFilter) => {
    setFilters([...filters, filter]);
  };

  const handleFilterDelete = (filter: SearchFilter) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  return (
    <Paper sx={{ height: "40px", padding: "8px" }}>
      <Stack direction="row" spacing={0.5}>
        <Button
          variant="contained"
          size="small"
          startIcon={<FilterList />}
          onClick={handleClickOpen}
        >
          Add Filter
        </Button>
        <FilterBuilderDialog
          open={open}
          onClose={handleClose}
          onApply={addFilter}
          anchorEl={anchorEl}
        />
        {filters.map((filter) => (
          <Chip
            key={`${filter.keyValueFilter.key} ${filter.keyValueFilter.operator} ${filter.keyValueFilter.value}`}
            size="small"
            label={`${filter.keyValueFilter.key} ${filter.keyValueFilter.operator} ${filter.keyValueFilter.value}`}
            onDelete={() => handleFilterDelete(filter)}
          />
        ))}
      </Stack>
    </Paper>
  );
}
