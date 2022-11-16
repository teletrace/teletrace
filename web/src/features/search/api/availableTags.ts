import { useInfiniteQuery } from "@tanstack/react-query";

import { AvailableTagsResponse } from "../types/availableTags";

/**
 * fetch available tags
 */
/* eslint-disable */
export const fetchAvailableTags = (nextToken?: string) => {
  // TODO: remove es-lint disabled once nextToken is used
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
