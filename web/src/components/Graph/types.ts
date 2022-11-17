import { Node } from "reactflow";

import { TraceData } from "@/features/trace";
import { InternalSpan } from "@/types/span";

export interface NodeData extends GraphNodeData {
  color: NodeColor;
  graph_node: GraphNode;
}

export interface GraphNodeData {
  name: string;
  image: string;
  type: string;
}

export interface EdgeData {
  time: string;
  count: number;
}

export interface TraceGraphParams {
  setSelectedNode: (val: Node<NodeData> | object) => void;
  traceData: TraceData;
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

export type GraphNode = {
  serviceName: string;
  systemType: string;
  spansIds: string[];
  parentSpansIds: string[];
  spans: InternalSpan[];
};

export type SpanServiceMap = {
  [spanId: string]: GraphNode;
};
