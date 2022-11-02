import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton as ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton as ToggleDensePaddingButton,
  Virtualizer,
} from "material-react-table";
import { UIEvent, useCallback, useEffect, useRef, useState } from "react";

import { useSpansQuery } from "../../api/spanQuery";
import { SearchFilter, Timeframe } from "../../types/spanQuery";
import { TableSpan, columns } from "./columns";
import styles from "./styles";

const DEFAULT_SORT_FIELD = "startTime";

interface SpanTableProps {
  filters?: SearchFilter[];
  timeframe: Timeframe;
}

export function SpanTable({ filters = [], timeframe }: SpanTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const virtualizerInstanceRef = useRef<Virtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnSort = sorting.find(
    (coulmnSort) => coulmnSort.id === DEFAULT_SORT_FIELD
  );
  const { data, fetchNextPage, isError, isFetching, isLoading } = useSpansQuery(
    {
      filters: filters,
      timeframe: timeframe,
      sort:
        columnSort === undefined
          ? undefined
          : { field: columnSort.id, ascending: !columnSort.desc },
      metadata: undefined,
    }
  );

  const flatData = data?.pages?.flat() ?? [];
  const tableSpans = flatData.flatMap(({ spans }) =>
    spans.map(({ resource, span }): TableSpan => {
      return {
        id: span.spanId,
        traceId: span.traceId,
        spanId: span.spanId,
        startTime: new Date(span.startTime).toLocaleTimeString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        duration: `${span.endTime - span.startTime} ms`,
        name: span.name,
        status: span.status.code === 0 ? "Ok" : "Error",
        serviceName:
          typeof resource.attributes["service.name"] === "string"
            ? resource.attributes["service.name"]
            : "service unknown",
      } as TableSpan;
    })
  );

  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 200 && !isFetching) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched]
  );

  useEffect(() => {
    if (virtualizerInstanceRef.current) {
      virtualizerInstanceRef.current.scrollToIndex(0);
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <MaterialReactTable
      columns={columns}
      data={tableSpans}
      enablePagination={false}
      enableRowNumbers={false}
      enableRowVirtualization
      enableTopToolbar={false}
      enableColumnActions={false}
      enableBottomToolbar={false}
      manualFiltering
      manualSorting
      enableColumnResizing
      renderToolbarInternalActions={({ table }) => (
        <>
          <ToggleDensePaddingButton table={table} />
          <ShowHideColumnsButton table={table} />
        </>
      )}
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: styles.container,
        onScroll: (event: UIEvent<HTMLDivElement>) =>
          fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
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
        sx: () => styles.header,
      }}
    />
  );
}
