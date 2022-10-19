import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, Position } from "reactflow";

import IconInterface from "./interface/IconInterface";
import NodeIcon from "./NodeIcon";

import "./styles/basicNodeStyle.css";

const my_icon: IconInterface = {
  name: "nodejs",
  path: "./images/icons/icon-test.svg",
};

const BasicNode = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Box className="node-box">
        <Box className="node-icon-box">
          <NodeIcon name={my_icon.name} path={my_icon.path} />
        </Box>
        <Box className="node-text">
          <Box className="text-container">/Checkout</Box>
          <Box className="text-container">Http</Box>
        </Box>
      </Box>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default memo(BasicNode);
