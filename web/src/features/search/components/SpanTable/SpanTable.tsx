import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton as ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton as ToggleDensePaddingButton,
  Virtualizer,
} from "material-react-table";
import { useEffect, useRef, useState } from "react";

import { formatDateToTimeString } from "@/utils/format";

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
  const tableWrapperRef = useRef<HTMLDivElement>(null);
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

  const tableSpans =
    data?.pages?.flatMap((page) =>
      page.spans.flatMap(
        ({ resource, span, externalFields }): TableSpan => ({
          id: span.spanId,
          traceId: span.traceId,
          spanId: span.spanId,
          startTime: formatDateToTimeString(span.startTimeUnixNano),
          duration: `ms ${externalFields.duration}`,
          name: span.name,
          status: span.status.code === 0 ? "Ok" : "Error",
          serviceName: 
            (resource.attributes?.["service.name"] !== undefined && typeof resource.attributes?.["service.name"] === "string")
              ? resource.attributes["service.name"]           
              : "service unknown"
        })
      )
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
    <div ref={tableWrapperRef} style={{ overflowY: "auto" }}>
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
    </div>
  );
}
