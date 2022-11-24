/** types used to query spans from the lupa backend */

import { InternalSpan } from "@/types/span";

import { SearchFilter, Timeframe } from "./common";

export type Sort = {
  field: string;
  ascending: boolean;
};

export type SearchRequest = {
  timeframe: Timeframe;

  filters?: SearchFilter[];
  sort?: Sort[];
  metadata?: { nextToken: string };
};

export type SearchResponse = {
  spans: InternalSpan[];
  metadata?: { nextToken: string };
};
