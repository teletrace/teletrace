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
import { SystemIdRequest, SystemIdResponse } from "../types/usageAnalyitcs";
import { axiosClient } from "@/libs/axios";

export const fetchSystemId = (
  request: SystemIdRequest
): Promise<SystemIdResponse> => {
  return axiosClient.get("/v1/system-id");
};

export const useSystemId = () =>
  useInfiniteQuery({
    queryKey: ["systemId"],
    queryFn: () => fetchSystemId({}),
  });
