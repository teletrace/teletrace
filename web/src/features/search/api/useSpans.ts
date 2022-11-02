import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { axiosClient } from "@/libs/axios";
import { ExtractFnReturnType } from "@/libs/react-query";

import { InternalSpan } from "../types/InternalSpan";

export const getSpans = async (
  batchSize: number,
  start: string,
  key: string
): Promise<InternalSpan[]> => {
  return axiosClient.get("/span", {
    params: {
      batchSize: batchSize,
      start: start === null ? "" : start,
      key: key,
    },
  });
};

type QueryFnType = typeof getSpans;

type UseSpansOptions = {
  batchSize: number;
  key: string;
  globalFilter: string | undefined;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
};

export const useSpans = ({
  batchSize: batchSize,
  key,
  columnFilters,
  globalFilter,
  sorting,
}: UseSpansOptions) => {
  return useInfiniteQuery<ExtractFnReturnType<QueryFnType>>(
    ["spans", columnFilters, globalFilter, sorting],
    ({ pageParam = null }) => getSpans(batchSize, pageParam, key),
    {
      getNextPageParam: (lastPage) =>
        lastPage.length ? lastPage[lastPage.length - 1] : undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
};
