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

import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";

import { primaryActionColors } from "@/styles/colors";

export const styles: Record<string, SxProps<Theme>> = {
  accordionSummary: (theme) => ({
    flex: 1,
    flexDirection: "row-reverse",
    fontWeight: 700,
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },

    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }),
  accordionDetails: {
    padding: "0px 16px 8px 16px ",
  },
  accordion: {
    "&:not(:last-child)": { borderBottom: 0 },
    "&:before": { display: "none" },
  },
  checkboxList: {
    marginRight: "-16px",
    marginLeft: "-16px",
    paddingBottom: "0",
    paddingTop: "0px",
  },
  valueLabel: {
    direction: "rtl",
    textOverflow: "ellipsis",

    ".valueLabelHighlight": {
      backgroundColor: primaryActionColors.primaryClicked,
      fontWeight: 900,
      color: "white",
    },

    "& span": {
      direction: "ltr",
      unicodeBidi: "bidi-override",
    },
  },
};
