import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";

import { AvailableTagsResponse } from "../types/availableTags";

/**
 * fetch available tags
 */

//  export const fetchSpans = ({
//   pageParam,
//   searchRequest,
// }: FetchSpansParams): Promise<SearchResponse> => {

// type FetchAvailableTagsParams = { pageParam: string};

export const fetchAvailableTags = (): Promise<AvailableTagsResponse> => {
  // const availableTagsRequest: AvailableTagsRequest = {metadata: {nextToken: nextToken}}
  return axiosClient.get("/v1/tags");
};

/**
 * react hook to fetch available tags
 */
export const useAvailableTags = () => {
  return useInfiniteQuery({
    queryKey: ["availableTags"],
    queryFn: () => fetchAvailableTags(),
    getNextPageParam: () => undefined,
  });
};
