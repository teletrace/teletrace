import { Alert, Button, DialogContent, Stack, TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { Timeframe } from "../../types/common";

export type DateTimeSelectorProps = {
  onChange: (timeframe: Timeframe) => void;
};

export const DateTimeSelector = ({ onChange }: DateTimeSelectorProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(new Date().setHours(new Date().getHours() - 1))
  );
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [timeValid, setTimeValid] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<Timeframe>({
    startTimeUnixNanoSec: new Date().setHours(new Date().getHours() - 1),
    endTimeUnixNanoSec: new Date().getTime(),
  });

  const calcRange = () => {
    const startRange = new Date(
      startDate!.setHours(startTime!.getHours(), startTime!.getMinutes())
    ).getTime();
    const endRange = new Date(
      endDate!.setHours(endTime!.getHours(), endTime!.getMinutes())
    ).getTime();
    setTimeframe({
      startTimeUnixNanoSec: startRange,
      endTimeUnixNanoSec: endRange,
    });

    return { startTimeUnixNanoSec: startRange, endTimeUnixNanoSec: endRange };
  };

  const handleApply = () => {
    const timeRange = calcRange();
    const isTimeValid =
      timeRange.startTimeUnixNanoSec < timeRange.endTimeUnixNanoSec;
    setTimeValid(isTimeValid);
    onChange(timeRange);
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
        <Button onClick={handleApply}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </Stack>
    </LocalizationProvider>
  );
};
