import { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField, Popover } from "@mui/material";
import "./DateTimeSelector.scss";
import ErrorIcon from "@mui/icons-material/Error";

export const DateTimeSelector = (props: DateTimeSelectorProps) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromTime, setFromTime] = useState(new Date().getTime());
  const [toTime, setToTime] = useState(new Date().getTime());
  const isDateValid = () => {
    return fromDate > toDate;
  };
  const isTimeValid = () => {
    return fromTime > toTime;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <div>
          <div>Between</div>
          <DatePicker
            className="date-picker"
            renderInput={(props) => <TextField {...props} />}
            onChange={(date) => {
              setFromDate(date);
              props.onChange?.(date);
            }}
            value={props.value}
          />
          <TimePicker
            className="time-picker"
            value={props.value}
            onChange={(time) => {
              props.onChange?.(time);
              console.log(time);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div className="date-row">
          <div className="label">And</div>
          <DatePicker
            className="date-picker"
            renderInput={(props) => <TextField {...props} />}
            onChange={(date) => {
              setToDate(date);
              props.onChange?.(date);
              console.log(date);
            }}
            value={props.value}
          />
          <TimePicker
            className="time-picker"
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
        <div className="error">
          <ErrorIcon />
          Error
        </div>
      ) : null}
      {isTimeValid() ? (
        <div className="error">
          <ErrorIcon />
          Error
        </div>
      ) : null}
      <div className="controls">
        <button>cancel</button>
        <button>apply</button>
      </div>
    </LocalizationProvider>
  );
};

export type DateTimeSelectorProps = {
  value: Date | any;
  onChange?: (d: Date) => void;
};
