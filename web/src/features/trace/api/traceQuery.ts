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
import { InternalSpan } from "@/types/span";

interface TraceQueryResponse {
  spans: InternalSpan[];
  metadata: { nextToken: string } | null;
}

const fetchTrace = (traceId: string): Promise<TraceQueryResponse> => {
  return axiosClient.get(`/v1/trace/${traceId}`);
};

export const useTraceQuery = (traceId: string) => {
  return useQuery({
    queryKey: ["trace", traceId],
    queryFn: () => fetchTrace(traceId),
    select: (traceResponse) => traceResponse.spans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
