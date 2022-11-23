import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/libs/axios";
import { InternalSpan } from "@/types/span";

interface TraceQueryResponse {
  spans: InternalSpan[];
  metadata: { nextToken: string } | null;
}

const fetchTrace = (traceId: string): Promise<TraceQueryResponse> => {
  return axiosClient.get(`/v1/trace/${traceId}`);
};

export const useTraceQuery = (traceId: string) => {
  return useQuery({
    queryKey: ["trace", traceId],
    queryFn: () => fetchTrace(traceId),
    select: (traceResponse) => traceResponse.spans,
  });
};
