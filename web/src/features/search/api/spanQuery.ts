import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

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

// export const querySpans = (searchRequest: SearchRequest, liveSpans: LiveSpansState) => {
//   let intervalId: ReturnType<typeof setInterval> | undefined;
//
//   if (liveSpans.isOn) {
//     intervalId = setInterval(() => {
//       console.log("fetching query interval")
//       return useSpansQuery(searchRequest);
//     }, liveSpans.interval * 1000);
//
//   } else {
//     if (intervalId) {
//       clearInterval(intervalId);
//     }
//     console.log("fetching query once")
//     return useSpansQuery(searchRequest);
//   };
// }
