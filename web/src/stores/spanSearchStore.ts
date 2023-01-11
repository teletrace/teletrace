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
import { immer } from "zustand/middleware/immer";

import { ONE_HOUR_IN_NS, getCurrentTimestamp } from "@/utils/format";

import {
  DisplaySearchFilter,
  KeyValueFilter,
} from "../features/search/types/common";
import { getFilterId } from "../features/search/utils/filters_utils";

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
              ? 0 // When endTimeUnixNanoSec is 0, the backend handles the end of the timeframe (optimization for Live Spans feature)
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

const createNewFilter: (kvf: KeyValueFilter) => DisplaySearchFilter = (kvf) => ({
    id: getFilterId(kvf.key, kvf.operator),
    keyValueFilter: kvf,
});

interface FiltersSlice {
  filtersState: {
    filters: Array<DisplaySearchFilter>;
    addFilter: (filter: KeyValueFilter) => void;
    updateOrCreateFilter: (filter: DisplaySearchFilter) => void;
    deleteFilter: (id: string) => void;
    clearFilters: () => void;
  };
}
const createFiltersSlice: StateCreator<
  LiveSpansSlice & TimeframeSlice & FiltersSlice,
  [],
  [["zustand/immer", never]],
  FiltersSlice
> = immer((set) => ({
  filtersState: {
    filters: [],
    addFilter: (keyValueFilter: KeyValueFilter) =>
      set((state) => {
        state.filtersState.filters.push(createNewFilter(keyValueFilter));
      }),
    // If this function is called with a filter that doesn't exist in the state, it will create and add it to 'filters'
    // If the filter exists, it will simply update it with the desired values
    updateOrCreateFilter: (filter: DisplaySearchFilter) =>
      set((state) => {
        const filterToUpdate = state.filtersState.filters.find(
          (f) => f.id === filter.id
        );

        if (filterToUpdate !== undefined) {
          filterToUpdate.keyValueFilter = filter.keyValueFilter;
        } else {
          state.filtersState.filters.push(createNewFilter(filter.keyValueFilter));
        }
      }),
    deleteFilter: (id: string) =>
      set((state) => ({
        filtersState: {
          ...state.filtersState,
          filters: state.filtersState.filters.filter((f) => f.id != id),
        },
      })),
    clearFilters: () =>
      set((state) => ({
        filtersState: {
          ...state.filtersState,
          filters: [],
        },
      })),
  },
}));

export const useSpanSearchStore = create<
  TimeframeSlice & LiveSpansSlice & FiltersSlice
>()((...set) => ({
  ...createTimeframeSlice(...set),
  ...createLiveSpansSlice(...set),
  ...createFiltersSlice(...set),
}));
