import { Timeframe } from "./common";


export type TagValue = {
  value: string | number;
  count: number;
};

export type TagValuesRequest = {
  tag: string;
  timeframe: Timeframe
  metadata?: { nextToken: string };
};

export type TagValuesResponse = {
  values: TagValue[];
  metadata?: { nextToken: string };
};
