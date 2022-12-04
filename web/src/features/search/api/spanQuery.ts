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

import { SearchRequest, SearchResponse } from "../types/spanQuery";

type FetchSpansParams = { pageParam: string; searchRequest: SearchRequest };

export const fetchSpans = ({
  pageParam,
  searchRequest,
}: FetchSpansParams): Promise<SearchResponse> => {
  searchRequest.metadata = { nextToken: pageParam };
  return axiosClient.post("/v1/search", searchRequest);
};

export const useSpansQuery = (searchRequest: SearchRequest) => {
  return useInfiniteQuery({
    queryKey: ["spans", searchRequest],
    keepPreviousData: true,
    queryFn: ({ pageParam }) => fetchSpans({ pageParam, searchRequest }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
};
