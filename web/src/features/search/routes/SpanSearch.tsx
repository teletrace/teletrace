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
import { useCallback, useState } from "react";

import { Head } from "@/components/Head";
import { getCurrentTimestamp } from "@/utils/format";

import { LiveSpanSwitch } from "../components/LiveSpansSwitch";
import { RefreshButton } from "../components/RefreshButton";
import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { TimeFrameSelector } from "../components/TimeFrameSelector";
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

  const onTimeframeChange = useCallback(
    (timeframe: Timeframe) => {
      return setFiltersState((prevState: FiltersState) => {
        return { ...prevState, timeframe };
      });
    },
    [setFiltersState]
  );

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

  const searchRequest = {
    timeframe: filtersState.timeframe,
    filters: filtersState.filters,
  };

  return (
    <Stack display="flex" flexDirection="column" sx={{ height: "100%" }}>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack
        sx={{ paddingBottom: "12px", paddingTop: "24px" }}
        display="flex"
        flexDirection="row"
      >
        <Typography
          variant="h5"
          fontWeight="600"
          style={{
            marginRight: "10px",
            alignSelf: "center",
            paddingBottom: "3px",
          }}
        >
          Spans
        </Typography>
        <RefreshButton
          searchRequest={searchRequest}
          isLiveSpansOn={liveSpansState.isOn}
        />

        <Stack marginLeft="auto" direction="row">
          <Stack sx={{ paddingRight: "24px", justifyContent: "center" }}>
            <TimeFrameSelector
              onChange={onTimeframeChange}
              value={filtersState.timeframe}
            />
          </Stack>
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
        sx={{ height: "100%", minWidth: 0, minHeight: 0 }}
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
          <SpanTable searchRequest={searchRequest} liveSpans={liveSpansState} />
        </Stack>
      </Stack>
    </Stack>
  );
};
