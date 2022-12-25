/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FormLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Operator, operatorsList } from "../../types/common";
import { styles } from "./styles";

export type OperatorSelectorProps = {
  value: string;
  onChange: (value: Operator) => void;
};

const operatorToDisplayName: Record<Operator, string> = {
  lte: "less than or equal",
  lt: "less than",
  gt: "greater than",
  gte: "greater than or equal",
  not_in: "not in",
  in: "in",
  contains: "contains",
  not_contains: "does not contain",
  exists: "exists",
  not_exists: "does not exist",
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
          <MenuItem
            sx={styles.operatorsDropdown}
            key={operator}
            value={operator}
          >
            {operatorToDisplayName[operator]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
