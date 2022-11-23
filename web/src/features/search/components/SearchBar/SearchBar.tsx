import { FilterList } from "@mui/icons-material";
import { Button, Chip, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

import { SearchFilter } from "../../types/common";
import { FilterBuilderDialog } from "../FilterBuilder";

export type SearchBarProps = {
  filters: Array<SearchFilter>;
  onFilterAdded: (entry: SearchFilter) => void;
  onFilterDeleted: (entry: SearchFilter) => void;
};

export function SearchBar({
  filters,
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
