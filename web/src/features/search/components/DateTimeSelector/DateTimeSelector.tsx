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
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

import { msToNano } from "@/utils/format";

import { useSpanSearchStore } from "../../stores/spanSearchStore";
import { styles } from "./styles";

export type DateTimeSelectorProps = {
  closeDialog: () => void;
  onCancel: () => void;
};

export const DateTimeSelector = ({
  closeDialog,
  onCancel,
}: DateTimeSelectorProps) => {
  const timeframeState = useSpanSearchStore((state) => state.timeframeState);

  const [startDate, setStartDate] = useState<Date | null>(
    new Date(timeframeState.currentTimeframe.startTimeUnixNanoSec / 1000000)
  );
  const [endDate, setEndDate] = useState<Date | null>(() => {
    if (timeframeState.currentTimeframe.endTimeUnixNanoSec !== 0) {
      return new Date(
        timeframeState.currentTimeframe.endTimeUnixNanoSec / 1000000
      );
    }
    return new Date();
  });
  const [startTime, setStartTime] = useState<Date | null>(startDate);
  const [endTime, setEndTime] = useState<Date | null>(endDate);
  const [timeValid, setTimeValid] = useState<boolean>(true);

  const calcRange = () => {
    const startRange = msToNano(
      startDate && startTime
        ? new Date(
            startDate.setHours(
              startTime.getHours(),
              startTime.getMinutes(),
              startTime.getSeconds()
            )
          ).getTime()
        : new Date().getTime()
    );

    const endRange = msToNano(
      endTime && endDate
        ? new Date(
            endDate.setHours(
              endTime.getHours(),
              endTime.getMinutes(),
              endTime.getSeconds()
            )
          ).getTime()
        : new Date().getTime()
    );
    return { startRange, endRange };
  };

  const handleApply = () => {
    const timeRange = calcRange();
    if ((timeRange.startRange || timeRange.endRange) > msToNano(Date.now())) {
      setTimeValid(false);
    } else {
      if (timeRange.startRange <= timeRange.endRange) {
        setTimeValid(true);
        timeframeState.setAbsoluteTimeframe(
          timeRange.startRange,
          timeRange.endRange
        );
        closeDialog();
      } else {
        setTimeValid(false);
      }
    }
  };

  const padToTwoDigits = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const getFormattedTimezone = (
    totalMinutes: number,
    islocalTimeAhead: boolean
  ): string => {
    totalMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const UTC_sign = islocalTimeAhead ? "+" : "-";
    return `${UTC_sign}${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`;
  };

  const getTimezone = () => {
    const offset = new Date().getTimezoneOffset();
    const islocalTimeAhead = offset < 0;
    return `UTC${getFormattedTimezone(offset, islocalTimeAhead)}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogContent sx={{ width: "350px" }}>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>From</FormLabel>
            <Stack direction="row" spacing={2}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                onChange={(startDate) => {
                  setTimeValid(true);
                  setStartDate(startDate);
                }}
                renderInput={(props) => (
                  <TextField {...props} sx={styles.dateInput} />
                )}
                value={startDate}
                disableFuture={true}
              />
              <TimePicker
                ampm={false}
                views={["hours", "minutes", "seconds"]}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                onChange={(startTime) => {
                  setTimeValid(true);
                  setStartTime(startTime);
                }}
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
                  setTimeValid(true);
                  setEndDate(endDate);
                }}
                value={endDate}
                disableFuture={true}
              />
              <TimePicker
                ampm={false}
                openTo="hours"
                views={["hours", "minutes", "seconds"]}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                onChange={(endTime) => {
                  setTimeValid(true);
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
      <DialogActions flex-direction="row">
        <Typography sx={styles.timezone_typography}>{getTimezone()}</Typography>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </LocalizationProvider>
  );
};
