export type availableTag = {
  name: string;
  type: string;
};

export type availableTagsRequest = {
  metadata?: { nextToken: string };
};

export type availableTagsResponse = {
  tags: availableTag[];
  metadata?: { nextToken: string };
};
