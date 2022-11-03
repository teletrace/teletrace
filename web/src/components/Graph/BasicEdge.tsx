import { Box } from "@mui/material";
import { EdgeProps, getBezierPath } from "reactflow";

import { EdgeLabelRender } from "@/components/Graph/EdgeLabelRender";

import { styles } from "./styles";

export const BasicEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
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
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRender>
        <Box
          sx={{
            ...styles.edgeStyle.edgeLabelContainer,
            transform: `translate(${labelX - 10}px,${labelY - 35}px)`,
          }}
        >
          <Box sx={styles.edgeStyle.timeContainer}>{data?.time}</Box>
          {data?.count && (
            <Box sx={styles.edgeStyle.counterContainer}>
              <Box sx={{ margin: "0.313rem" }}>{data?.count}</Box>
            </Box>
          )}
        </Box>
      </EdgeLabelRender>
    </>
  );
};
