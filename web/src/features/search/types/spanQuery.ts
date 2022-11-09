/** types used to query spans from the lupa backend */

import { InternalSpan } from "@/types/span";

import { Timeframe } from "./common";

export type Sort = {
  field: string;
  ascending: boolean;
};

export const operatorsList = [
  "equals",
  "not_equals",
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

export type KeyValueFilter = {
  key: string;
  value: string;
  operator: Operator;
};

export type SearchFilter = {
  keyValueFilter: KeyValueFilter;
};

export type SearchRequest = {
  timeframe: Timeframe;

  filters?: SearchFilter[];
  sort?: Sort;
  metadata?: { nextToken: string };
};

export type SearchResponse = {
  spans: InternalSpan[];
  metadata?: { nextToken: string };
};
