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

import { Divider, Stack, Typography } from "@mui/material";
import { Fragment, useCallback, useState } from "react";

import { Head } from "@/components/Head";
import { getCurrentTimestamp } from "@/utils/format";

import { LiveSpanSwitch } from "../components/LiveSpansSwitch";
import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { SearchFilter, Timeframe } from "../types/common";

export type FiltersState = {
  filters: Array<SearchFilter>;
  timeframe: Timeframe;
};

export type LiveSpansState = {
  isOn: boolean;
  intervalInMs: number;
};

export const SpanSearch = () => {
  const [filtersState, setFiltersState] = useState<FiltersState>({
    filters: [],
    timeframe: getCurrentTimestamp(),
  });

  const [liveSpansState, setLiveSpansState] = useState<LiveSpansState>({
    isOn: false,
    intervalInMs: 2000,
  });

  const onFilterChange = useCallback(
    (entry: SearchFilter, isDelete = false) => {
      return setFiltersState((prevState: FiltersState) => {
        const shouldRemoveFilter =
          isDelete ||
          (["in", "not_in"].includes(entry.keyValueFilter.operator) &&
            Array.isArray(entry.keyValueFilter.value) &&
            entry.keyValueFilter.value.length == 0);
        const newFilters = [...prevState.filters];
        const existIndex = newFilters.findIndex(
          (f) =>
            f.keyValueFilter.key === entry.keyValueFilter.key &&
            f.keyValueFilter.operator === entry.keyValueFilter.operator
        );
        if (shouldRemoveFilter) {
          if (existIndex > -1) {
            newFilters.splice(existIndex, 1);
          }
        } else {
          if (existIndex > -1) {
            newFilters[existIndex] = entry;
          } else {
            newFilters.push(entry);
          }
        }
        return { timeframe: prevState.timeframe, filters: newFilters };
      });
    },
    [setFiltersState]
  );

  const toggleLiveSpans = (isOn: boolean) =>
    setLiveSpansState((prevState) => ({ ...prevState, isOn: isOn }));

  return (
    <Fragment>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack
        sx={{ paddingBottom: "12px", paddingTop: "24px" }}
        display="flex"
        flexDirection="row"
      >
        <Typography variant="h5" fontWeight="600">
          Spans
        </Typography>
        <Stack marginLeft="auto">
          <LiveSpanSwitch
            isOn={liveSpansState.isOn}
            onLiveSpansChange={toggleLiveSpans}
            disabled={false}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ height: "100%", minWidth: 0 }}
      >
        <aside style={{ display: "flex", maxHeight: "100%" }}>
          <TagSidebar
            onChange={onFilterChange}
            filters={filtersState.filters}
            timeframe={filtersState.timeframe}
          />
        </aside>

        <Stack
          direction="column"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          sx={{ height: "100%", width: "100%", minWidth: 0 }}
        >
          <SearchBar
            timeframe={filtersState.timeframe}
            filters={filtersState.filters}
            onFilterAdded={onFilterChange}
            onFilterDeleted={(filter) => onFilterChange(filter, true)}
          />
          <SpanTable
            timeframe={filtersState.timeframe}
            filters={filtersState.filters}
            liveSpans={liveSpansState}
          />
        </Stack>
      </Stack>
    </Fragment>
  );
};
