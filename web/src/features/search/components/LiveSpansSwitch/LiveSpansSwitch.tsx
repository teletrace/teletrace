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

import { useSpanSearchStore } from "@/stores/spanSearchStore";

export function LiveSpanSwitch() {
  const tooltipTitleDisabled =
    "Live mode is off when a custom time range is applied";
  const tooltipTitleEnabled =
    "Live mode streams new ingested spans to the span table";

  const { liveSpansState, timeframeState } = useSpanSearchStore(
    (state) => state
  );
  const disabled = !timeframeState.currentTimeframe.isRelative;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    liveSpansState.setIsOn(event.target.checked);
  };
  return (
    <Tooltip
      title={
        timeframeState.currentTimeframe.isRelative
          ? tooltipTitleDisabled
          : tooltipTitleEnabled
      }
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              onChange={handleChange}
              checked={liveSpansState.isOn}
              disabled={disabled}
            />
          }
          label="Live Spans"
        />
      </FormGroup>
    </Tooltip>
  );
}
