export type AvailableTag = {
  name: string;
  type: string;
};

export type AvailableTagsRequest = {
  metadata?: { nextToken: string };
};

export type AvailableTagsResponse = {
  Tags: AvailableTag[];
  metadata?: { nextToken: string };
};
