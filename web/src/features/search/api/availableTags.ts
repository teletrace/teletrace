import { useInfiniteQuery } from "@tanstack/react-query";

import { AvailableTagsResponse } from "../types/availableTags";

/**
 * fetch available tags
 */
export const fetchAvailableTags = (_nextToken?: string) => {
  // TODO: lint fails on 'nextToken' since it is currently not used, underscore temporarilt solves it
  return Promise.reject<AvailableTagsResponse>("not implemented");
};

/**
 * react hook to fetch available tags
 */
export const useAvailableTags = () => {
  return useInfiniteQuery({
    queryKey: ["availableTags"],
    queryFn: ({ pageParam }) => fetchAvailableTags(pageParam),
    getNextPageParam: (lastPage) => lastPage.metadata?.nextToken,
  });
};
