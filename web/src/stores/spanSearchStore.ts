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

import create, {StateCreator} from "zustand";

import {getCurrentTimestamp, msToNanoSec} from "@/utils/format";

export type TimeFrameState = {
  startTimeUnixNanoSec: number;
  endTimeUnixNanoSec: number;
  isRelative: boolean;
};

interface TimeframeSlice {
  timeframe: {
    currentTimeframe: TimeFrameState
    setRelativeTimeframe: (durationInNanoSec: number) => void,
    setAbsoluteTimeframe: (newStartTimeUnixNanoSec: number, newEndTimeUnixNanoSec: number) => void,
  }
}

interface LiveSpansSlice {
  liveSpans: {
    isOn: boolean;
    intervalInMillis: number;
    setIsOn: (isOn: boolean) => void;
  }
}

const createLiveSpansSlice: StateCreator<LiveSpansSlice> = (set) => ({
  liveSpans: {
    isOn: false,
    intervalInMillis: 2000,
    setIsOn: (isOn: boolean) => set((state) => ({
      liveSpans: {
        ...state.liveSpans,
        isOn: isOn,
      },
    })),
  }
});


const createTimeframeSlice: StateCreator<TimeframeSlice> = (set) => ({
  timeframe: {
    currentTimeframe: {
      startTimeUnixNanoSec: (getCurrentTimestamp() - msToNanoSec(3600 * 1000)),
      endTimeUnixNanoSec: getCurrentTimestamp(),
      isRelative: true
    },
    setRelativeTimeframe: (durationInMillis: number) => {
      set((state) => ({
        timeframe: {
          ...state.timeframe,
          currentTimeframe: {
            startTimeUnixNanoSec: getCurrentTimestamp() - msToNanoSec(msToNanoSec(durationInMillis)),
            endTimeUnixNanoSec: getCurrentTimestamp(),
            isRelative: true
          },
        },
      }));
    },
    setAbsoluteTimeframe: (newStartTimeUnixNanoSec: number, newEndTimeUnixNanoSec: number) => {
      set((state) => ({
        timeframe: {
          ...state.timeframe,
          currentTimeframe: {
            startTimeUnixNanoSec: newStartTimeUnixNanoSec,
            endTimeUnixNanoSec: newEndTimeUnixNanoSec,
            isRelative: false
          },
        },
      }));
    },
  },
});

export const useSpanSearchStore = create<TimeframeSlice & LiveSpansSlice>()((...set) => ({
  ...createTimeframeSlice(...set),
  ...createLiveSpansSlice(...set),
}));