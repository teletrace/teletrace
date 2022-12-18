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

import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

import { msToNanoSec } from "@/utils/format";

import { Timeframe } from "../../types/common";
import { styles } from "./styles";

export type DateTimeSelectorProps = {
  onChange: (timeframe: Timeframe, isRelative: boolean) => void;
  value: Timeframe;
  onClose: () => void;
};

export const DateTimeSelector = ({
  onChange,
  value,
  onClose,
}: DateTimeSelectorProps) => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(value.startTimeUnixNanoSec / 1000000)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(value.endTimeUnixNanoSec / 1000000)
  );
  const [startTime, setStartTime] = useState<Date | null>(startDate);
  const [endTime, setEndTime] = useState<Date | null>(endDate);
  const [timeValid, setTimeValid] = useState<boolean>(true);

  const calcRange = () => {
    const startRange = msToNanoSec(
      startDate && startTime
        ? new Date(
            startDate.setHours(startTime.getHours(), startTime.getMinutes())
          ).getTime()
        : new Date().getTime()
    );

    const endRange = msToNanoSec(
      endTime && endDate
        ? new Date(
            endDate.setHours(endTime.getHours(), endTime.getMinutes())
          ).getTime()
        : new Date().getTime()
    );
    return { startRange, endRange };
  };

  const handleApply = () => {
    const timeRange = calcRange();
    if (timeRange.startRange < timeRange.endRange) {
      setTimeValid(true);
      onChange(
        {
          startTimeUnixNanoSec: timeRange.startRange,
          endTimeUnixNanoSec: timeRange.endRange,
        },
        false
      );
      onClose();
    } else {
      setTimeValid(false);
      onChange(value, false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogContent sx={{ width: "320px" }}>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>From</FormLabel>
            <Stack direction="row" spacing={2}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                onChange={(startDate) => setStartDate(startDate)}
                renderInput={(props) => (
                  <TextField {...props} sx={styles.dateInput} />
                )}
                value={startDate}
              />
              <TimePicker
                ampm={false}
                onChange={(startTime) => setStartTime(startTime)}
                value={startTime}
                renderInput={(params) => (
                  <TextField {...params} sx={styles.timeInput} />
                )}
              />
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>To</FormLabel>
            <Stack direction="row" spacing={2}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                renderInput={(props) => (
                  <TextField {...props} sx={styles.dateInput} />
                )}
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
                renderInput={(params) => (
                  <TextField {...params} sx={styles.timeInput} />
                )}
              />
            </Stack>
          </FormControl>
          {!timeValid ? (
            <Alert sx={styles.alert} variant="outlined" severity="error">
              Please enter a valid date range
            </Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <Divider sx={{ borderBottomWidth: 2, backgroundColor: "black" }} />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </LocalizationProvider>
  );
};
