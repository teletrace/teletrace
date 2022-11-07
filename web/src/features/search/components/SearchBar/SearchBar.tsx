import { FilterList } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useState } from "react";

import { FilterBuilderDialog } from "../FilterBuilder";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ height: "40px", padding: "8px" }}>
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
        anchorEl={anchorEl}
      />
    </Paper>
  );
}
