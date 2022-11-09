import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { styles } from "./styles";
import { Operator, operatorsList } from "../../types/spanQuery";

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
      <InputLabel id="operator">Operator</InputLabel>
      <Select
        id="operator-selector"
        value={operator}
        onChange={handleChange}
        label="operator"
      >
        {operatorsList?.map((operator) => (
          <MenuItem key={operator} value={operator}>
            {operator.replaceAll("_", " ")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
