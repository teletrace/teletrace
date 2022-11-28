import { Edge, Node } from "reactflow";

import { EdgeColor, EdgeData, NodeColor, NodeData } from "../types";

export const applySelectedNodeStyle = (
  node: Node<NodeData>
): Node<NodeData> => {
  return {
    ...node,
    selected: true,
    data: {
      ...node.data,
      color: node.data.graphNode.hasError
        ? NodeColor.ERR_SELECTED
        : NodeColor.SELECTED,
    },
  };
};

export const applyNormalNodeStyle = (node: Node<NodeData>): Node<NodeData> => {
  return {
    ...node,
    selected: false,
    data: {
      ...node.data,
      color: node.data.graphNode.hasError
        ? NodeColor.ERR_NORMAL
        : NodeColor.NORMAL,
    },
  };
};

export const applyHoveredNodeStyle = (node: Node<NodeData>): Node<NodeData> => {
  return {
    ...node,
    selected: false,
    data: {
      ...node.data,
      color: node.data.graphNode.hasError
        ? NodeColor.ERR_HOVER
        : NodeColor.HOVER,
    },
  };
};

export const applySelectedEdgeStyle = (
  edge: Edge<EdgeData>
): Edge<EdgeData> => {
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = {
      ...edge.markerEnd,
      color: edge.data?.hasError ? EdgeColor.ERR_SELECTED : EdgeColor.SELECTED,
    };
  }
  if (edge.style) {
    edge.style = {
      ...edge.style,
      stroke: edge.data?.hasError ? EdgeColor.ERR_SELECTED : EdgeColor.SELECTED,
    };
  }
  return { ...edge, animated: true, selected: true };
};

export const applyNormalEdgeStyle = (edge: Edge<EdgeData>): Edge<EdgeData> => {
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = {
      ...edge.markerEnd,
      color: edge.data?.hasError ? EdgeColor.ERROR : EdgeColor.NORMAL,
    };
  }
  if (edge.style) {
    edge.style = {
      ...edge.style,
      stroke: edge.data?.hasError ? EdgeColor.ERROR : EdgeColor.NORMAL,
    };
  }
  return { ...edge, animated: false, selected: false };
};

export const applyHoverEdgeStyle = (edge: Edge<EdgeData>): Edge<EdgeData> => {
  if (edge.markerEnd && typeof edge.markerEnd !== "string") {
    edge.markerEnd = {
      ...edge.markerEnd,
      color: edge.data?.hasError ? EdgeColor.ERR_HOVER : EdgeColor.HOVER,
    };
  }
  if (edge.style) {
    edge.style = {
      ...edge.style,
      stroke: edge.data?.hasError ? EdgeColor.ERR_HOVER : EdgeColor.HOVER,
    };
  }
  return { ...edge, animated: true, selected: false };
};
