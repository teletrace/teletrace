import { BasicNodeProps } from "@/components/Graph/types";
import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import NodeIcon from "./NodeIcon";
import styles from "./styles";

const BasicNode = (props: NodeProps<BasicNodeProps>) => {
  const { image, name, type } = props.data;
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: "hidden" }}
      />
      <Box sx={styles.nodeStyle.nodeBox}>
        <Box sx={styles.nodeStyle.nodeIconBox}>
          <NodeIcon name={image} />
        </Box>
        <Box sx={styles.nodeStyle.nodeText}>
          <Box sx={styles.nodeStyle.textContainer}>{name} </Box>
          <Box sx={styles.nodeStyle.textContainer}> {type} </Box>
        </Box>
      </Box>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ visibility: "hidden" }}
      />
    </>
  );
};

export default memo(BasicNode);
