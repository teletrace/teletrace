import {
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  DialogContent,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

export type TimeFrameSelectorProps = {
  onChange: (absoluteTimeFrame: AbsoluteTimeFrame) => void;
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
  const [isSelected, setIsSelected] = useState<TimeFrame>(options[0]);

  const [absoluteTimeFrame, setAbsoluteTimeFrame] =
    useState<AbsoluteTimeFrame>();

  const handleCustomClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  function instanceOfRelativeTimeFrame(
    object: any
  ): object is RelativeTimeFrame {
    return "offsetRange" in object;
  }

  function instanceOfCustomTimeFrame(object: any): object is CustomTimeFrame {
    return "startTime" in object;
  }

  const setAbsuloteFromRelative = (timeFrame: RelativeTimeFrame) => {
    let startTime = new Date();
    let endTimeNumber = new Date().getTime();
    let offset = timeFrame.offsetRange;
    if (offset === "1h") startTime.setHours(startTime.getHours() - 1);
    else if (offset === "1d") startTime.setDate(startTime.getDate() - 1);
    else if (offset === "3d") startTime.setDate(startTime.getDate() - 3);
    else if (offset === "1w") startTime.setDate(startTime.getDate() - 7);
    let startTimeNumber = startTime.getTime();
    setAbsoluteTimeFrame({ start: startTimeNumber, end: endTimeNumber });
    return { start: startTimeNumber, end: endTimeNumber };
  };

  const setAbsoluteFromCustom = (timeFrame: CustomTimeFrame) => {
    setAbsoluteTimeFrame({
      start: timeFrame.startTime.getTime(),
      end: timeFrame.endTime.getTime(),
    });
  };

  const calcAbsoluteTimeFrame = (timeFrame: TimeFrame) => {
    if (instanceOfRelativeTimeFrame(timeFrame)) {
      return setAbsuloteFromRelative(timeFrame);
    } else if (instanceOfCustomTimeFrame(timeFrame)) {
      return setAbsoluteFromCustom(timeFrame);
    }
  };

  const handleBtnClicked = (
    event: React.MouseEvent<HTMLElement>,
    value: TimeFrame
  ) => {
    if (value?.label === "Custom") {
      handleCustomClick(event);
    }
    let timeFrame = calcAbsoluteTimeFrame(value);
    onChange(timeFrame!);
    setAnchorEl(buttonRef.current);
    setIsSelected(value);
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
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <DateTimeSelector
            onChange={(absTimeFrame) => {
              setAbsoluteTimeFrame(absTimeFrame);
            }}
          />
        </DialogContent>
      </Popover>
      <ToggleButtonGroup
        exclusive
        onChange={(e, value) => {
          onChange?.(value);
        }}
      >
        <ToggleButton
          onClick={handleBtnClicked}
          selected={isSelected?.label === customOption?.label}
          value={customOption}
          ref={buttonRef}
          key={customOption.label}
        >
          {customOption.label}
        </ToggleButton>
        {options.map((tf, idx) => {
          return (
            <ToggleButton
              onClick={handleBtnClicked}
              selected={isSelected?.label === tf?.label}
              value={tf}
              ref={buttonRef}
              key={tf.label}
            >
              {tf.label}
            </ToggleButton>
          );
        })}
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

export type TimeFrame = RelativeTimeFrame | CustomTimeFrame;

export type AbsoluteTimeFrame = {
  start: Number;
  end: Number;
};
