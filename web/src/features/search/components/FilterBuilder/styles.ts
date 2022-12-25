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

export const styles = {
  filterBuilder: {
    width: "520px",
  },
  operatorSelector: {
    flex: 2,
    display: "flex",
  },
  filterSelector: {
    flex: 5,
    display: "flex",
  },
  valueSelector: {
    flex: 1,
    display: "flex",
  },
  valueInput: {
    "& .MuiAutocomplete-inputRoot": {
      height: "fit-content",
      "&.MuiInputBase-sizeSmall": {
        paddingTop: "4px",
        paddingBottom: "4px",
      },
    },
  },
  textValueInput: {
    "& .MuiInputBase-root": {
      paddingRight: "unset",
    },
    "& .MuiSvgIcon-root": { width: "16px", height: "16px" },
  },
  tagsDropdown: {
    minWidth: "472px",
  },
};
