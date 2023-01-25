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

import { LinearProgress, Stack, Typography } from "@mui/material";
import {
  ColumnFiltersState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import type { Virtualizer } from "@tanstack/react-virtual";
import MaterialReactTable, { MRT_Row as Row } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { formatNanoAsMsDateTime } from "@/utils/format";

import { useSpansQuery } from "../../api/spanQuery";
import { useSpanSearchStore } from "../../stores/spanSearchStore";
import { TableSpan, columns, sizeLimitedColumns } from "./columns";
import { ReactComponent as NoResultsFoundIcon } from "./no_results_found.svg";
import styles from "./styles";
import { calcNewSpans } from "./utils";

export function SpanTable() {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const virtualizerInstanceRef =
    useRef<Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [tableSpans, setTableSpans] = useState<TableSpan[]>([]);
  const liveSpansState = useSpanSearchStore((state) => state.liveSpansState);
  const timeframeState = useSpanSearchStore((state) => state.timeframeState);
  const filtersState = useSpanSearchStore((state) => state.filtersState);
  const sortState = useSpanSearchStore((state) => state.sortState);

  const searchRequest = useMemo(
    () => ({
      filters: filtersState.filters,
      timeframe: {
        startTimeUnixNanoSec:
          timeframeState.currentTimeframe.startTimeUnixNanoSec,
        endTimeUnixNanoSec: timeframeState.currentTimeframe.endTimeUnixNanoSec,
      },
      sort: sortState.sort,
      metadata: undefined,
    }),
    [filtersState.filters, timeframeState, sortState.sort]
  );

  useEffect(() => {
    virtualizerInstanceRef.current?.scrollToIndex(0);
  }, [filtersState.filters, timeframeState, sortState.sort]);

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
    liveSpansState.isOn ? liveSpansState.intervalInMillis : 0
  );

  useEffect(() => {
    setTableSpans((prevTableSpans) => {
      const newSpans = data?.pages?.flatMap((page) => page.spans) || [];
      const newSpansIds = calcNewSpans(
        prevTableSpans,
        newSpans,
        liveSpansState.isOn
      );

      return (
        newSpans?.flatMap(
          ({ resource, span, externalFields }): TableSpan => ({
            id: span.spanId,
            traceId: span.traceId,
            spanId: span.spanId,
            startTime: formatNanoAsMsDateTime(span.startTimeUnixNano),
            duration: externalFields.durationNano,
            name: span.name,
            status: span.status.code,
            serviceName:
              resource.attributes?.["service.name"] !== undefined &&
              typeof resource.attributes?.["service.name"] === "string"
                ? resource.attributes["service.name"]
                : "service unknown",
            isNew: newSpansIds.has(span.spanId),
          })
        ) ?? []
      );
    });
  }, [data, liveSpansState.isOn]);
  const debouncedFetchNextPage = useDebouncedCallback(fetchNextPage, 100);
  const fetchMoreOnBottomReached = (tableWrapper: HTMLDivElement) => {
    const { scrollHeight, scrollTop, clientHeight } = tableWrapper;
    if (scrollHeight - scrollTop - clientHeight < 400 && !isFetching) {
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

  const sortingState = sortState.sort.map((sort) => ({
    id: sort.field,
    desc: !sort.ascending,
  }));

  const updateSortingState = (updater: Updater<SortingState>) =>
    typeof updater === "function" &&
    sortState.setSort(
      updater(sortingState)?.map((columnSort) => ({
        field: columnSort.id,
        ascending: !columnSort.desc,
      }))
    );

  const emptyState = (
    <tr>
      <td style={styles.emptyStateStack}>
        <NoResultsFoundIcon style={styles.empyStateIcon} />
        <Typography style={styles.emptyStateFirstMesssage} variant="subtitle1">
          No matching spans found
        </Typography>
        <Typography style={styles.emptyStateSecondMessage} variant="body1">
          Expand the time range or adjust your filters
        </Typography>
      </td>
    </tr>
  );

  return (
    <div style={styles.container}>
      {isRefetching && <LinearProgress sx={styles.progress} />}
      <MaterialReactTable
        columns={columns}
        data={tableSpans}
        enablePagination={false}
        enableColumnActions={false}
        enableRowNumbers={false}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        enableSortingRemoval={false}
        manualFiltering
        manualSorting
        enableStickyHeader={true}
        enableRowVirtualization
        rowVirtualizerProps={{ overscan: 8 }}
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
        onSortingChange={updateSortingState}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          showAlertBanner: isError,
          sorting: sortingState,
        }}
        rowVirtualizerInstanceRef={virtualizerInstanceRef}
        muiTableContainerProps={{
          ref: tableWrapperRef,
          sx: styles.tableContainer,
        }}
        muiTablePaperProps={{ sx: styles.tablePaper }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => onClick(row),
          className: row.original.isNew ? "MuiTableRow-grey" : "",
          sx: row.original.isNew ? styles.newTableRow : null,
          key: row.original.spanId, // required for new spans animation
        })}
        muiTableBodyCellProps={({ column }) =>
          sizeLimitedColumns.has(column.columnDef.id)
            ? { sx: { maxWidth: column.columnDef.maxSize } }
            : {}
        }
        muiTableHeadCellProps={({ column }) =>
          sizeLimitedColumns.has(column.columnDef.id)
            ? { sx: { maxWidth: column.columnDef.maxSize } }
            : {}
        }
        getRowId={(originalRow) => originalRow.spanId}
        initialState={{ density: "compact" }}
        muiTableBodyProps={
          tableSpans?.length === 0 && !isLoading
            ? { children: emptyState, sx: { height: "unset" } }
            : undefined
        }
      />
    </div>
  );
}
