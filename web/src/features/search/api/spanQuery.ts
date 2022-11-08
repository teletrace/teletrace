import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";

import { SearchRequest, SearchResponse } from "../types/spanQuery";

type FetchSpansParams = { pageParam: string; searchRequest: SearchRequest };

export const fetchSpans = ({
  pageParam,
  searchRequest,
}: FetchSpansParams): Promise<SearchResponse> => {
  searchRequest.metadata = { nextToken: pageParam };
  return axiosClient.post("/v1/search", searchRequest);
};

export const useSpansQuery = (searchRequest: SearchRequest) => {
  return useInfiniteQuery({
    queryKey: ["spans", searchRequest],
    queryFn: ({ pageParam }) => fetchSpans({ pageParam, searchRequest }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
};
