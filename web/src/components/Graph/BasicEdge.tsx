import { Box } from "@mui/material";
import { EdgeProps, getBezierPath } from "reactflow";

import { FOREIGN_OBJECT_SIZE } from "@/components/Graph/utils/global";

import { styles } from "./styles";

export const BasicEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
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
        style={{ padding: 1 }}
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
          <Box sx={styles.edgeStyle.timeContainer}>{data?.time}</Box>
          {data?.count && (
            <Box sx={styles.edgeStyle.counterContainer}>{data.count}</Box>
          )}
        </Box>
      </foreignObject>
    </>
  );
};
