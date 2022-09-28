import { Typography } from "@mui/material";
import { ReactElement } from "react";

export interface PublicRouteProps {
  path: string;
  element: ReactElement;
}

export const publicRoutes: PublicRouteProps[] = [
  {
    path: "/trace-view",
    element: <Typography variant="h2">Trace View</Typography>,
  },
  {
    path: "/search",
    element: <Typography variant="h2">Search</Typography>,
  },
];
