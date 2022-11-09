import { Edge } from "reactflow";

import { EdgeColor, EdgeData } from "@/components/Graph/types";

export const updateEdgeStyle = (
  edge: Edge<EdgeData>,
  animated: boolean,
  selected: boolean,
  color: EdgeColor
): Edge<EdgeData> => {
  edge.animated = animated;
  edge.selected = selected;
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = { ...edge.markerEnd, color: color };
  }
  if (edge.style) {
    edge.style = { ...edge.style, stroke: color };
  }
  return edge;
};
