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

/** types used to send usage analytics to teletrace backend */

export const eventType: Record<string, string> = {
  spans_table_viewed: "teletrace.spans_table_viewed",
  trace_viewed: "teletrace.trace_viewed",
};

export type SystemInfoResponse = {
  systemId: string;
  usageReportingEnabled: boolean;
};
