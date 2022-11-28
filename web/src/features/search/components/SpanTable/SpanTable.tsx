import { LinearProgress } from "@mui/material";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, {
  MRT_Row as Row,
  Virtualizer,
} from "material-react-table";
import { useEffect, useRef, useState } from "react";

import {
  formatDateAsDateTime,
  nanoSecToMs,
  roundNanoToTwoDecimalMs,
} from "@/utils/format";

import { useSpansQuery } from "../../api/spanQuery";
import { SearchFilter, Timeframe } from "../../types/common";
import { TableSpan, columns } from "./columns";
import styles from "./styles";

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

  const searchRequest = {
    filters: filters,
    timeframe: timeframe,
    sort: sorting?.map((columnSort) => ({
      field: columnSort.id,
      ascending: !columnSort.desc,
    })),
    metadata: undefined,
  };

  const { data, fetchNextPage, isError, isRefetching, isFetching, isLoading } =
    useSpansQuery(searchRequest);

  const tableSpans =
    data?.pages?.flatMap((page) =>
      page.spans.flatMap(
        ({ resource, span, externalFields }): TableSpan => ({
          id: span.spanId,
          traceId: span.traceId,
          spanId: span.spanId,
          startTime: formatDateAsDateTime(nanoSecToMs(span.startTimeUnixNano)),
          duration: `${roundNanoToTwoDecimalMs(externalFields.durationNano)}ms`,
          name: span.name,
          status: span.status.code,
          serviceName:
            resource.attributes?.["service.name"] !== undefined &&
            typeof resource.attributes?.["service.name"] === "string"
              ? resource.attributes["service.name"]
              : "service unknown",
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

  const onClick = (row: Row<TableSpan>) => {
    window.open(`${window.location.origin}/trace/${row.original.traceId}`);
  };

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
        manualFiltering
        manualSorting
        enableStickyHeader={true}
        enableColumnResizing
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
        muiTableBodyRowProps={({ row }) => ({ onClick: () => onClick(row) })}
      />
    </div>
  );
}
