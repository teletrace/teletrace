import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton as ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton as ToggleDensePaddingButton,
  Virtualizer,
} from "material-react-table";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatDateToTimeString } from "@/utils/format";

import { useSpansQuery } from "../../api/spanQuery";
import { SearchFilter, Timeframe } from "../../types/common";
import { TableSpan, columns } from "./columns";
import { LiveSpansState } from "./../../routes/SpanSearch";
import styles from "./styles";
import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { InternalSpan } from "@/types/span";

const DEFAULT_SORT_FIELD = "startTime";

interface SpanTableProps {
  filters?: SearchFilter[];
  timeframe: Timeframe;
  liveSpans: LiveSpansState;
}

interface FetchSpansResult {
  spans: InternalSpan[];
  fetchNextPage: Function;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
}

export function SpanTable({
  filters = [],
  timeframe,
  liveSpans,
}: SpanTableProps) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const virtualizerInstanceRef = useRef<Virtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [spansState, setSpansState] = useState<FetchSpansResult>({
    spans: [],
    fetchNextPage: () => null,
    isError: false,
    isFetching: false,
    isLoading: false,
  });

  const columnSort = sorting.find(
    (columnSort) => columnSort.id === DEFAULT_SORT_FIELD
  );

  const searchRequest = {
    filters: filters,
    timeframe: timeframe,
    sort:
      columnSort === undefined
        ? undefined
        : { field: columnSort.id, ascending: !columnSort.desc },
    metadata: undefined,
  };

  useEffect(() => {
    if (liveSpans.isOn) {
      const intervalId = setInterval(() => {
        console.log("fetching query with interval");
        const { data, fetchNextPage, isError, isFetching, isLoading } =
          useSpansQuery(searchRequest);
        setSpansState({
          spans: data?.pages?.flatMap((page) => page.spans) || [],
          fetchNextPage: fetchNextPage,
          isError: isError,
          isFetching: isFetching,
          isLoading: isLoading,
        });
      }, liveSpans.interval * 1000);
      return () => clearInterval(intervalId);
    }
  });

  const spansQueryResult = useSpansQuery(searchRequest);
  useEffect(() => {
    setSpansState({
      spans: spansQueryResult.data?.pages?.flatMap((page) => page.spans) || [],
      fetchNextPage: spansQueryResult.fetchNextPage,
      isError: spansQueryResult.isError,
      isFetching: spansQueryResult.isFetching,
      isLoading: spansQueryResult.isLoading,
    });
  }, [setSpansState]);

  const { spans, fetchNextPage, isError, isFetching, isLoading } = spansState;
  //const { data, fetchNextPage, isError, isFetching, isLoading } = useSpansQuery(searchRequest);
  //const spans = data?.pages?.flatMap((page) => page.spans) || []

  const tableSpans =
    spans?.flatMap(
      ({ resource, span, externalFields }): TableSpan => ({
        id: span.spanId,
        traceId: span.traceId,
        spanId: span.spanId,
        startTime: formatDateToTimeString(
          span.startTimeUnixNano / (1000 * 1000)
        ),
        duration: `${externalFields.durationNano / (1000 * 1000)} ms`,
        name: span.name,
        status: span.status.code,
        serviceName:
          resource.attributes?.["service.name"] !== undefined &&
          typeof resource.attributes?.["service.name"] === "string"
            ? resource.attributes["service.name"]
            : "service unknown",
      })
    ) ?? [];

  const fetchMoreOnBottomReached = (tableWrapper: HTMLDivElement) => {
    const { scrollHeight, scrollTop, clientHeight } = tableWrapper;
    if (scrollHeight - scrollTop - clientHeight < 200 && !isFetching) {
      fetchNextPage();
    }
  };

  const tableWrapper = tableWrapperRef.current;
  useEffect(() => {
    tableWrapper?.addEventListener("scroll", () => {
      fetchMoreOnBottomReached(tableWrapper);
    });
  }, [fetchMoreOnBottomReached, tableWrapper]);

  return (
    <MaterialReactTable
      columns={columns}
      data={tableSpans}
      enablePagination={false}
      enableRowNumbers={false}
      enableTopToolbar={false}
      enableColumnActions={false}
      enableBottomToolbar={false}
      manualFiltering
      manualSorting
      enableStickyHeader={true}
      enableColumnResizing
      renderToolbarInternalActions={({ table }) => (
        <>
          <ToggleDensePaddingButton table={table} />
          <ShowHideColumnsButton table={table} />
        </>
      )}
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
        showProgressBars: isFetching,
        sorting,
      }}
      virtualizerInstanceRef={virtualizerInstanceRef}
      muiTableHeadProps={{
        sx: styles.header,
      }}
      muiTableContainerProps={{
        ref: tableWrapperRef,
        sx: styles.container,
      }}
      muiTablePaperProps={{ sx: styles.paper }}
    />
  );
}
