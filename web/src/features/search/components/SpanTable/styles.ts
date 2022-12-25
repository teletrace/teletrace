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

import { keyframes } from "@emotion/react";
import { CSSProperties } from "react";

import { theme } from "@/styles";

const primaryRowColor = theme.palette.grey[900];
const newRowColor = theme.palette.grey[700];

const newRowAnimation = keyframes`
    0%   {background-color: ${primaryRowColor};}
    50%  {background-color: ${newRowColor};}
    100%  {background-color: ${primaryRowColor};
 `;

const styles: { [name: string]: CSSProperties } = {
  progress: { margin: 0, position: "absolute", top: 47, right: 0, left: 0 },
  container: { minHeight: 0, position: "relative", borderRadius: "8px" },
  tablePaper: { display: "flex", maxHeight: "100%" },
  tableContainer: { borderRadius: "8px" },
  newTableRow: {
    animation: `${newRowAnimation} 1s ease`,
  },
};

export default styles;
