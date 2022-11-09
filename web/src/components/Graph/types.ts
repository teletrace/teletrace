import { MouseEvent as ReactMouseEvent } from "react";
import {
  Edge,
  Node,
  NodeMouseHandler,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";

export interface NodeData {
  name: string;
  image: string;
  type: string;
  color: NodeColor;
}

export interface EdgeData {
  time: string;
  count?: number;
}

export interface BasicNodeProps {
  image: string;
  name: string;
  type: string;
  color: NodeColor;
}

export interface TraceGraphParams {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeClick: NodeMouseHandler;
  onPaneClick: (event: ReactMouseEvent) => void;
  onNodeMouseEnter: NodeMouseHandler;
  onNodeMouseLeave: NodeMouseHandler;
  isLoading: boolean;
}

export enum EdgeColor {
  NORMAL = "#96979E",
  HOVER = "#FFFFFF",
  SELECTED = "#00CDE7",
  ERROR = "#EF5854",
}

export enum NodeColor {
  NORMAL = "#96979E",
  HOVER = "#FFFFFF",
  SELECTED = "#009EB4",
  ERR_NORMAL = "#EF5854",
  ERR_HOVER = "#B52D29",
}
