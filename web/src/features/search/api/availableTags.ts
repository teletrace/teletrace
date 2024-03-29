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

import { AvailableTagsResponse } from "../types/availableTags";

/**
 * fetch available tags
 */

export const fetchAvailableTags = (): Promise<AvailableTagsResponse> => {
  // const availableTagsRequest: AvailableTagsRequest = {metadata: {nextToken: nextToken}}
  return axiosClient.get("/v1/tags");
};

/**
 * react hook to fetch available tags
 */
export const useAvailableTags = () => {
  return useInfiniteQuery({
    queryKey: ["availableTags"],
    queryFn: () => fetchAvailableTags(),
    getNextPageParam: () => undefined,
  });
};
