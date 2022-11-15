import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styles } from "./styles";
import { Operator, operatorsList } from "../../types/spanQuery";
import { FormLabel } from "@mui/material";

export type OperatorSelectorProps = {
  operator: string;
  onChange: (value: Operator) => void;
};

export const OperatorSelector = ({
  operator,
  onChange,
}: OperatorSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as Operator);
  };

  return (
    <FormControl sx={styles.operatorSelector}>
      <FormLabel>Operator</FormLabel>
      <Select id="operator" value={operator} onChange={handleChange}>
        {operatorsList?.map((operator) => (
          <MenuItem key={operator} value={operator}>
            {operator.replaceAll("_", " ")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
