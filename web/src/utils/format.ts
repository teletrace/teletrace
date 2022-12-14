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

import format from "date-fns/format";

import { Timeframe } from "../features/search/types/common";

export const formatDateAsDateTime = (
  date: Date | number,
  { showMs = false, showSec = true } = {}
) => {
  const pattern = `PP, HH:mm${showSec ? ":ss" : ""}${
    showSec && showMs ? ".SSS" : ""
  }`;
  return format(date, pattern);
};

export const formatNumber = (n: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const nanoSecToMs = (nanoSec: number) => {
  return nanoSec / (1000 * 1000);
};

export const msToNanoSec = (ms: number) => {
  return ms * 1000000;
};

export const roundNanoToTwoDecimalMs = (nanoSec: number) => {
  const ms = nanoSecToMs(nanoSec);
  return Math.round(ms * 100) / 100;
};

export const formatNanoAsMsDateTime = (nanoSec: number) => {
  const ms = nanoSecToMs(nanoSec);
  return formatDateAsDateTime(ms, { showMs: true });
};

export const getCurrentTimestamp = (): Timeframe => {
  const now = new Date().valueOf();
  return {
    startTimeUnixNanoSec: msToNanoSec(now - 3600000),
    endTimeUnixNanoSec: msToNanoSec(now),
  };
};
