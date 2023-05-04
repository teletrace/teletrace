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

import { primaryActionColors } from "@/styles/colors";

export const styles = {
  filterBuilder: {
    width: "546px",
  },
  tagsSelector: {
    flex: 1,
    display: "flex",
  },
  tagsDropdown: {
    minWidth: "498px",
    ".valueLabelHighlight": {
      backgroundColor: primaryActionColors.primaryClicked,
      fontWeight: 900,
      color: "white",
    },
  },
  tagsDropdownIcon: {
    fontSize: '15px',
    marginRight: '8px',
    marginLeft: '4px'
  },
  tagsDropdownGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    top: '-8px',
    padding: '4px 10px',
    fontSize: '12px',
    borderBottom: '1px solid #96979e'
  },
  tagsDropdownGroupItems: {
    padding: 0
  },
  operatorSelector: {
    width: "166px",
    display: "flex",
  },
  operatorsDropdown: {
    paddingRight: "12px",
    paddingLeft: "12px",
  },
  valueSelector: {
    flex: 1,
    display: "flex",
  },
  selectValueInput: {
    "& .MuiAutocomplete-inputRoot": {
      height: "fit-content",
      "&.MuiInputBase-sizeSmall": {
        paddingTop: "4px",
        paddingBottom: "4px",
      },
    },
  },
  selectValueResult: {
    width: "100%",
    ".valueLabelHighlight": {
      backgroundColor: primaryActionColors.primaryClicked,
      fontWeight: 900,
      color: "white",
    },
  },
  textValueInput: {
    "& .MuiInputBase-root": {
      paddingRight: "unset",
    },
    "& .MuiSvgIcon-root": { width: "16px", height: "16px" },
  },
};
