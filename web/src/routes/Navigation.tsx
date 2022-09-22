import { Home, ManageSearch } from "@mui/icons-material";
import { ReactElement } from "react";

import { Homepage } from "@/pages/Homepage";
import { Traces } from "@/pages/Traces";

export interface NavigationConfig {
  sidebarName: string;
  path: string;
  icon: ReactElement;
  mycomp: ReactElement;
}

const navConfigMap: NavigationConfig[] = [
  {
    sidebarName: "Homepage",
    path: "/",
    icon: <Home />,
    mycomp: <Homepage />,
  },
  {
    sidebarName: "Tracer",
    path: "/traces",
    icon: <ManageSearch />,
    mycomp: <Traces />,
  },
];

export default navConfigMap;
