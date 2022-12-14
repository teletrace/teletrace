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

import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";

import { TimeFrameTypes } from "../components/TimeFrameSelector";
import { SearchFilter } from "../types/common";
import { SearchRequest, SearchResponse, Sort } from "../types/spanQuery";
import { calcTimeFrame } from "./utils";

type FetchSpansParams = { searchRequest: SearchRequest; pageParam: string };
type UseSpansQueryParams = {
  timeframe: TimeFrameTypes;
  filters?: SearchFilter[];
  sort?: Sort[];
  metadata?: { nextToken: string };
  updateIntervalMilli?: number;
};

export const fetchSpans = ({
  searchRequest,
  pageParam,
}: FetchSpansParams): Promise<SearchResponse> => {
  searchRequest.metadata = { nextToken: pageParam };

  return axiosClient.post("/v1/search", searchRequest);
};

export const useSpansQuery = ({
  timeframe,
  filters,
  sort,
  metadata,
  updateIntervalMilli,
}: UseSpansQueryParams) => {
  const refetchInterval =
    updateIntervalMilli && updateIntervalMilli > 0
      ? updateIntervalMilli
      : false;

  const tf = calcTimeFrame(timeframe);

  const searchRequest = {
    filters: filters,
    timeframe: tf,
    sort: sort,
    metadata: metadata,
  };

  return useInfiniteQuery({
    queryKey: [
      "spans",
      filters,
      tf.startTimeUnixNanoSec,
      tf.endTimeUnixNanoSec,
    ],
    keepPreviousData: true,
    queryFn: ({ pageParam }) => fetchSpans({ searchRequest, pageParam }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
    refetchInterval: refetchInterval,
    cacheTime: refetchInterval ? refetchInterval : 5000,
  });
};
