import { FormLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Operator, operatorsList } from "../../types/spanQuery";
import { styles } from "./styles";

export type OperatorSelectorProps = {
  value: string;
  onChange: (value: Operator) => void;
};

export const OperatorSelector = ({
  value,
  onChange,
}: OperatorSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as Operator);
  };

  return (
    <FormControl required sx={styles.operatorSelector}>
      <FormLabel required={false}>Operator</FormLabel>
      <Select id="operator" size="small" value={value} onChange={handleChange}>
        {operatorsList?.map((operator) => (
          <MenuItem key={operator} value={operator}>
            {operator.replaceAll("_", " ")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
