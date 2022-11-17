import { Switch, FormGroup, FormControlLabel } from "@mui/material";

export function SearchBar() {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Live Spans"
      />
    </FormGroup>
  );
}
