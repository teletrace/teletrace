import { TextField, Button, Alert, Stack, DialogContent } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

export type DateTimeSelectorProps = {
  onChange: (dateTimeRange: DateTimeRange) => void;
};

export type DateTimeRange = {
  start: Number;
  end: Number;
};

export const DateTimeSelector = ({ onChange }: DateTimeSelectorProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(new Date().setHours(new Date().getHours() - 1))
  );
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [timeValid, setTimeValid] = useState<boolean>(true);
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({
    start: new Date().setHours(new Date().getHours() - 1),
    end: new Date().getTime(),
  });

  const calcRange = () => {
    let startRange = new Date(
      startDate!.setHours(startTime!.getHours(), startTime!.getMinutes())
    ).getTime();
    let endRange = new Date(
      endDate!.setHours(endTime!.getHours(), endTime!.getMinutes())
    ).getTime();
    // let endRange = combineDateAndTimeIntoRange(endTime!);

    setDateTimeRange({ start: startRange, end: endRange });

    return { start: startRange, end: endRange };
  };

  const applyTime = () => {
    let timeRange = calcRange();
    let isTimeValid = timeRange.start < timeRange.end;
    setTimeValid(isTimeValid);
    onChange(dateTimeRange);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogContent>
        From
        <Stack direction="row">
          <DatePicker
            inputFormat="dd-MM-yyyy"
            onChange={(startDate) => {
              setStartDate(startDate);
            }}
            renderInput={(props) => <TextField {...props} />}
            value={startDate}
          />
          <TimePicker
            ampm={false}
            onChange={(startTime) => {
              setStartTime(startTime);
            }}
            value={startTime}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
        To
        <Stack direction="row">
          <DatePicker
            inputFormat="dd-MM-yyyy"
            renderInput={(props) => <TextField {...props} />}
            onChange={(endDate) => {
              setEndDate(endDate);
            }}
            value={endDate}
          />
          <TimePicker
            ampm={false}
            onChange={(endTime) => {
              setEndTime(endTime);
            }}
            value={endTime}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </DialogContent>
      {!timeValid ? (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="error">Please enter a valid date range</Alert>
        </Stack>
      ) : null}
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={applyTime}>Cancel</Button>
        <Button onClick={applyTime}>Apply</Button>
      </Stack>
    </LocalizationProvider>
  );
};
