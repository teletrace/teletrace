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

import { CalendarTodayOutlined } from "@mui/icons-material";
import {
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { MouseEvent, useRef, useState } from "react";

import { useSpanSearchStore } from "@/stores/spanSearchStore";
import {
  formatNanoToTimeString,
  getCurrentTimestamp,
  msToNanoSec,
  nanoSecToMs,
} from "@/utils/format";

import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

const options: RelativeTimeFrame[] = [
  { label: "1H", offsetRange: "1h", relativeTo: "now" },
  { label: "1D", offsetRange: "1d", relativeTo: "now" },
  { label: "3D", offsetRange: "3d", relativeTo: "now" },
  { label: "1W", offsetRange: "1w", relativeTo: "now" },
];



export const TimeFrameSelector = () => {
  const liveSpansState = useSpanSearchStore((state) => state.liveSpansState);
  const timeframeState = useSpanSearchStore((state) => state.timeframeState);

  const customOption: CustomTimeFrame = {
    label: "Custom",
    startTime: timeframeState.currentTimeframe.startTimeUnixNanoSec,
    endTime: getCurrentTimestamp(),
  };

  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [previousSelected, setPreviousSelected] = useState<TimeFrameTypes>(
    options[0]
  );
  const [isSelected, setIsSelected] = useState<TimeFrameTypes>(options[0]);

  const setDiffOnNanoSecTf = (ts: number, diff: string) => {
    const datetime = ts === 0 ? new Date() : new Date(nanoSecToMs(ts));
    if (diff === "1h") datetime.setHours(datetime.getHours() - 1);
    else if (diff === "1d") datetime.setDate(datetime.getDate() - 1);
    else if (diff === "3d") datetime.setDate(datetime.getDate() - 3);
    else if (diff === "1w") datetime.setDate(datetime.getDate() - 7);
    return msToNanoSec(datetime.getTime());
  };

  const handleCancel = () => {
    setIsSelected(previousSelected);
    timeframeState.setRelativeTimeframe(
      timeframeState.currentTimeframe.startTimeUnixNanoSec
    );
    setOpen(false);
  };

  const handleBtnClicked = (event: MouseEvent<HTMLElement>, value: TimeFrameTypes) => {
    setIsSelected(value);
    if (value?.label === "Custom") {
      setPreviousSelected(isSelected);
      setOpen(true);
      setAnchorEl(event.currentTarget);
    } else {
      const now = msToNanoSec(new Date().getTime());
      if (isRelativeTimeFrame(value)) {
        const offset = value.offsetRange;
        timeframeState.setRelativeTimeframe(setDiffOnNanoSecTf(now, offset));
      }
    }
  };

  const getTooltipTitle = (offset?: string, liveSpansOn?: boolean): string => {
    const startTime = offset
      ? setDiffOnNanoSecTf(
          timeframeState.currentTimeframe.endTimeUnixNanoSec,
          offset
        )
      : timeframeState.currentTimeframe.startTimeUnixNanoSec;
    const formattedEndTime =
      offset && liveSpansOn
        ? "Now"
        : formatNanoToTimeString(
            timeframeState.currentTimeframe.endTimeUnixNanoSec
          );
    return `${formatNanoToTimeString(startTime)} -> ${formattedEndTime}`;
  };

  return (
    <div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleCancel}
      >
        <DateTimeSelector
          onClose={() => setOpen(false)}
          onCancel={handleCancel}
        />
      </Popover>

      <ToggleButtonGroup exclusive>
        <ToggleButton
          onClick={handleBtnClicked}
          selected={isSelected?.label === customOption?.label}
          value={customOption}
          ref={buttonRef}
          key={customOption.label}
        >
          <CalendarTodayOutlined sx={{ paddingRight: "7px" }} />
          {isSelected?.label === customOption?.label && !open
            ? getTooltipTitle()
            : customOption.label}
        </ToggleButton>

        {options.map((tf) => (
          <Tooltip
            key={tf.label}
            title={getTooltipTitle(tf.offsetRange, liveSpansState.isOn)}
            placement="top-end"
            arrow
          >
            <ToggleButton
              onClick={handleBtnClicked}
              selected={isSelected?.label === tf?.label}
              value={tf}
              ref={buttonRef}
              key={tf.label}
            >
              {tf.label}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};

type RelativeTimeFrame = {
  label: string;
  relativeTo: string;
  offsetRange: string;
};

function isRelativeTimeFrame(object: TimeFrameTypes): object is RelativeTimeFrame {
  return "offsetRange" in object;
}

type CustomTimeFrame = {
  label: string;
  startTime: number;
  endTime: number;
};

export type TimeFrameTypes = RelativeTimeFrame | CustomTimeFrame;
