import { SearchFilter, Timeframe } from "./common";

export type TagValue = {
  value: string | number;
  count: number;
};

export type TagValuesRequest = {
  filters: SearchFilter[];
  timeframe: Timeframe;
  metadata?: { nextToken: string };
};

export type TagValuesResponse = {
  values: TagValue[];
  metadata?: { nextToken: string };
};
