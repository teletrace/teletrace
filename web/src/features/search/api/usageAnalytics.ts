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
import { CloudEvent, emitterFor, httpTransport } from "cloudevents";

import { axiosClient } from "@/libs/axios";

import { SystemIdResponse } from "../types/usageAnalyitcs";

const fetchSystemId = async (): Promise<SystemIdResponse> =>
  await axiosClient.get("/v1/system-id");

export const useSystemId = () =>
  useQuery({
    queryKey: ["systemId"],
    queryFn: async () => {
      const data = await fetchSystemId();
      return data?.value;
    },
  });

export const sendEvent = () => {
  const emit = emitterFor(
    httpTransport(
      "https://x7e6byq3xd.execute-api.us-east-1.amazonaws.com/prod/"
    )
  );
  const ce = new CloudEvent({ type: "1", source: "2", data: {} });
  emit(ce);
};
