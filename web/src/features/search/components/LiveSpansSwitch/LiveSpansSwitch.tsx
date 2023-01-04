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

import { FormControlLabel, FormGroup, Switch, Tooltip } from "@mui/material";

export type LiveSpansProps = {
  isOn: boolean;
  onLiveSpansChange: (absolute?: boolean) => void;
  disabled: boolean;
};

export function LiveSpanSwitch({
  isOn,
  onLiveSpansChange,
  disabled,
}: LiveSpansProps) {
  const tooltipTitleDisabled =
    "Live mode is off when a custom time range is applied";
  const tooltipTitleEnabled =
    "Live mode streams new ingested spans to the span table";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLiveSpansChange(event.target.checked);
  };
  return (
    <Tooltip title={disabled ? tooltipTitleDisabled : tooltipTitleEnabled}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              onChange={handleChange}
              checked={isOn}
              disabled={disabled}
            />
          }
          label="Live Spans"
        />
      </FormGroup>
    </Tooltip>
  );
}
