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

import { LinearProgress } from "@mui/material";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_Row as Row,
  Virtualizer,
} from "material-react-table";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { InternalSpan } from "@/types/span";
import { formatDateAsDateTime, nanoSecToMs } from "@/utils/format";

import { useSpansQuery } from "../../api/spanQuery";
import { SearchFilter } from "../../types/common";
import { LiveSpansState, TimeFrameState } from "./../../routes/SpanSearch";
import { TableSpan, columns } from "./columns";
import styles from "./styles";
import { calcNewSpans } from "./utils";

const DEFAULT_SORT_FIELD = "span.startTimeUnixNano";
const DEFAULT_SORT_ASC = false;

interface SpanTableProps {
  filters?: SearchFilter[];
  timeframe: TimeFrameState;
  searchRequest: SearchRequest;
  liveSpans: LiveSpansState;
}

interface SpansStateProps {
  spans: InternalSpan[];
  newSpansIds: string[];
}

export function SpanTable({
  filters = [],
  timeframe,
  liveSpans,
}: SpanTableProps) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const virtualizerInstanceRef = useRef<Virtualizer>(null);

  const sortDefault: SortingState = [
    { id: DEFAULT_SORT_FIELD, desc: !DEFAULT_SORT_ASC },
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>(sortDefault);
  const [spansState, setSpansState] = useState<SpansStateProps>({
    spans: [],
    newSpansIds: [],
  });

  searchRequest.sort = sorting?.map((columnSort) => ({
    field: columnSort.id,
    ascending: !columnSort.desc,
  }));

  const searchRequest = {
    filters: filters,
    timeframe: {
      startTimeUnixNanoSec: timeframe.startTimeUnixNanoSec,
      endTimeUnixNanoSec: timeframe.endTimeUnixNanoSec,
    },
    sort: sort,
    metadata: undefined,
  };

  const {
    data,
    fetchNextPage,
    isError,
    isRefetching,
    isFetching,
    isLoading,
    hasNextPage,
  } = useSpansQuery(
    searchRequest,
    liveSpans.isOn ? liveSpans.intervalInMilli : 0
  );

  useEffect(() => {
    setSpansState((prevState) => {
      const spans = data?.pages?.flatMap((page) => page.spans) || [];
      return {
        spans: spans,
        newSpansIds: calcNewSpans(prevState.spans, spans),
      };
    });
  }, [data]);

  const { spans, newSpansIds } = spansState;

  const tableSpans =
    spans?.flatMap(
      ({ resource, span, externalFields }): TableSpan => ({
        id: span.spanId,
        traceId: span.traceId,
        spanId: span.spanId,
        startTime: formatDateAsDateTime(nanoSecToMs(span.startTimeUnixNano)),
        duration: externalFields.durationNano,
        name: span.name,
        status: span.status.code,
        serviceName:
          resource.attributes?.["service.name"] !== undefined &&
          typeof resource.attributes?.["service.name"] === "string"
            ? resource.attributes["service.name"]
            : "service unknown",
        isNew: span.spanId in newSpansIds,
      })
    ) ?? [];

  const debouncedFetchNextPage = useDebouncedCallback(fetchNextPage, 100);
  const fetchMoreOnBottomReached = (tableWrapper: HTMLDivElement) => {
    const { scrollHeight, scrollTop, clientHeight } = tableWrapper;
    if (scrollHeight - scrollTop - clientHeight < 200 && !isFetching) {
      debouncedFetchNextPage();
    }
  };

  const tableWrapper = tableWrapperRef.current;
  if (tableWrapper) {
    document.addEventListener("refresh", () => {
      tableWrapper.scrollTop = 0;
    });

    const firstRow = tableWrapper.querySelector<HTMLElement>(
      "tbody tr:first-child"
    );
    if (firstRow != undefined) {
      const rowsHeightExceedPageHeight =
        tableSpans.length * firstRow.offsetHeight < tableWrapper.offsetHeight;
      if (rowsHeightExceedPageHeight && hasNextPage) {
        debouncedFetchNextPage();
      }
    }
  }
  useEffect(() => {
    tableWrapper?.addEventListener("scroll", () => {
      fetchMoreOnBottomReached(tableWrapper);
    });
  }, [fetchMoreOnBottomReached, tableWrapper]);

  const onClick = (row: Row<TableSpan>) => {
    !isLoading &&
      window.open(
        `${window.location.origin}/trace/${row.original.traceId}?spanId=${row.original.spanId}`
      );
  };

  return (
    <div style={styles.container}>
      {isRefetching && !isRefetching && <LinearProgress sx={styles.progress} />}
      <MaterialReactTable
        columns={columns}
        data={tableSpans}
        enablePagination={false}
        enableColumnActions={false}
        enableRowNumbers={false}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        manualFiltering
        manualSorting
        enableStickyHeader={true}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading spans",
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onSortingChange={setSorting}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          showAlertBanner: isError,
          sorting,
        }}
        virtualizerInstanceRef={virtualizerInstanceRef}
        muiTableContainerProps={{
          ref: tableWrapperRef,
          sx: styles.tableContainer,
        }}
        muiTablePaperProps={{ sx: styles.tablePaper }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => onClick(row),
          className: newSpansIds.includes(row.original.spanId)
            ? "MuiTableRow-grey"
            : "",
          sx: newSpansIds.includes(row.original.spanId)
            ? styles.newTableRow
            : null,
          key: row.original.spanId, // required for new spans animation
        })}
        initialState={{ density: "compact" }}
      />
    </div>
  );
}
