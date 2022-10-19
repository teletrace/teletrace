import { Box } from "@mui/material";
import { memo } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

import EdgeLabelRender from "@/components/Graph/EdgeLabelRender";
import "./styles/basicEdgeStyle.css";

const BasicEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
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
          className="edge-label-container"
          sx={{ transform: `translate(${labelX - 10}px,${labelY - 35}px)` }}
        >
          <Box className="time-container">{data?.time}</Box>
          <Box className="counter-container">
            <Box component="span">{data?.count}</Box>
          </Box>
        </Box>
      </EdgeLabelRender>
    </>
  );
};

export default memo(BasicEdge);
