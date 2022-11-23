import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";

import { TagValuesRequest, TagValuesResponse } from "../types/tagValues";

type FetchTagValuesParams = {
  tag: string;
  tagValuesRequest: TagValuesRequest;
  nextToken: string;
};

/**
 * fetch tag values
 *
 * @param tag             the tag to fetch values for
 * @param tagValuesRequest   optional search request to narrow down options
 * @param nextToken       pagination token
 */
export const fetchTagValues = ({
  tag,
  tagValuesRequest,
  nextToken,
}: FetchTagValuesParams): Promise<TagValuesResponse> => {
  tagValuesRequest.metadata = { nextToken: nextToken };
  return axiosClient.post(`/v1/tags/${tag}`, tagValuesRequest);
};

/**
 * react hook to fetch tag values
 *
 * @param tag            the tag to fetch values for
 * @param tagValuesRequest  optional query to filter results by
 */
export const useTagValues = (
  tag: string,
  tagValuesRequest: TagValuesRequest
) => {
  return useInfiniteQuery({
    queryKey: [
      "tagValues",
      tag,
      tagValuesRequest.timeframe.startTimeUnixNanoSec,
      tagValuesRequest.timeframe.endTimeUnixNanoSec,
      tagValuesRequest.filters,
    ],
    queryFn: ({ pageParam }) =>
      fetchTagValues({ tag, tagValuesRequest, nextToken: pageParam }),
    getNextPageParam: (lastPage) => lastPage.metadata?.nextToken,
  });
};
