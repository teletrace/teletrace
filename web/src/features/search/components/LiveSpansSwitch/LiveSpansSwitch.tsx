import { FormControlLabel, FormGroup, Switch } from "@mui/material";

export type LiveSpansProps = {
  isOn: boolean;
  onLiveSpansChange: (isOn: boolean) => void;
};

export function LiveSpanSwitch({ isOn, onLiveSpansChange }: LiveSpansProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLiveSpansChange(event.target.checked);
  };
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch onChange={handleChange} checked={isOn} />}
        label="Live Spans"
      />
    </FormGroup>
  );
}
