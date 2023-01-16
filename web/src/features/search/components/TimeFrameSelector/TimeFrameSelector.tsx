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
  msToNanosec,
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
  const [liveSpansOn, { currentTimeframe, setRelativeTimeframe }] =
    useSpanSearchStore((state) => [
      state.liveSpansState.isOn,
      state.timeframeState,
    ]);

  const customOption: CustomTimeFrame = {
    label: "Custom",
  };

  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [previousSelected, setPreviousSelected] = useState<TimeFrameTypes>(
    options[0]
  );
  const [isSelected, setIsSelected] = useState<TimeFrameTypes>(options[0]);

  const getRelativeStartTime = (timestamp: number, offset: string) => {
    const datetime =
      timestamp === 0 ? new Date() : new Date(nanoSecToMs(timestamp));
    if (offset === "1h") datetime.setHours(datetime.getHours() - 1);
    else if (offset === "1d") datetime.setDate(datetime.getDate() - 1);
    else if (offset === "3d") datetime.setDate(datetime.getDate() - 3);
    else if (offset === "1w") datetime.setDate(datetime.getDate() - 7);
    return msToNanosec(datetime.getTime());
  };

  function isRelativeTimeFrame(
    object: TimeFrameTypes
  ): object is RelativeTimeFrame {
    return "offsetRange" in object;
  }

  // function isCustomTimeFrame(
  //   object: TimeFrameTypes
  // ): object is CustomTimeFrame {
  //   return "startTime" in object;
  // }

  const calcTimeFrame = (timeframe: TimeFrameTypes) => {
    if (isRelativeTimeFrame(timeframe)) {
      const now = msToNanosec(new Date().getTime());
      currentTimeframe.endTimeUnixNanoSec = now;
      currentTimeframe.startTimeUnixNanoSec = getRelativeStartTime(
        now,
        timeframe.offsetRange
      );
    }
  };

  const handleCustomClick = (event: MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
    setPreviousSelected(isSelected);
  };

  // const toTimeframeFromRelative = (timeFrame: RelativeTimeFrame) => {
  //   const now = msToNanosec(new Date().getTime());
  //   currentTimeframe.endTimeUnixNanoSec = msToNanosec(new Date().getTime());
  //   const offset = timeFrame.offsetRange;
  //   currentTimeframe.startTimeUnixNanoSec = getRelativeStartTime(now, offset);
  // };

  // const toTimeframeFromCustom = (customTimeFrame: CustomTimeFrame) => {
  //   currentTimeframe.startTimeUnixNanoSec = customTimeFrame.startTime;
  //   currentTimeframe.endTimeUnixNanoSec = customTimeFrame.endTime;
  // };

  // const calcTimeFrame = (timeframeType: TimeFrameTypes) => {
  //   if (isRelativeTimeFrame(timeframeType)) {
  //     toTimeframeFromRelative(timeframeType);
  //   } else if (isCustomTimeFrame(timeframeType)) {
  //     toTimeframeFromCustom(timeframeType);
  //   }
  // };

  const handleBtnClicked = (
    event: MouseEvent<HTMLElement>,
    value: TimeFrameTypes
  ) => {
    setIsSelected(value);
    if (value?.label === "Custom") {
      handleCustomClick(event);
    } else {
      calcTimeFrame(value);
      setRelativeTimeframe(currentTimeframe.startTimeUnixNanoSec);
    }
  };

  const handleCancel = () => {
    setIsSelected(previousSelected);
    //setRelativeTimeframe(currentTimeframe.startTimeUnixNanoSec);
    setOpen(false);
  };

  const getTooltipTitle = (offset?: string, liveSpansOn?: boolean): string => {
    const now = msToNanosec(new Date().getTime());
    const startTime = offset
      ? getRelativeStartTime(now, offset)
      : currentTimeframe.startTimeUnixNanoSec;
    const formattedEndTime = liveSpansOn
      ? "Now"
      : offset
      ? formatNanoToTimeString(now)
      : formatNanoToTimeString(currentTimeframe.endTimeUnixNanoSec);

    return `${formatNanoToTimeString(startTime)} -> ${formattedEndTime}`;
  };

  if (!liveSpansOn) {
    calcTimeFrame(isSelected);
  }

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
          {isSelected?.label === customOption?.label && !open
            ? getTooltipTitle()
            : customOption.label}
        </ToggleButton>

        {options.map((tf) => (
          <Tooltip
            key={tf.label}
            title={getTooltipTitle(tf.offsetRange)}
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

type CustomTimeFrame = {
  label: string;
};

export type TimeFrameTypes = RelativeTimeFrame | CustomTimeFrame;
