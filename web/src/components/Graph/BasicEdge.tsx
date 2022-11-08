import { Box } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

import { FOREIGN_OBJECT_SIZE } from "@/components/Graph/utils/global";

import { styles } from "./styles";

enum EdgeColor {
  NORMAL = "#96979E",
  HOVER = "#FFFFFF",
  SELECTED = "#00CDE7",
  ERROR = "#EF5854",
}

const BasicEdgeImpl = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  animated,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [edgeColor, setEdgeColor] = useState(EdgeColor.NORMAL);
  useEffect(() => {
    if (animated && selected) {
      setEdgeColor(EdgeColor.SELECTED);
    } else if (animated && !selected) {
      setEdgeColor(EdgeColor.HOVER);
    } else {
      setEdgeColor(EdgeColor.NORMAL);
    }
  }, [animated, selected]);
  return (
    <>
      <path
        id={id}
        style={{ padding: 1, stroke: edgeColor, cursor: "default" }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={FOREIGN_OBJECT_SIZE}
        height={FOREIGN_OBJECT_SIZE}
        x={labelX - FOREIGN_OBJECT_SIZE / 2}
        y={labelY - FOREIGN_OBJECT_SIZE / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Box sx={styles.edgeStyle.edgeLabelContainer}>
          <Box sx={styles.edgeStyle.timeContainer}>{data.time}</Box>
          {data?.count && (
            <Box
              sx={{
                ...styles.edgeStyle.counterContainer,
                borderColor: edgeColor,
              }}
            >
              {data.count}
            </Box>
          )}
        </Box>
      </foreignObject>
    </>
  );
};

export const BasicEdge = memo(BasicEdgeImpl);
