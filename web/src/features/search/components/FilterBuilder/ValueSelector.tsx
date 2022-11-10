import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { styles } from "./styles";
import { ValueTypes } from "../../types/spanQuery";

export type ValueSelectorProps = {
  value: ValueTypes;
  selectMode: string;
  onChange: (value: ValueTypes) => void;
};

export const ValueSelector = ({
  value,
  selectMode,
  onChange,
}: ValueSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value);
  };

  if (["select", "multiSelect"].includes(selectMode))
    return (
      <FormControl sx={styles.valueSelector}>
        <InputLabel id="value">Value</InputLabel>
        <Select
          id="value-selector"
          value={value.toString()}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    );

  if (selectMode === "input") return <div>input</div>;
  if (selectMode === "numeric") return <div>numeric</div>;
  return <div></div>;
};
