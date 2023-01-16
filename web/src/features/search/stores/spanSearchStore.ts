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

import { Operator, SearchFilter, Sort } from "@/features/search";
import { ONE_HOUR_IN_NS, getCurrentTimestamp } from "@/utils/format";

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

const isFiltersStructureEqual = (
  k1: string,
  k2: string,
  o1: Operator,
  o2: Operator
) => k1 === k2 && o1 === o2;

interface FiltersSlice {
  filtersState: {
    filters: Array<SearchFilter>;
    createOrUpdateFilter: (filter: SearchFilter) => void;
    deleteFilter: (key: string, operator: Operator) => void;
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
    // If this function is called with a filter that doesn't exist in the state, it will create and add it to 'filters'
    // If the filter exists, it will simply update it with the desired values
    createOrUpdateFilter: (filter: SearchFilter) =>
      set((state) => {
        const filterToUpdate = state.filtersState.filters.find((f) =>
          isFiltersStructureEqual(
            f.keyValueFilter.key,
            filter.keyValueFilter.key,
            f.keyValueFilter.operator,
            filter.keyValueFilter.operator
          )
        );

        if (filterToUpdate !== undefined) {
          filterToUpdate.keyValueFilter = filter.keyValueFilter;
        } else {
          state.filtersState.filters.push(filter);
        }
      }),
    deleteFilter: (key: string, operator: Operator) =>
      set((state) => {
        const filterIndex = state.filtersState.filters.findIndex((f) =>
          isFiltersStructureEqual(
            f.keyValueFilter.key,
            key,
            f.keyValueFilter.operator,
            operator
          )
        );
        state.filtersState.filters.splice(filterIndex, 1);
      }),
    clearFilters: () =>
      set((state) => {
        state.filtersState.filters = [];
      }),
  },
}));

interface SortSlice {
  sortState: {
    sort: Sort[];
    setSort: (sort: Sort[]) => void;
  };
}
const createSortSlice: StateCreator<
  LiveSpansSlice & TimeframeSlice & FiltersSlice & SortSlice,
  [],
  [],
  SortSlice
> = (set) => ({
  sortState: {
    sort: [],
    setSort: (sort: Sort[]) =>
      set((state) => ({
        ...state,
        sort: sort,
      })),
  },
});

export const useSpanSearchStore = create<
  TimeframeSlice & LiveSpansSlice & FiltersSlice & SortSlice
>()((...set) => ({
  ...createTimeframeSlice(...set),
  ...createLiveSpansSlice(...set),
  ...createFiltersSlice(...set),
  ...createSortSlice(...set),
}));
