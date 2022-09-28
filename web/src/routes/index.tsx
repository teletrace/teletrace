import { useRoutes } from "react-router-dom";

import { Landing, NotFound } from "@/features/misc";

import { publicRoutes } from "./public";

export const AppRoutes = () => {
  const commonRoutes = [
    { path: "/", element: <Landing /> },
    {
      path: "/*",
      element: <NotFound />,
    },
  ];

  const element = useRoutes([...publicRoutes, ...commonRoutes]);

  return <>{element}</>;
};
