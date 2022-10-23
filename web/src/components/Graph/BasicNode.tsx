import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import NodeIcon from "./NodeIcon";
import styles from "./styles";

const BasicNode = ({ data }: NodeProps) => {
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
          <NodeIcon name={data.name} image={data.image} />
        </Box>
        <Box sx={styles.nodeStyle.nodeText}>
          <Box sx={styles.nodeStyle.textContainer}>{data.name} </Box>
          <Box sx={styles.nodeStyle.textContainer}> {data.type} </Box>
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
