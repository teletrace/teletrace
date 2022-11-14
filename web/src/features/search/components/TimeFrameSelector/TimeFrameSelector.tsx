import { StringDecoder } from "string_decoder";

import { Popover, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useRef, useState } from "react";
import styles from "./styles";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { SettingsOverscanOutlined } from "@mui/icons-material";
import { setEngine } from "crypto";

export type TimeFrameSelectorProps = {
  //value?: TimeFrame;
  options: TimeFrame[];
  onChange?: (tf: TimeFrame) => void;
};

export const TimeFrameSelector = ({
  options,
  onChange,
}: TimeFrameSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState<TimeFrame>(options[0]);
  const customOption: TimeFrame = {
    label: "Custom",
    startTime: new Date(),
    endTime: new Date(),
  };

  const handleCustomClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleBtnClicked = (
    event: React.MouseEvent<HTMLElement>,
    value: TimeFrame
  ) => {
    if (value?.label === "Custom") {
      handleCustomClick(event);
    }
    onChange?.(value);
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
        <DateTimeSelector
          value={selectedDate}
          onChange={(d) => {
            setSelectedDate(d);
          }}
        />
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
