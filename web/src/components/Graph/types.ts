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
}

export interface EdgeData {
  time: string;
  count?: number;
}

export interface BasicNodeProps {
  image: string;
  name: string;
  type: string;
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
