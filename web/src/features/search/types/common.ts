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
