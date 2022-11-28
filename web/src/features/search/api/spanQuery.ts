import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";
import { queryClient } from "@/libs/react-query";

import { SearchRequest, SearchResponse } from "../types/spanQuery";

type FetchSpansParams = { searchRequest: SearchRequest; pageParam: string };

export const fetchSpans = ({
  searchRequest,
  pageParam,
}: FetchSpansParams): Promise<SearchResponse> => {
  searchRequest.metadata = { nextToken: pageParam };

  return axiosClient.post("/v1/search", searchRequest);
};

export const updateSpansQuery = async (searchRequest: SearchRequest) => {
  const res = await queryClient.fetchInfiniteQuery({
    queryKey: ["spans", searchRequest],
    queryFn: ({ pageParam }) => fetchSpans({ searchRequest, pageParam }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
  return {
    spans: res.pages?.flatMap((page) => page.spans) || [],
    isError: false,
    isFetching: false,
    isRefetching: false,
    isLoading: false,
  };
};

export const useSpansQuery = (searchRequest: SearchRequest) => {
  const res = useInfiniteQuery({
    queryKey: ["spans", searchRequest],
    keepPreviousData: true,
    queryFn: ({ pageParam }) => fetchSpans({ searchRequest, pageParam }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
  return {
    spans: res.data?.pages?.flatMap((page) => page.spans) || [],
    fetchNextPage: res.fetchNextPage,
    isError: res.isError,
    isFetching: res.isFetching,
    isRefetching: res.isRefetching,
    isLoading: res.isLoading,
  };
};
