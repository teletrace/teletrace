import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { axiosClient } from "@/libs/axios";
import { ExtractFnReturnType } from "@/libs/react-query";

import { InternalSpan } from "../types/InternalSpan";

const SPANS_QUERY_KEY = "spans";

export const getSpans = async (
  amt: number,
  start: string,
  key: string
): Promise<InternalSpan[]> => {
  return axiosClient.get("/span", {
    params: {
      amt: amt,
      start: start === null ? "" : start,
      key: key,
    },
  });
};

type QueryFnType = typeof getSpans;

type UseSpansOptions = {
  amt: number;
  key: string;
  globalFilter: string | undefined;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
};

export const useSpans = ({
  amt,
  key,
  columnFilters,
  globalFilter,
  sorting,
}: UseSpansOptions) => {
  return useInfiniteQuery<ExtractFnReturnType<QueryFnType>>(
    [SPANS_QUERY_KEY, columnFilters, globalFilter, sorting],
    ({ pageParam = null }) => getSpans(amt, pageParam, key),
    {
      getNextPageParam: (lastPage) =>
        lastPage.length ? lastPage[lastPage.length - 1] : undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
};
