import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton as ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton as ToggleDensePaddingButton,
  Virtualizer,
} from "material-react-table";
import { UIEvent, useRef, useState } from "react";

import { SearchFilter, Timeframe } from "@/types/spans/spanQuery";

import { useSpansQuery } from "../../api/spanQuery";
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

  const searchRequest = {
    filters: filters,
    timeframe: timeframe,
    sort:
      columnSort === undefined
        ? undefined
        : { field: columnSort.id, ascending: !columnSort.desc },
    metadata: undefined,
  };
  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useSpansQuery(searchRequest);

  const fetchMoreOnBottomReached = (
    containerRefElement?: HTMLDivElement | null
  ) => {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
      if (scrollHeight - scrollTop - clientHeight < 200 && !isFetching) {
        fetchNextPage();
      }
    }
  };

  const tableSpans =
    data?.pages?.flatMap((page) =>
      page.spans.flatMap(({ resource, span, externalFields }): TableSpan => {
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
          duration: `ms ${externalFields.duration}`,
          name: span.name,
          status: span.status.code === 0 ? "Ok" : "Error",
          serviceName:
            typeof resource.attributes["service.name"] === "string"
              ? resource.attributes["service.name"]
              : "service unknown",
        };
      })
    ) ?? [];

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
        sx: styles.header,
      }}
    />
  );
}
