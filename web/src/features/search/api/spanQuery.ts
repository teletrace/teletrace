/**
 * Copyright 2022 Epsagon
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
import { queryClient } from "@/libs/react-query";
import { getCurrentTimestamp } from "@/utils/format";

import { SearchRequest, SearchResponse } from "../types/spanQuery";

type FetchSpansParams = { searchRequest: SearchRequest; pageParam: string };

export const fetchSpans = ({
  searchRequest,
  pageParam,
}: FetchSpansParams): Promise<SearchResponse> => {
  searchRequest.metadata = { nextToken: pageParam };

  return axiosClient.post("/v1/search", searchRequest);
};

export const updateSpansQuery = async (
  searchRequest: SearchRequest,
  updateInterval = 5000
) => {
  searchRequest.timeframe = getCurrentTimestamp();
  const res = await queryClient.fetchInfiniteQuery({
    queryKey: ["spans", searchRequest],
    queryFn: ({ pageParam }) => fetchSpans({ searchRequest, pageParam }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
    cacheTime: updateInterval,
  });
  return {
    spans: res.pages?.flatMap((page) => page.spans) || [],
    isError: false,
    isFetching: false,
    isRefetching: false,
    isLoading: false,
  };
};

export const useSpansQuery = (searchRequest: SearchRequest) => {
  const res = useInfiniteQuery({
    queryKey: ["spans", searchRequest],
    keepPreviousData: true,
    queryFn: ({ pageParam }) => fetchSpans({ searchRequest, pageParam }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
  return {
    spans: res.data?.pages?.flatMap((page) => page.spans) || [],
    fetchNextPage: res.fetchNextPage,
    isError: res.isError,
    isFetching: res.isFetching,
    isRefetching: res.isRefetching,
    isLoading: res.isLoading,
  };
};
