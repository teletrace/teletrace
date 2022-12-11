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

export type Timeframe = {
  startTimeUnixNanoSec: number;
  endTimeUnixNanoSec: number;
};

export const operatorsList = [
  "in",
  "not_in",
  "contains",
  "not_contains",
  "exists",
  "not_exists",
  "gt",
  "gte",
  "lt",
  "lte",
] as const;

export type Operator = typeof operatorsList[number];

export type FilterValueTypes = string | number | Array<string | number>;

export type ValueInputMode = "select" | "text" | "none" | "numeric";

export type KeyValueFilter = {
  key: string;
  value: FilterValueTypes;
  operator: Operator;
};

export type SearchFilter = {
  keyValueFilter: KeyValueFilter;
};
