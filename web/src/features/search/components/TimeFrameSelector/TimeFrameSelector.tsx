import React, { useRef } from "react";
import { ToggleButtonGroup, ToggleButton, Popover } from "@mui/material";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

import { useState } from "react";
import { StringDecoder } from "string_decoder";

export const TimeFrameSelector = (props: TimeFrameSelectorProps) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const buttonRef = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleBtnClicked = (
    event: React.MouseEvent<HTMLElement>,
    value: any
  ) => {
    setSelectedTimeFrame(value);
    props.onChange?.(value);
    setAnchorEl(buttonRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <ToggleButtonGroup
        exclusive
        onChange={(e, value) => {
          props.onChange?.(value);
        }}
        value={props.value}
      >
        {props.options.map((value) => {
          return (
            <ToggleButton
              selected={selectedTimeFrame?.label == value.label}
              value={value}
              onClick={handleBtnClicked}
              ref={buttonRef}
            >
              {value.label}
              <Popover
                open={selectedTimeFrame?.label == "Custom"}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClose={handleClose}
              >
                <DateTimeSelector
                  value={selectedDate}
                  onChange={(d) => {
                    console.log(d);
                    setSelectedDate(d);
                  }}
                />
              </Popover>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
};

//export type TimeFrameLabel = TimeFrame & { label: string };

type RelativeTimeFrame = {
  label: string;
  relativeTo?: string;
  offsetRange?: string;
};

type AbsoluteTimeFrame = {
  start: number;
  end: number;
};

type CustomeTimeFrame = {
  label: string;
  startTime: Date;
  endTime: Date;
};

export type TimeFrame = RelativeTimeFrame | CustomeTimeFrame;

export type TimeFrameSelectorProps = {
  value?: TimeFrame;
  options: TimeFrame[];
  //customeTimeFrame: CustomeTimeFrame;
  onChange?: (tf: TimeFrame) => void;
};
