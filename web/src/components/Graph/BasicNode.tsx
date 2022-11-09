import { Box } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { BasicNodeProps, NodeColor } from "@/components/Graph/types";
import { ResourceIcon } from "@/components/ResourceIcon/ResourceIcon";

import { styles } from "./styles";

const BasicNodeImpl = (props: NodeProps<BasicNodeProps>) => {
  const [borderColor, setBorderColor] = useState<NodeColor>(NodeColor.NORMAL);
  const { image, name, type } = props.data;
  const isSelected = props.selected;

  useEffect(() => {
    isSelected
      ? setBorderColor(NodeColor.SELECTED)
      : setBorderColor(NodeColor.NORMAL);
  }, [isSelected]);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: "hidden" }}
      />
      <Box sx={styles.nodeStyle.nodeBox}>
        <Box
          onMouseEnter={() => {
            if (!isSelected) setBorderColor(NodeColor.HOVER);
          }}
          onMouseLeave={() => {
            if (!isSelected) setBorderColor(NodeColor.NORMAL);
          }}
          sx={{
            ...styles.nodeStyle.nodeIconBox,
            borderColor: borderColor,
          }}
        >
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

export const BasicNode = memo(BasicNodeImpl);
