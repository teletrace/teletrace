/*
Copyright (c) 2017 Uber Technologies, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Divider } from "@mui/material";
import { common, grey } from "@mui/material/colors";

import { theme } from "@/styles";

export default function LabeledList(props) {
  const { className, items } = props;
  return (
    <ul
      style={theme.typography.caption}
      className={`LabeledList ${className || ""}`}
    >
      {items.map(({ key, label, value }, i) => {
        const divider = i < items.length - 1 && (
          <li className="LabeledList--item" key={`${key}--divider`}>
            <Divider
              sx={{
                backgroundColor: common.white,
                height: "12px",
                margin: "0 14px",
                width: "0.1px",
              }}
              orientation="vertical"
              variant="middle"
              flexItem
            />
          </li>
        );
        return [
          <li className="LabeledList--item" key={key}>
            <span style={{ color: grey[300] }} className="LabeledList--label">
              {label}
            </span>
            <strong>{value}</strong>
          </li>,
          divider,
        ];
      })}
    </ul>
  );
}
