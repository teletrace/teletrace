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

type FetchSpansParams = {
  pageParam: string;
  timeframe: TimeFrameTypes;
  filters?: SearchFilter[];
  sort?: Sort[];
  metadata?: { nextToken: string };
};
type UseSpansQueryParams = {
  timeframe: TimeFrameTypes;
  filters?: SearchFilter[];
  sort?: Sort[];
  metadata?: { nextToken: string };
  updateIntervalMilli?: number;
};

export const fetchSpans = ({
  pageParam,
  timeframe,
  filters,
  sort,
}: FetchSpansParams): Promise<SearchResponse> => {
  const currentDatetime = new Date();
  const searchRequest: SearchRequest = {
    filters: filters,
    sort: sort,
    metadata: { nextToken: pageParam },
    timeframe: calcTimeFrame(timeframe, currentDatetime),
  };

  return axiosClient.post("/v1/search", searchRequest);
};

export const useSpansQuery = ({
  timeframe,
  filters,
  sort,
  updateIntervalMilli,
}: UseSpansQueryParams) => {
  const refetchInterval =
    updateIntervalMilli && updateIntervalMilli > 0
      ? updateIntervalMilli
      : false;

  return useInfiniteQuery({
    queryKey: ["spans", filters, timeframe],
    keepPreviousData: true,
    queryFn: ({ pageParam }) =>
      fetchSpans({ pageParam, timeframe, filters, sort }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
    refetchInterval: refetchInterval,
  });
};
