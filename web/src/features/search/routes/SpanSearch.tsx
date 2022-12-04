import AdapterDateFns from "@date-io/date-fns";
import { LocalizationProvider } from "@mui/lab";
import { Divider, SliderValueLabel, Stack } from "@mui/material";
import { Fragment, useCallback, useState } from "react";

import { Head } from "@/components/Head";

import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { TimeFrameSelector } from "../components/TimeFrameSelector";
import { SearchFilter, Timeframe } from "../types/common";

export type FiltersState = {
  filters: Array<SearchFilter>;
  timeframe: Timeframe;
};

export const SpanSearch = () => {
  const now = new Date().valueOf();
  const hourInMillis = 60 * 60 * 1000;
  const [filtersState, setFiltersState] = useState<FiltersState>({
    filters: [],
    timeframe: {
      startTimeUnixNanoSec: (now - hourInMillis * 24 * 7) * 1000 * 1000,
      endTimeUnixNanoSec: now * 1000 * 1000,
    },
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
          (Array.isArray(entry.keyValueFilter.value) &&
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

  return (
    <Fragment>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack direction="row" justifyContent="flex-end">
        <TimeFrameSelector
          onChange={(timeframe) => {
            onTimeframeChange(timeframe);
          }}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ height: "100%" }}
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
          sx={{ height: "100%" }}
        >
          <SearchBar
            filters={filtersState.filters}
            onFilterAdded={onFilterChange}
            onFilterDeleted={(filter) => onFilterChange(filter, true)}
          />
          <SpanTable
            timeframe={filtersState.timeframe}
            filters={filtersState.filters}
          />
        </Stack>
      </Stack>
    </Fragment>
  );
};
