import { Box } from "@mui/material";
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { BasicNodeProps } from "@/components/Graph/types";
import { ResourceIcon } from "@/components/ResourceIcon/ResourceIcon";

import { styles } from "./styles";

enum IconBorderColor {
  NORMAL = "#96979E",
  HOVER = "#FFFFFF",
  SELECTED = "#009EB4",
  ERR_NORMAL = "#EF5854",
  ERR_HOVER = "#B52D29",
}

export const BasicNode = (props: NodeProps<BasicNodeProps>) => {
  const [borderColor, setBorderColor] = useState<IconBorderColor>(
    IconBorderColor.NORMAL
  );
  const { image, name, type } = props.data;
  const isSelected = props.selected;

  useEffect(() => {
    isSelected
      ? setBorderColor(IconBorderColor.SELECTED)
      : setBorderColor(IconBorderColor.NORMAL);
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
            if (!isSelected) setBorderColor(IconBorderColor.HOVER);
          }}
          onMouseLeave={() => {
            if (!isSelected) setBorderColor(IconBorderColor.NORMAL);
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
