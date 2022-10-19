import { Box } from "@mui/material";
import React, { memo } from "react";

import "./styles/nodeIconStyle.css";
import IconInterface from "./interface/IconInterface";

const NodeIcon: React.FC<IconInterface> = (icon: IconInterface) => {
  return (
    <Box className="node-icon">
      <img
        src={icon.path}
        alt={icon.name}
        width={"27.48px"}
        height={"27.48px"}
      ></img>
    </Box>
  );
};

export default memo(NodeIcon);
