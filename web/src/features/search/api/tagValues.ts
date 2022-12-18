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

import { TimeFrameTypes } from "../components/TimeFrameSelector";
import { SearchFilter } from "../types/common";
import {
  TagValue,
  TagValuesRequest,
  TagValuesResponse,
} from "../types/tagValues";
import { calcTimeFrame } from "./utils";

type FetchTagValuesParams = {
  tag: string;
  timeframe?: TimeFrameTypes;
  filters?: SearchFilter[];
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
  timeframe,
  filters,
}: FetchTagValuesParams): Promise<TagValuesResponse> => {
  const currentDatetime = new Date();
  const tagValuesRequest: TagValuesRequest = {
    filters: filters || [],
    timeframe: timeframe
      ? calcTimeFrame(timeframe, currentDatetime)
      : undefined,
  };
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
  filters?: SearchFilter[],
  timeframe?: TimeFrameTypes
) => {
  return useQuery({
    queryKey: ["tagValues", tag, filters, timeframe],
    keepPreviousData: true,
    queryFn: ({ pageParam }) =>
      tag
        ? fetchTagValues({ tag, filters, timeframe, nextToken: pageParam })
        : Promise.resolve<TagValuesResponse>({ values: [] }),
    getNextPageParam: (lastPage) => lastPage.metadata?.nextToken || undefined,
  });
};

const mergeTagValues = (
  currentTagValues?: Array<TagValue>,
  allTagValues?: Array<TagValue>
) => {
  if (currentTagValues === undefined || allTagValues === undefined) {
    return undefined;
  }
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
  timeframe: TimeFrameTypes,
  filters: SearchFilter[]
) => {
  const {
    data: currentTagValues,
    isFetching: isFetchingCurrent,
    isError: isErrorCurrent,
  } = useTagValues(tag, filters, timeframe);
  const {
    data: allTagValues,
    isFetching: isFetchingAllValues,
    isError: isErrorAllValues,
  } = useTagValues(tag, []);
  // const currentTagValues = currentTagPages?.pages.flatMap((page) => page.values)
  // const allTagValues = allTagPages?.pages.flatMap((page) => page.values)
  return {
    isFetching: isFetchingAllValues || isFetchingCurrent,
    isError: isErrorAllValues || isErrorCurrent,
    data: mergeTagValues(
      currentTagValues?.values || [],
      allTagValues?.values || []
    ),
  };
};
