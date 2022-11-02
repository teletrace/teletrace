/** types used to query spans from the lupa backend */

import { InternalSpan } from "./span";

export type Timeframe = {
  startTime: number;
  endTime: number;
};

export type Sort = {
  field: string;
  ascending: boolean;
};

export type Operator =
  | "equals"
  | "not_equals"
  | "in"
  | "not_in"
  | "contains"
  | "not_contains"
  | "exists"
  | "not_exists"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export type KeyValueFilter = {
  key: string;
  value: string;
  operator: Operator;
};

export type SearchFilter = KeyValueFilter | string;

export type SearchRequest = {
  filter: SearchFilter;
  timeframe: Timeframe;

  sort?: Sort;
  metadata?: { nextToken: string };
};

export type SearchResponse = {
  spans: InternalSpan[];
  metadata?: { nextToken: string };
};
