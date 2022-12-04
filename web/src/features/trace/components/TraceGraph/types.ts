import { Edge, Node } from "reactflow";

import { InternalSpan } from "@/types/span";

export interface TraceData {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
}

export interface NodeData extends GraphNodeData {
  color: NodeColor;
  graphNode: GraphNode;
}

export interface GraphNodeData {
  id: string;
  name: string;
  image: string;
  type: string;
}

export interface EdgeData {
  time: string;
  count: number;
  hasError: boolean;
}

export interface TraceGraphProps {
  setSelectedNode: (node: GraphNode | null) => void;
  spans: InternalSpan[];
  initiallyFocusedSpanId: string | null;
}

export enum EdgeColor {
  NORMAL = "#96979E",
  HOVER = "#FFFFFF",
  SELECTED = "#00CDE7",
  ERROR = "#EF5854",
  ERR_SELECTED = "#EF5854",
  ERR_HOVER = "#F47874",
}

export enum NodeColor {
  NORMAL = "#96979E",
  HOVER = "#FFFFFF",
  SELECTED = "#009EB4",
  ERROR = "#EF5854",
  ERR_SELECTED = "#EF5854",
  ERR_HOVER = "#B52D29",
}

export type GraphNode = {
  readonly id: string;
  serviceName: string;
  systemType: string;
  image: string;
  hasError: boolean;
  duration: number;
  spans: InternalSpan[];
};
