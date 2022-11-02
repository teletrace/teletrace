import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_ColumnDef as ColumnDef,
  MRT_ShowHideColumnsButton as ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton as ToggleDensePaddingButton,
  Virtualizer,
} from "material-react-table";
import { UIEvent, useCallback, useEffect, useRef, useState } from "react";

import { useSpans } from "../../api/useSpans";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./styles";

const FETCH_KEY = "spanId";
const FETCH_BATCH_SIZE = 50;

interface TableSpan {
  id: string;
  traceId: string;
  spanId: string;
  startTime: string;
  duration: string;
  name: string;
  status: string;
  serviceName: string;
}

export function SpanTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const virtualizerInstanceRef = useRef<Virtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<TableSpan>[] = [
    {
      accessorKey: "startTime",
      header: "Start Time",
      enableSorting: false,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Resource name",
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      Cell: (mrtCell) => {
        const code = mrtCell.cell.getValue();
        return (
          <StatusBadge
            color={Number(code) === 2 ? "error" : "success"}
            text={Number(code) === 2 ? "Error" : "Ok"}
          />
        );
      },
    },
    {
      accessorKey: "serviceName",
      header: "Service Name",
      enableSorting: false,
    },
  ];

  const { data, fetchNextPage, isError, isFetching, isLoading } = useSpans({
    batchSize: FETCH_BATCH_SIZE,
    key: FETCH_KEY,
    columnFilters: columnFilters,
    globalFilter: globalFilter,
    sorting: sorting,
  });

  const flatData = data?.pages?.flat() ?? [];
  const tableSpans = flatData.map(({ resource, span }): TableSpan => {
    return {
      id: span.spanId,
      traceId: span.traceId,
      spanId: span.spanId,
      startTime: new Date(span.startTimeUnixNano).toLocaleTimeString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      duration: `${span.endTimeUnixNano - span.startTimeUnixNano} ms`,
      name: span.name,
      status: span.status.code === 0 ? "Ok" : "Error",
      serviceName:
        typeof resource.attributes["service.name"] === "string"
          ? resource.attributes["service.name"]
          : "service unknown",
    } as TableSpan;
  });

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
