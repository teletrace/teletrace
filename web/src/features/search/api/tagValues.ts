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
export const fetchTagValues = ({
  tag,
  tagValuesRequest,
}: FetchTagValuesParams): Promise<TagValuesResponse> => {
  return axiosClient.post(`/v1/tags/${tag}`, tagValuesRequest);
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

const queryFnBuilder = (
  tag: string,
  search: string,
  timeframe: Timeframe,
  filters: SearchFilter[]
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

  const queryFn = async () => {
    if (tag) {
      const currentTimeframeQuery = fetchTagValues({
        tag,
        tagValuesRequest: currentValuesRequest,
      });
      const allTimeQuery = fetchTagValues({
        tag,
        tagValuesRequest: allValuesRequest,
      });
      const data = await Promise.all([currentTimeframeQuery, allTimeQuery]);
      return mergeTagValues(data[0].values || [], data[1].values || []);
    }
    return [];
  };

  return queryFn;
};

export const useTagValuesWithAll = (
  tag: string,
  search: string,
  timeframe: Timeframe,
  filters: SearchFilter[],
  intervalInMilli?: number
) => {
  return useQuery({
    queryKey: [
      "tagValues",
      tag,
      timeframe?.startTimeUnixNanoSec,
      timeframe?.endTimeUnixNanoSec,
      filters,
      search,
    ],
    keepPreviousData: true,
    queryFn: queryFnBuilder(tag, search, timeframe, filters),
    refetchInterval: intervalInMilli || false,
  });
};
