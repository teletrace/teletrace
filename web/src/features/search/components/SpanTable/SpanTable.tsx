import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  Virtualizer,
} from "material-react-table";
import {
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { fetchSpans } from "@/features/search/api/spans";

import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./styles";

const SPANS_QUERY_KEY = "spans";
const FETCH_KEY = " spanId";
const FETCH_BATCH_SIZE = 50;

class TableSpan {
  constructor(
    public id: string,
    public traceId: string,
    public spanId: string,
    public startTime: string,
    public duration: string,
    public name: string,
    public status: string,
    public serviceName: string
  ) {}
}

export function SpanTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const virtualizerInstanceRef = useRef<Virtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: MRT_ColumnDef<TableSpan>[] = [
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

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery<TableSpan[]>(
      [SPANS_QUERY_KEY, columnFilters, globalFilter, sorting],
      ({ pageParam = null }) => {
        return fetchSpans(FETCH_BATCH_SIZE, pageParam, FETCH_KEY).then(
          (internalSpans) =>
            internalSpans.map(({ resource, span }) => {
              return new TableSpan(
                span.spanId,
                span.traceId,
                span.spanId,
                new Date(span.startTimeUnixNano).toLocaleTimeString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                `${span.endTimeUnixNano - span.startTimeUnixNano} ms`,
                span.name,
                span.status.code === 0 ? "Ok" : "Error",
                typeof resource.attributes["service.name"] === "string"
                  ? resource.attributes["service.name"]
                  : "service unknown"
              );
            })
        );
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage.length ? lastPage[lastPage.length - 1] : undefined,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page) ?? [],
    [data]
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
      data={flatData}
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
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
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
        sx: () => ({
          "& tr:nth-of-type(odd)": styles.header,
        }),
      }}
    />
  );
}
