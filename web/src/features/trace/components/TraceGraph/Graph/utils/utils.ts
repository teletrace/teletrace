import { Edge, Node } from "reactflow";

import { EdgeColor, EdgeData, NodeColor, NodeData } from "../types";

export const applySelectedNodeStyle = (
  node: Node<NodeData>
): Node<NodeData> => {
  const color = node.data.graphNode.hasError
    ? NodeColor.ERR_SELECTED
    : NodeColor.SELECTED;
  return {
    ...node,
    selected: true,
    data: {
      ...node.data,
      color,
    },
  };
};

export const applyNormalNodeStyle = (node: Node<NodeData>): Node<NodeData> => {
  const color = node.data.graphNode.hasError
    ? NodeColor.ERROR
    : NodeColor.NORMAL;
  return {
    ...node,
    selected: false,
    data: {
      ...node.data,
      color,
    },
  };
};

export const applyHoveredNodeStyle = (node: Node<NodeData>): Node<NodeData> => {
  const color = node.data.graphNode.hasError
    ? NodeColor.ERR_HOVER
    : NodeColor.HOVER;
  return {
    ...node,
    selected: false,
    data: {
      ...node.data,
      color,
    },
  };
};

export const applySelectedEdgeStyle = (
  edge: Edge<EdgeData>
): Edge<EdgeData> => {
  const color = edge.data?.hasError
    ? EdgeColor.ERR_SELECTED
    : EdgeColor.SELECTED;
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = {
      ...edge.markerEnd,
      color,
    };
  }
  if (edge.style) {
    edge.style = {
      ...edge.style,
      stroke: color,
    };
  }
  return { ...edge, animated: true, selected: true };
};

export const applyNormalEdgeStyle = (edge: Edge<EdgeData>): Edge<EdgeData> => {
  const color = edge.data?.hasError ? EdgeColor.ERROR : EdgeColor.NORMAL;
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = {
      ...edge.markerEnd,
      color,
    };
  }
  if (edge.style) {
    edge.style = {
      ...edge.style,
      stroke: color,
    };
  }
  return { ...edge, animated: false, selected: false };
};

export const applyHoverEdgeStyle = (edge: Edge<EdgeData>): Edge<EdgeData> => {
  const color = edge.data?.hasError ? EdgeColor.ERR_HOVER : EdgeColor.HOVER;
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = {
      ...edge.markerEnd,
      color,
    };
  }
  if (edge.style) {
    edge.style = {
      ...edge.style,
      stroke: color,
    };
  }
  return { ...edge, animated: true, selected: false };
};
