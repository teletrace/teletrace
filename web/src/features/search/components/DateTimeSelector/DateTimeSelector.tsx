import { Popover, TextField, Button } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import "./DateTimeSelector.scss";
import ErrorIcon from "@mui/icons-material/Error";

export const DateTimeSelector = (props: DateTimeSelectorProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime());
  const isDateValid = () => {
    return startDate > endDate;
  };
  const isTimeValid = () => {
    return startTime > endTime;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <div>
          <div>From</div>
          <DatePicker
            renderInput={(props) => <TextField {...props} />}
            onChange={(date) => {
              setStartDate(date);
              props.onChange?.(date);
            }}
            value={props.value}
          />
          <TimePicker
            value={props.value}
            onChange={(time) => {
              props.onChange?.(time);
              console.log(time);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div>
          <div>To</div>
          <DatePicker
            renderInput={(props) => <TextField {...props} />}
            onChange={(date) => {
              setEndDate(date);
              props.onChange?.(date);
              console.log(date);
            }}
            value={props.value}
          />
          <TimePicker
            value={props.value}
            onChange={(time) => {
              props.onChange?.(time);
              console.log(time);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </div>

      {isDateValid() ? (
        <div>
          <ErrorIcon />
          Error
        </div>
      ) : null}
      {isTimeValid() ? (
        <div>
          <ErrorIcon />
          Error
        </div>
      ) : null}
      <div>
        <Button>Cancel</Button>
        <Button>Apply</Button>
      </div>
    </LocalizationProvider>
  );
};

export type DateTimeSelectorProps = {
  value: Date | any;
  onChange?: (d: Date) => void;
};
