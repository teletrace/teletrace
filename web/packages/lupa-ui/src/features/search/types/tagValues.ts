export type TagValue = {
  value: string | number;
  occurrences: number;
};

export type TagValuesRequest = {
  tag: string;
  metadata?: { nextToken: string };
};

export type TagValuesResponse = {
  values: TagValue[];
  metadata?: { nextToken: string };
};
