/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";

import { SearchFilter, Timeframe } from "../types/common";
import {
  TagValue,
  TagValuesRequest,
  TagValuesResponse,
} from "../types/tagValues";

type FetchTagValuesParams = {
  tag: string;
  tagValuesRequest: TagValuesRequest;
};

/**
 * fetch tag values
 *
 * @param tag             the tag to fetch values for
 * @param tagValuesRequest   optional search request to narrow down options
 * @param nextToken       pagination token
 */
export const fetchTagValues = async ({
  tag,
  tagValuesRequest,
}: FetchTagValuesParams): Promise<TagValuesResponse> => {
  if (!tagValuesRequest.timeframe) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
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
  tagValuesRequest: TagValuesRequest,
  intervalInMilli?: number
) => {
  return useQuery({
    queryKey: [
      "tagValues",
      tag,
      tagValuesRequest.timeframe?.startTimeUnixNanoSec,
      tagValuesRequest.timeframe?.endTimeUnixNanoSec,
      tagValuesRequest.filters,
    ],
    keepPreviousData: true,
    queryFn: () =>
      tag
        ? fetchTagValues({
            tag,
            tagValuesRequest,
          })
        : Promise.resolve<TagValuesResponse>({ values: [] }),
    getNextPageParam: (lastPage) => lastPage.metadata?.nextToken || undefined,
    refetchInterval: intervalInMilli || false,
  });
};

const mergeTagValues = (
  currentTagValues: Array<TagValue>,
  allTagValues: Array<TagValue>
) => {
  const tagValuesMap: Record<string, TagValue> = {};
  for (const { value } of allTagValues) {
    tagValuesMap[value] = { value: value, count: 0 };
  }
  for (const { value, count } of currentTagValues) {
    tagValuesMap[value] = { value: value, count: count };
  }

  return Object.values(tagValuesMap).sort((tagA, tagB) => {
    if (tagB.count === tagA.count) {
      return tagA.value >= tagB.value ? 1 : -1;
    }
    return tagB.count - tagA.count;
  });
};

export const useTagValuesWithAll = (
  tag: string,
  search: string,
  timeframe: Timeframe,
  filters: SearchFilter[],
  intervalInMilli?: number
) => {
  const searchFilter: SearchFilter | undefined = search
    ? { keyValueFilter: { key: tag, operator: "contains", value: search } }
    : undefined;
  const currentValuesRequest: TagValuesRequest = {
    filters: searchFilter ? [...filters, searchFilter] : filters,
    timeframe: timeframe,
  };
  const allValuesRequest: TagValuesRequest = {
    filters: searchFilter ? [searchFilter] : [],
  };
  const {
    data: currentTagValues,
    isFetching: isFetchingCurrent,
    isError: isErrorCurrent,
    isLoading: isLoadingCurrent,
  } = useTagValues(tag, currentValuesRequest, intervalInMilli);
  const {
    data: allTagValues,
    isFetching: isFetchingAllValues,
    isError: isErrorAllValues,
    isLoading: isLoadingAllValues,
  } = useTagValues(tag, allValuesRequest, intervalInMilli);

  const resultData =
    currentTagValues === undefined || allTagValues === undefined
      ? undefined
      : mergeTagValues(
          currentTagValues.values || [],
          allTagValues.values || []
        );
  return {
    isFetching: isFetchingAllValues || isFetchingCurrent,
    isLoading: isLoadingAllValues || isLoadingCurrent,
    isError: isErrorAllValues || isErrorCurrent,
    data: resultData,
  };
};
