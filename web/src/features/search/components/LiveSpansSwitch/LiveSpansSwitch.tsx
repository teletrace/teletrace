import { Switch, FormGroup, FormControlLabel } from "@mui/material";
import { useState } from "react";

export function LiveSpanSwitch() {
  const [liveSpansMode, setLiveSpansMode] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveSpansMode(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch onChange={handleChange} defaultChecked />}
        label="Live Spans"
      />
    </FormGroup>
  );
}
