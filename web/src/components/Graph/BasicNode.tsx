import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, Position } from "reactflow";

import IconInterface from "./interface/IconInterface";
import NodeIcon from "./NodeIcon";

import styles from "./styles";

const my_icon: IconInterface = {
  name: "nodejs",
  path: "./images/icons/icon-test.svg",
};

const BasicNode = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 0,
          height: 0,
          minHeight: 0,
          minWidth: 0,
          borderColor: "transparent",
        }}
      />
      <Box sx={styles.nodeStyle.nodeBox}>
        <Box sx={styles.nodeStyle.nodeIconBox}>
          <NodeIcon name={my_icon.name} path={my_icon.path} />
        </Box>
        <Box sx={styles.nodeStyle.nodeText}>
          <Box sx={styles.nodeStyle.textContainer}>/Checkout</Box>
          <Box sx={styles.nodeStyle.textContainer}>Http</Box>
        </Box>
      </Box>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{
          width: 0,
          height: 0,
          minHeight: 0,
          minWidth: 0,
          borderColor: "transparent",
        }}
      />
    </>
  );
};

export default memo(BasicNode);
