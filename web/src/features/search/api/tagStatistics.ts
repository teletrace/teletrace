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

import {TagStatisticsRequest, TagStatisticsResponse} from "../types/tagStatistics";


/**
 * fetch tag statistics
 */

export const fetchTagStatistics = (tagStatisticsRequest: TagStatisticsRequest): Promise<TagStatisticsResponse> => {
  return axiosClient.post("/v1/tags/statistics", tagStatisticsRequest);
};

/**
 * react hook to fetch tag statistics
 */
export const useTagStatistics = (tagStatisticsRequest: TagStatisticsRequest) => {
  return useQuery({
    queryKey: [
      "tagStatistics",
      tagStatisticsRequest.tag,
      tagStatisticsRequest.desiredStatistics,
      tagStatisticsRequest.filters,
      tagStatisticsRequest.timeframe.endTimeUnixNanoSec,
      tagStatisticsRequest.timeframe.startTimeUnixNanoSec,
    ],
    keepPreviousData: true,
    queryFn: () => fetchTagStatistics(tagStatisticsRequest),
  });
};
