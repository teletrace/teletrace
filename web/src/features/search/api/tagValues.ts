import { useInfiniteQuery } from "@tanstack/react-query";

import { SearchRequest } from "../types/spanQuery";
import { TagValuesResponse } from "../types/tagValues";

/**
 * fetch tag values
 *
 * @param tag             the tag to fetch values for
 * @param searchRequest   optional search request to narrow down options
 * @param nextToken       pagination token
 */
export const fetchTagValues = (
  tag: string,
  searchRequest?: SearchRequest,
  nextToken?: string
) => {
  console.log({ tag, searchRequest, nextToken });
  return Promise.reject<TagValuesResponse>("not implemented");
};

/**
 * react hook to fetch tag values
 *
 * @param tag            the tag to fetch values for
 * @param searchRequest  optional query to filter results by
 */
export const useTagValues = (tag: string, searchRequest?: SearchRequest) => {
  return useInfiniteQuery({
    queryKey: ["tagValues", tag, searchRequest],
    queryFn: ({ pageParam }) => fetchTagValues(tag, searchRequest, pageParam),
    getNextPageParam: (lastPage) => lastPage.metadata?.nextToken,
  });
};
