import { HighlightOff, Search } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";

export type SearchFieldProps = {
  value: string;
  onChange: (s: string) => void;
} & Omit<TextFieldProps, "onChange">;

export const SearchField = ({
  value,
  onChange,
  ...props
}: SearchFieldProps) => {
  const clearInput = () => onChange("");

  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      placeholder="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: value && value.length && (
          <InputAdornment position="end">
            <IconButton onClick={clearInput}>
              <HighlightOff />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};
