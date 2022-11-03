import { FilterList } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useState } from "react";

import { AddFilterDialog } from "../AddFilter";

export function SearchBar() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
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
      <AddFilterDialog open={open} onClose={handleClose} />
    </Paper>
  );
}
