import { FilterList, Height } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";

export function SearchBar() {
  return (
    <Paper sx={{ height: "40px", padding: "8px" }}>
      <Button variant="contained" size="small" startIcon={<FilterList />}>
        Add Filter
      </Button>
    </Paper>
  );
}
