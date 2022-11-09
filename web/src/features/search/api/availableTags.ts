import { useInfiniteQuery } from "@tanstack/react-query";

import { availableTagsResponse } from "../types/availableTags";

/**
 * fetch available tags
 *
 */
export const fetchAvailableTags = (nextToken?: string) => {
  return Promise.reject<availableTagsResponse>("not implemented");
};

/**
 * react hook to fetch available tags
 *
 */
export const useAvailableTags = () => {
  return useInfiniteQuery({
    queryKey: ["availableTags"],
    queryFn: ({ pageParam }) => fetchAvailableTags(pageParam),
    getNextPageParam: (lastPage) => lastPage.metadata?.nextToken,
  });
};
