import { Edge, Node } from "reactflow";

import {
  EdgeColor,
  EdgeData,
  NodeColor,
  NodeData,
} from "@/components/Graph/types";

export const applySelectedNodeStyle = (
  node: Node<NodeData>
): Node<NodeData> => {
  return {
    ...node,
    selected: true,
    data: { ...node.data, color: NodeColor.SELECTED },
  };
};

export const applyNormalNodeStyle = (node: Node<NodeData>): Node<NodeData> => {
  return {
    ...node,
    selected: false,
    data: { ...node.data, color: NodeColor.NORMAL },
  };
};

export const applyHoveredNodeStyle = (node: Node<NodeData>): Node<NodeData> => {
  return {
    ...node,
    selected: false,
    data: { ...node.data, color: NodeColor.HOVER },
  };
};

export const applySelectedEdgeStyle = (
  edge: Edge<EdgeData>
): Edge<EdgeData> => {
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = { ...edge.markerEnd, color: EdgeColor.SELECTED };
  }
  if (edge.style) {
    edge.style = { ...edge.style, stroke: EdgeColor.SELECTED };
  }
  return { ...edge, animated: true, selected: true };
};

export const applyNormalEdgeStyle = (edge: Edge<EdgeData>): Edge<EdgeData> => {
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = { ...edge.markerEnd, color: EdgeColor.NORMAL };
  }
  if (edge.style) {
    edge.style = { ...edge.style, stroke: EdgeColor.NORMAL };
  }
  return { ...edge, animated: false, selected: false };
};

export const applyHoverEdgeStyle = (edge: Edge<EdgeData>): Edge<EdgeData> => {
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = { ...edge.markerEnd, color: EdgeColor.HOVER };
  }
  if (edge.style) {
    edge.style = { ...edge.style, stroke: EdgeColor.HOVER };
  }
  return { ...edge, animated: true, selected: false };
};
