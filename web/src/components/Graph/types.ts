import { OnEdgesChange, OnNodesChange } from "@reactflow/core/dist/esm/types";
import { Edge, Node } from "reactflow";

export interface NodeData {
  name: string;
  image: string;
  type: string;
}

export interface EdgeData {
  time: string;
  count?: number;
}

export interface IconComponentProps {
  name: string;
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
}
