import { Box } from "@mui/material";
import { memo } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

import { FOREIGN_OBJECT_SIZE } from "@/features/trace/components/TraceGraph/Graph/utils/global";

import { styles } from "./styles";

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
  style,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
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
                borderColor: style?.stroke,
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
