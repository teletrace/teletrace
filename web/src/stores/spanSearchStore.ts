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

import create, { StateCreator } from "zustand";

import { ONE_HOUR_IN_NS, getCurrentTimestamp } from "@/utils/format";

import { DisplaySearchFilter } from "../features/search/types/common";

interface LiveSpansSlice {
  liveSpansState: {
    isOn: boolean;
    intervalInMillis: number;
    setIsOn: (isOn: boolean) => void;
  };
}
const createLiveSpansSlice: StateCreator<
  LiveSpansSlice & TimeframeSlice & FiltersSlice,
  [],
  [],
  LiveSpansSlice
> = (set) => ({
  liveSpansState: {
    isOn: false,
    intervalInMillis: 2000,
    setIsOn: (isOn: boolean) =>
      set((state) => ({
        liveSpansState: {
          ...state.liveSpansState,
          isOn: isOn,
        },
      })),
  },
});

export type TimeFrameState = {
  startTimeUnixNanoSec: number;
  endTimeUnixNanoSec: number;
  isRelative: boolean;
};

interface TimeframeSlice {
  timeframeState: {
    currentTimeframe: TimeFrameState;
    setRelativeTimeframe: (newStartTimeUnixNanoSec: number) => void;
    setAbsoluteTimeframe: (
      newStartTimeUnixNanoSec: number,
      newEndTimeUnixNanoSec: number
    ) => void;
  };
}
const createTimeframeSlice: StateCreator<
  LiveSpansSlice & TimeframeSlice & FiltersSlice,
  [],
  [],
  TimeframeSlice
> = (set) => ({
  timeframeState: {
    currentTimeframe: {
      startTimeUnixNanoSec: getCurrentTimestamp() - ONE_HOUR_IN_NS,
      endTimeUnixNanoSec: getCurrentTimestamp(),
      isRelative: true,
    },
    setRelativeTimeframe: (newStartTimeUnixNanoSec: number) => {
      set((state) => ({
        timeframeState: {
          ...state.timeframeState,
          currentTimeframe: {
            startTimeUnixNanoSec: newStartTimeUnixNanoSec,
            endTimeUnixNanoSec: state.liveSpansState.isOn
              ? 0
              : getCurrentTimestamp(),
            isRelative: true,
          },
        },
      }));
    },
    setAbsoluteTimeframe: (
      newStartTimeUnixNanoSec: number,
      newEndTimeUnixNanoSec: number
    ) => {
      set((state) => {
        state.liveSpansState.setIsOn(false);

        return {
          timeframeState: {
            ...state.timeframeState,
            currentTimeframe: {
              startTimeUnixNanoSec: newStartTimeUnixNanoSec,
              endTimeUnixNanoSec: newEndTimeUnixNanoSec,
              isRelative: false,
            },
          },
        };
      });
    },
  },
});

interface FiltersSlice {
  filtersState: {
    filters: Array<DisplaySearchFilter>;
    addFilter: (filter: DisplaySearchFilter) => void;
    saveFilter: (filter: DisplaySearchFilter) => void;
    deleteFilter: (id: string) => void;
    clearFilters: () => void;
  };
}
const createFiltersSlice: StateCreator<
  LiveSpansSlice & TimeframeSlice & FiltersSlice,
  [],
  [],
  FiltersSlice
> = (set) => ({
  filtersState: {
    filters: [],
    addFilter: (filter: DisplaySearchFilter) =>
      set((state) => {
        state.filtersState.filters.push(filter);
        return { filtersState: state.filtersState };
      }),
    saveFilter: (filter: DisplaySearchFilter) =>
      set((state) => {
        const filterToUpdate = state.filtersState.filters.find(
          (f) => f.id === filter.id
        );

        if (filterToUpdate !== undefined) {
          filterToUpdate.keyValueFilter = filter.keyValueFilter;
        } else {
          state.filtersState.addFilter(filter);
        }

        return { filtersState: state.filtersState };
      }),
    deleteFilter: (id: string) =>
      set((state) => {
        return {
          filtersState: {
            ...state.filtersState,
            filters: state.filtersState.filters.filter((f) => f.id != id),
          },
        };
      }),
    clearFilters: () =>
      set((state) => {
        return {
          filtersState: {
            ...state.filtersState,
            filters: [],
          },
        };
      }),
  },
});

export const useSpanSearchStore = create<
  TimeframeSlice & LiveSpansSlice & FiltersSlice
>()((...set) => ({
  ...createTimeframeSlice(...set),
  ...createLiveSpansSlice(...set),
  ...createFiltersSlice(...set),
}));
