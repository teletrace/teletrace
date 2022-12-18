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
  CustomTimeFrame,
  RelativeTimeFrame,
  TimeFrameTypes,
} from "../components/TimeFrameSelector";
import { Timeframe } from "../types/common";

/** types used to query spans from the lupa backend */

export function isRelativeTimeFrame(
  object: TimeFrameTypes
): object is RelativeTimeFrame {
  return "offsetRange" in object;
}

export function isCustomTimeFrame(
  object: TimeFrameTypes
): object is CustomTimeFrame {
  return "startTime" in object;
}

const getTimeFrameFromCustom = (customTimeFrame: CustomTimeFrame) => {
  return {
    startTimeUnixNanoSec: customTimeFrame.startTime,
    endTimeUnixNanoSec: customTimeFrame.endTime,
  };
};

const getCurrentRelativeTimestamp = (
  relativeOffset: string,
  currentDatetime: Date
): number => {
  const hourInMilli = 1000 * 60 * 60;
  const currentTime = currentDatetime?.getTime();

  if (relativeOffset === "1h") return currentTime - 1 * hourInMilli;
  else if (relativeOffset === "1d") return currentTime - 24 * hourInMilli;
  else if (relativeOffset === "3d") return currentTime - 24 * 3 * hourInMilli;
  else if (relativeOffset === "1w") return currentTime - 24 * 7 * hourInMilli;

  return currentTime;
};

const getTimeFrameFromRelative = (
  relativeOffset: string,
  currentDatetime: Date
): Timeframe => {
  const MilliToNano = 1000 * 1000;
  return {
    startTimeUnixNanoSec:
      getCurrentRelativeTimestamp(relativeOffset, currentDatetime) *
      MilliToNano,
    endTimeUnixNanoSec: new Date().getTime() * MilliToNano,
  };
};

export const calcTimeFrame = (
  timeframeType: TimeFrameTypes,
  currentDatetime?: Date
): Timeframe => {
  if (isRelativeTimeFrame(timeframeType)) {
    return getTimeFrameFromRelative(
      timeframeType.offsetRange,
      currentDatetime ? currentDatetime : new Date()
    );
  } else {
    return getTimeFrameFromCustom(timeframeType);
  }
};

// const getCurrentRelativeTimestamp = (relativeOffset: string): Timeframe => {
//   const startTime = new Date();
//   const endTimeNumber = new Date().getTime();
//   if (relativeOffset === "1h") startTime.setHours(startTime.getHours() - 1);
//   else if (relativeOffset === "1d") startTime.setDate(startTime.getDate() - 1);
//   else if (relativeOffset === "3d") startTime.setDate(startTime.getDate() - 3);
//   else if (relativeOffset === "1w") startTime.setDate(startTime.getDate() - 7);
//   const startTimeNumber = startTime.getTime();
//   return {
//     startTimeUnixNanoSec: startTimeNumber * 1000 * 1000,
//     endTimeUnixNanoSec: endTimeNumber * 1000 * 1000,
//   };
// };
//
// export const calcTimeFrame = (timeframeType: TimeFrameTypes): Timeframe => {
//   if (isRelativeTimeFrame(timeframeType)) {
//     return getCurrentRelativeTimestamp(timeframeType.offsetRange);
//   } else {
//     return getTimeFrameFromCustom(timeframeType);
//   }
// };
