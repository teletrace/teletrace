import { Box } from "@mui/material";
import { Handle, NodeProps, Position } from "reactflow";

import { BasicNodeProps } from "@/components/Graph/types";
import { ResourceIcon } from "@/components/ResourceIcon/ResourceIcon";

import { styles } from "./styles";

export const BasicNode = (props: NodeProps<BasicNodeProps>) => {
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
          <ResourceIcon name={image} />
        </Box>
        <Box sx={styles.nodeStyle.nodeText}>
          <Box sx={{ color: "#E9EAF1" }}>{name}</Box>
          <Box sx={{ fontSize: 14 }}>{type}</Box>
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
