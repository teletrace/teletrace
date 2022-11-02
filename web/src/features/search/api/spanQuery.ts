import { SearchRequest, SearchResponse } from "@/types/spans/spanQuery";
import { useInfiniteQuery } from "@tanstack/react-query";


type FetchSpansParams = { pageParam: string; searchRequest: SearchRequest };

export const fetchSpans = ({ pageParam, searchRequest }: FetchSpansParams) => {
  searchRequest.metadata = { nextToken: pageParam };
  return Promise.reject<SearchResponse>("not implemented");
};

export const useSpansQuery = (searchRequest: SearchRequest) => {
  return useInfiniteQuery({
    queryKey: ["spans", searchRequest],
    queryFn: ({ pageParam }) => fetchSpans({ pageParam, searchRequest }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
};
