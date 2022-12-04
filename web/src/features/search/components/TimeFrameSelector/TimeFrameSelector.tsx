import {
  DialogContent,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { Timeframe } from "../../types/common";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";
import { formatDateToTimeString } from "@/utils/format";

export type TimeFrameSelectorProps = {
  onChange: (timeframe: Timeframe) => void;
};

export const TimeFrameSelector = ({ onChange }: TimeFrameSelectorProps) => {
  const options: RelativeTimeFrame[] = [
    { label: "1H", offsetRange: "1h", relativeTo: "now" },
    { label: "1D", offsetRange: "1d", relativeTo: "now" },
    { label: "3D", offsetRange: "3d", relativeTo: "now" },
    { label: "1W", offsetRange: "1w", relativeTo: "now" },
  ];

  const customOption: CustomTimeFrame = {
    label: "Custom",
    startTime: new Date(),
    endTime: new Date(),
  };

  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState<TimeFrameTypes>(options[0]);

  const [timeframe, setTimeFrame] = useState<Timeframe>();

  const handleCustomClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget);
  };

  function instanceOfRelativeTimeFrame(
    object: any
  ): object is RelativeTimeFrame {
    return "offsetRange" in object;
  }

  function instanceOfCustomTimeFrame(object: any): object is CustomTimeFrame {
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
    return {
      startTimeUnixNanoSec: startTimeNumber,
      endTimeUnixNanoSec: endTimeNumber,
    };
  };

  const toTimeframeFromCustom = (timeFrame: CustomTimeFrame) => {
    return {
      startTimeUnixNanoSec: timeFrame.startTime.getTime(),
      endTimeUnixNanoSec: timeFrame.endTime.getTime(),
    };
  };

  const calcTimeFrame = (timeFrame: TimeFrameTypes) => {
    if (instanceOfRelativeTimeFrame(timeFrame)) {
      return toTimeframeFromRelative(timeFrame);
    } else if (instanceOfCustomTimeFrame(timeFrame)) {
      return toTimeframeFromCustom(timeFrame);
    }
  };

  const handleBtnClicked = (
    event: React.MouseEvent<HTMLElement>,
    value: TimeFrameTypes
  ) => {
    if (value?.label === "Custom") {
      handleCustomClick(event);
    }
    const timeFrame = calcTimeFrame(value);
    setTimeFrame(timeFrame);
    onChange(timeFrame!);
    setIsSelected(value);
  };

  const getTooltipTitle = (): string =>
    `${formatDateToTimeString(
      timeframe?.startTimeUnixNanoSec || 0
    )} -> ${formatDateToTimeString(timeframe?.endTimeUnixNanoSec || 0)}`;

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
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <DateTimeSelector
            onChange={(timeframe) => {
              setTimeFrame(timeframe);
              onChange(timeframe);
            }}
          />
        </DialogContent>
      </Popover>
      <ToggleButtonGroup exclusive>
        <ToggleButton
          onClick={handleBtnClicked}
          selected={isSelected?.label === customOption?.label}
          value={customOption}
          ref={buttonRef}
          key={customOption.label}
        >
          {isSelected?.label === customOption?.label
            ? getTooltipTitle()
            : customOption.label}
        </ToggleButton>

        {options.map((tf, idx) => (
          <Tooltip
            title={isSelected?.label === tf?.label ? getTooltipTitle() : ""}
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
  startTime: Date;
  endTime: Date;
};

export type TimeFrameTypes = RelativeTimeFrame | CustomTimeFrame;
