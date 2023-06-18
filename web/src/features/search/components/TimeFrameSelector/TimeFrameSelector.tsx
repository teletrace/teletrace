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

import { formatNanoToTimeString, msToNano, nanoToMs } from "@/utils/format";

import { useSpanSearchStore } from "../../stores/spanSearchStore";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

enum Offset {
  OneHour = "1h",
  OneDay = "1d",
  ThreeDays = "3d",
  OneWeek = "1w",
}

const options: RelativeTimeFrame[] = [
  { label: "1H", offsetRange: Offset.OneHour, relativeTo: "now" },
  { label: "1D", offsetRange: Offset.OneDay, relativeTo: "now" },
  { label: "3D", offsetRange: Offset.ThreeDays, relativeTo: "now" },
  { label: "1W", offsetRange: Offset.OneWeek, relativeTo: "now" },
];

const getOffsetInMillis = (offset: Offset): number => {
  switch (offset) {
    case Offset.OneHour:
      return 60 * 60 * 1000;
    case Offset.OneDay:
      return 24 * 60 * 60 * 1000;
    case Offset.ThreeDays:
      return 3 * 24 * 60 * 60 * 1000;
    case Offset.OneWeek:
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

const startTimeToOption = (startTimeUnixNanoSec: number): RelativeTimeFrame => {
  const startTimeMillis = startTimeUnixNanoSec / 1e6;
  const nowMillis = Date.now();

  const matchedOption = options.reverse().find((option) => {
    const optionOffsetMillis = getOffsetInMillis(option.offsetRange);
    return nowMillis - startTimeMillis >= optionOffsetMillis;
  });

  return matchedOption || options[0]; // Return the matched option or the default 1H option
};

export const TimeFrameSelector = () => {
  const timeframeState = useSpanSearchStore((state) => state.timeframeState);

  const customOption: CustomTimeFrame = {
    label: "Custom",
  };

  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [previousSelected, setPreviousSelected] = useState<TimeFrameTypes>(
    options[0]
  );

  const selectionToDisplay = timeframeState.currentTimeframe.isRelative
    ? startTimeToOption(timeframeState.currentTimeframe.startTimeUnixNanoSec)
    : customOption;

  const [isSelected, setIsSelected] =
    useState<TimeFrameTypes>(selectionToDisplay);

  const getRelativeStartTime = (timestamp: number, offset: string) => {
    const datetime =
      timestamp === 0 ? new Date() : new Date(nanoToMs(timestamp));
    if (offset === "1h") datetime.setHours(datetime.getHours() - 1);
    else if (offset === "1d") datetime.setDate(datetime.getDate() - 1);
    else if (offset === "3d") datetime.setDate(datetime.getDate() - 3);
    else if (offset === "1w") datetime.setDate(datetime.getDate() - 7);
    return msToNano(datetime.getTime());
  };

  const handleCancel = () => {
    setIsSelected(previousSelected);
    setOpen(false);
  };

  const handleCustomClick = (event: MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
    setPreviousSelected(isSelected);
  };

  const handleBtnClicked = (
    event: MouseEvent<HTMLElement>,
    value: TimeFrameTypes
  ) => {
    setIsSelected(value);
    if (value?.label === "Custom") {
      handleCustomClick(event);
    } else if (isRelativeTimeFrame(value)) {
      const now = msToNano(new Date().getTime());
      timeframeState.setRelativeTimeframe(
        getRelativeStartTime(now, value.offsetRange)
      );
    }
  };

  const getFormattedCustomTimeframe = (): string =>
    `${formatNanoToTimeString(
      timeframeState.currentTimeframe.startTimeUnixNanoSec
    )} - ${formatNanoToTimeString(
      timeframeState.currentTimeframe.endTimeUnixNanoSec
    )}`;

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
          closeDialog={() => setOpen(false)}
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
          {isSelected?.label === customOption?.label &&
          !timeframeState.currentTimeframe.isRelative
            ? getFormattedCustomTimeframe()
            : customOption.label}
        </ToggleButton>

        {options.map((timeframe) => (
          <ToggleButton
            onClick={handleBtnClicked}
            selected={isSelected?.label === timeframe?.label}
            value={timeframe}
            ref={buttonRef}
            key={timeframe.label}
          >
            {timeframe.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};

type RelativeTimeFrame = {
  label: string;
  relativeTo: string;
  offsetRange: Offset;
};

function isRelativeTimeFrame(
  object: TimeFrameTypes
): object is RelativeTimeFrame {
  return "offsetRange" in object;
}

type CustomTimeFrame = {
  label: string;
};

export type TimeFrameTypes = RelativeTimeFrame | CustomTimeFrame;
