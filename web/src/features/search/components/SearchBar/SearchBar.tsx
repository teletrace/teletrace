import { FilterList } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";

export function SearchBar() {
  return (
    <Paper>
      <Button variant="contained" startIcon={<FilterList />}>
        Add Filter
      </Button>
    </Paper>
  );
}
