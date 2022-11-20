export type AvailableTag = {
  name: string;
  type: string;
};

export type AvailableTagsRequest = {
  metadata?: { nextToken: string };
};

export type AvailableTagsResponse = {
  tags: AvailableTag[];
  metadata?: { nextToken: string };
};
