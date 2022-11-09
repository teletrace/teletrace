import { Edge, Node } from "reactflow";

import {
  EdgeColor,
  EdgeData,
  NodeColor,
  NodeData,
} from "@/components/Graph/types";

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

export const updateNodeStyle = (
  node: Node<NodeData>,
  selected: boolean,
  color: NodeColor
): Node<NodeData> => {
  node.data = { ...node.data, color: color };
  node.selected = selected;
  return node;
};
