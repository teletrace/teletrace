import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { ResourceIcon } from "@/components/Elements/ResourceIcon";

import { NodeData } from "../types";
import { styles } from "./styles";

const BasicNodeImpl = (props: NodeProps<NodeData>) => {
  const { image, name, type, color } = props.data;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: "hidden" }}
      />
      <Box sx={styles.nodeBox}>
        <Box
          sx={{
            ...styles.nodeIconBox,
            borderColor: color,
          }}
        >
          <ResourceIcon name={image} style={styles.nodeIcon} />
        </Box>
        <Box sx={styles.nodeName}>{name}</Box>
        <Box sx={styles.nodeService}>{type}</Box>
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

export const BasicNode = memo(BasicNodeImpl);
