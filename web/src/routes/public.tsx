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
  // Temporary route for development purposes
  {
    path: "/trace",
    element: <TraceView />,
  },
  {
    path: "/trace/:traceId",
    element: <TraceView />,
  },
];
