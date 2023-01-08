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
import { Popover, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { MouseEvent, useRef, useState } from "react";

import {
  formatDateAsDateTime,
  getCurrentTimestamp,
  msToNanoSec,
  nanoSecToMs,
} from "@/utils/format";

import { TimeFrameState } from "../../routes/SpanSearch";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

export type TimeFrameSelectorProps = {
  onChange: (timeframe: TimeFrameState) => void;
  value: TimeFrameState;
};

const options: RelativeTimeFrame[] = [
  { label: "1H", offsetRange: "1h", relativeTo: "now" },
  { label: "1D", offsetRange: "1d", relativeTo: "now" },
  { label: "3D", offsetRange: "3d", relativeTo: "now" },
  { label: "1W", offsetRange: "1w", relativeTo: "now" },
];

export const TimeFrameSelector = ({
  onChange,
  value: timeframe,
}: TimeFrameSelectorProps) => {
  const customOption: CustomTimeFrame = {
    label: "Custom",
    startTime: timeframe.startTimeUnixNanoSec,
    endTime: getCurrentTimestamp(),
  };

  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [previousSelected, setPreviousSelected] = useState<TimeFrameTypes>(
    options[0]
  );
  const [isSelected, setIsSelected] = useState<TimeFrameTypes>(options[0]);

  const handleCustomClick = (event: MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  function isRelativeTimeFrame(
    object: TimeFrameTypes
  ): object is RelativeTimeFrame {
    return "offsetRange" in object;
  }

  function isCustomTimeFrame(
    object: TimeFrameTypes
  ): object is CustomTimeFrame {
    return "startTime" in object;
  }

  const toTimeframeFromRelative = (timeFrame: RelativeTimeFrame) => {
    const startTime = new Date();
    const endTimeNumber = new Date().getTime();
    const offset = timeFrame.offsetRange;
    if (offset === "1h") startTime.setHours(startTime.getHours() - 1);
    else if (offset === "1d") startTime.setDate(startTime.getDate() - 1);
    else if (offset === "3d") startTime.setDate(startTime.getDate() - 3);
    else if (offset === "1w") startTime.setDate(startTime.getDate() - 7);
    const startTimeNumber = startTime.getTime();
    timeframe.startTimeUnixNanoSec = msToNanoSec(startTimeNumber);
    timeframe.endTimeUnixNanoSec = msToNanoSec(endTimeNumber);
  };

  const toTimeframeFromCustom = (customTimeFrame: CustomTimeFrame) => {
    timeframe.startTimeUnixNanoSec = customTimeFrame.startTime;
    timeframe.endTimeUnixNanoSec = customTimeFrame.endTime;
  };

  const calcTimeFrame = (timeframeType: TimeFrameTypes) => {
    if (isRelativeTimeFrame(timeframeType)) {
      toTimeframeFromRelative(timeframeType);
    } else if (isCustomTimeFrame(timeframeType)) {
      toTimeframeFromCustom(timeframeType);
    }
  };

  const handleCancel = () => {
    setIsSelected(previousSelected);
    onChange({ ...timeframe, isRelative: true });
    setOpen(false);
  };

  const handleBtnClicked = (
    event: MouseEvent<HTMLElement>,
    value: TimeFrameTypes
  ) => {
    if (value?.label === "Custom") {
      handleCustomClick(event);
    }
    calcTimeFrame(value);
    onChange({ ...timeframe, isRelative: value.label !== "Custom" });
    setIsSelected(value);
    setPreviousSelected(isSelected);
  };

  const formatNanoToTimeString = (time: number): string => {
    const ms = nanoSecToMs(time);
    return formatDateAsDateTime(ms, { showSec: false });
  };

  const getTooltipTitle = (): string => {
    return `${formatNanoToTimeString(
      timeframe?.startTimeUnixNanoSec || 0
    )} -> ${formatNanoToTimeString(timeframe?.endTimeUnixNanoSec || 0)}`;
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
          onChange={onChange}
          value={{
            startTimeUnixNanoSec: timeframe.startTimeUnixNanoSec,
            endTimeUnixNanoSec: getCurrentTimestamp(),
            isRelative: timeframe.isRelative,
          }}
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
          <ToggleButton
            onClick={handleBtnClicked}
            selected={isSelected?.label === tf?.label}
            value={tf}
            ref={buttonRef}
            key={tf.label}
          >
            {tf.label}
          </ToggleButton>
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

type CustomTimeFrame = {
  label: string;
  startTime: number;
  endTime: number;
};

export type TimeFrameTypes = RelativeTimeFrame | CustomTimeFrame;
