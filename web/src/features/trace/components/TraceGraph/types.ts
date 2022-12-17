/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
