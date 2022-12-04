/**
 * Copyright 2022 Epsagon
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
