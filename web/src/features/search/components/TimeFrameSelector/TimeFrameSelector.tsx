import React from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { DateTimeSelector } from "../DateTimeSelector/DateTimeSelector";

import { useState } from "react";

export const TimeFrameSelector = (props: TimeFrameSelectorProps) => {
  const [selectedLabel, setSelectedLabel] = useState<TimeFrameLabel>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2021, 5, 24));
  //const [rangeOpened, setRangeOpened] = useState<boolean>();

  const handleBtnClicked = (
    event: React.MouseEvent<HTMLElement>,
    value: any
  ) => {
    setSelectedLabel(value);
    props.onChange?.(value);
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
        {props.options?.map((value) => {
          return (
            <ToggleButton
              selected={selectedLabel?.label == value.label}
              value={value}
              onClick={handleBtnClicked}
            >
              {value.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      {selectedLabel?.label == "Custom" ? (
        <DateTimeSelector
          //onCancel={() => }
          label="date label"
          value={selectedDate}
          onChange={(d) => {
            console.log(d);
            setSelectedDate(d);
          }}
        />
      ) : null}
    </div>
  );
};

//type RelativeTimeFrameLabel = RelativeTimeFrame & { label: string };
export type TimeFrameLabel = TimeFrame & { label: string };

type RelativeTimeFrame = {
  relativeTo?: string;
  offsetRange?: string;
};

type AbsoluteTimeFrame = {
  start: number;
  end: number;
};

export type TimeFrame = RelativeTimeFrame | AbsoluteTimeFrame;

export type TimeFrameSelectorProps = {
  isVisible: boolean;
  value?: TimeFrameLabel;
  options?: TimeFrameLabel[];
  includeCustom?: boolean;
  onChange?: (tfl: TimeFrameLabel) => void;
};
