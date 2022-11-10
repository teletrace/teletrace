import { Node } from "reactflow";

import { TraceData } from "@/features/trace";

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
