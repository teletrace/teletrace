import { useQuery } from "@tanstack/react-query";

import { TagValue } from "../types/tagValues";

export const getTagValues = (tag: string): Promise<TagValue[]> => {
  // TODO: this is a temp mock data, when the API is created, update this function
  return new Promise<TagValue[]>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            value: "muddy-news.net.muddy-news.net.muddy-news.net",
            occurrences: 10 * 1000,
          },
          { value: 300, occurrences: 14 * 1000 },
          { value: 400, occurrences: 22 * 1000 },
          { value: 500, occurrences: 50 * 1000 },
        ]),
      5000
    );
  });
};

export const useTagValues = (tag: string) =>
  useQuery(["tagValues", tag], () => getTagValues(tag));
