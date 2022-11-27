import { ReactElement } from "react";

import { SpanSearch } from "@/features/search";
import { TraceView } from "@/features/trace";

export interface PublicRouteProps {
  path: string;
  element: ReactElement;
}

export const publicRoutes: PublicRouteProps[] = [
  {
    path: "/search",
    element: <SpanSearch />,
  },
  {
    path: "/trace/:traceId",
    element: <TraceView />,
  },
];
