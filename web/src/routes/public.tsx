import { Typography } from "@mui/material";
import { ReactElement } from "react";

import { TraceView } from "@/features/trace";

export interface PublicRouteProps {
  path: string;
  element: ReactElement;
}

export const publicRoutes: PublicRouteProps[] = [
  {
    path: "/trace-view",
    element: <TraceView />,
  },
  {
    path: "/search",
    element: <Typography variant="h2">Search</Typography>,
  },
];
