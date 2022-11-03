import { useInfiniteQuery } from "@tanstack/react-query";

import { SearchRequest, SearchResponse } from "@/types/spans/spanQuery";

type FetchSpansParams = { pageParam: string; searchRequest: SearchRequest };

function makeid(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export const fetchSpans = ({ pageParam, searchRequest }: FetchSpansParams): SearchResponse => {
  searchRequest.metadata = { nextToken: pageParam };

  const spans = [...Array(50)].map((_, i) => {
    return {
      span: {
        traceId: "1234",
        spanId: "1234",
        name: "test",
        startTime: 0,
        endTime: 0,
        kind: 1,
        traceState: "",
        attributes: {},
        droppedAttributesCount: 0,
        droppedEventsCount: 0,
        droppedLinksCount: 0,
        status: {
          message: "test message",
          code: 0
        }
      },
      resource: {
        attributes: {
          "service.name": "my-application"
        },
        droppedAttributesCount: 0,
      },
      scope: {
        name: "",
        version: "v1",
        attributes: {},
        droppedAttributesCount: 0,
      },
      externalFields: {
        duration: 0
      }
    }
  });

  return { 
    spans: spans,
    metadata: { nextToken: makeid(20) }
  };
  // return Promise.reject<SearchResponse>("not implemented");
};


export const useSpansQuery = (searchRequest: SearchRequest) => {
  return useInfiniteQuery({
    queryKey: ["spans", searchRequest],
    queryFn: ({ pageParam }) => fetchSpans({ pageParam, searchRequest }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.nextToken,
  });
};
