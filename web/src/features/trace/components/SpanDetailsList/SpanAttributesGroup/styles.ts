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

export const styles = {
  accordion: {
    boxShadow: "none",
  },
  accordionSummary: {
    flexDirection: "row-reverse",
    padding: "0px",
    marginLeft: "55px",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
  },
  expandIcon: {
    fontSize: "25px",
  },
  title: {
    marginLeft: "8px",
    fontWeight: "700",
  },
  accordionDetails: {
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
};
