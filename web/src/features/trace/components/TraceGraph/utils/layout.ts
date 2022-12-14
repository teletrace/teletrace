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

import Elk, { ElkNode } from "elkjs";
import { ElkExtendedEdge } from "elkjs/lib/elk-api";
import { Edge, MarkerType, Node, Position } from "reactflow";

import { InternalSpan, StatusCode } from "@/types/span";

import {
  EdgeColor,
  EdgeData,
  GraphNode,
  GraphNodeData,
  NodeColor,
  NodeData,
} from "../types";
import {
  BASIC_EDGE_TYPE,
  BASIC_NODE_TYPE,
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  EDGE_ARROW_SIZE,
  POSITION,
} from "./global";

export const createGraphLayout = async (
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[]
) => {
  const layerNodes: ElkNode[] = [];
  const layerEdges: ElkExtendedEdge[] = [];

  const elk = new Elk({
    defaultLayoutOptions: {
      "elk.algorithm": "mrtree",
      "elk.direction": "DOWN",
    },
  });

  nodes.forEach((node: Node<NodeData>) => {
    layerNodes.push({
      id: node.id,
      width: DEFAULT_NODE_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
    });
  });
  edges.forEach((edge: Edge<EdgeData>) => {
    layerEdges.push({
      id: edge.id,
      targets: [edge.target],
      sources: [edge.source],
    });
  });

  const newGraph = await elk.layout({
    id: "root",
    children: layerNodes,
    edges: layerEdges,
  });

  nodes.map((el: Node<NodeData>) => {
    const node = newGraph.children?.find((n) => n.id === el.id);
    el.sourcePosition = Position.Top;
    el.targetPosition = Position.Bottom;
    if (node?.x && node?.y && node?.width && node?.height) {
      el.position = {
        x: node.x - node.width / 2,
        y: node.y - node.height / 2,
      };
    }
    return el;
  });

  return { nodes, edges };
};

export const spansToGraphData = (spans: InternalSpan[]) => {
  return graphNodesToGraphTree(spanToGraphNodes(spans));
};

const createGraphNode = (
  internalSpan: Readonly<InternalSpan>,
  nodeData: Readonly<GraphNodeData>
): GraphNode => {
  return {
    id: `${nodeData.name}${nodeData.type}`,
    serviceName: nodeData.name,
    systemType: nodeData.type,
    image: nodeData.image,
    hasError: internalSpan.span.status.code === StatusCode.Error,
    duration: internalSpan.externalFields.durationNano,
    spans: [{ ...internalSpan }],
  };
};

const spanToGraphNodes = (spans: Readonly<InternalSpan[]>): GraphNode[] => {
  const graphNodeMap = new Map<string, GraphNode>();
  spans.forEach((s: Readonly<InternalSpan>) => {
    const nodeData = getGraphNodeData(s);
    const graphNode = graphNodeMap.get(nodeData.id);
    graphNode
      ? updateGraphNode(graphNode, s)
      : graphNodeMap.set(nodeData.id, createGraphNode(s, nodeData));
  });
  return [...graphNodeMap.values()];
};

const updateGraphNode = (
  g: GraphNode,
  internalSpan: Readonly<InternalSpan>
): void => {
  g.spans.push({ ...internalSpan });
  g.hasError = g.hasError || internalSpan.span.status.code === StatusCode.Error;
  g.duration = g.duration + internalSpan.externalFields.durationNano;
};

const getGraphNodeData = (s: Readonly<InternalSpan>): GraphNodeData => {
  const attr = { ...s.resource.attributes, ...s.span.attributes };
  const typeNameMap = new Map<string, string[]>([
    ["db.system", ["db.name", "net.peer.name"]],
    ["messaging.system", ["messaging.destination"]],
  ]);
  const graphNodeData: GraphNodeData = {
    id: "",
    name: "",
    image: "",
    type: "",
  };
  var hasFoundType: boolean = false;
  for (const [serviceTypeKey, serviceNameKeys] of typeNameMap) {
    const serviceType = attr[serviceTypeKey];
    if (serviceType) {
      hasFoundType = true;
      for (const name of serviceNameKeys) {
        const serviceName = attr[name];
        if (serviceName) {
          graphNodeData.name = serviceName.toString();
          graphNodeData.type = serviceType.toString();
          graphNodeData.image = serviceType.toString();
          break;
        }
      }
      break;
    }
  }
  if (!hasFoundType) {
    graphNodeData.name = attr["service.name"].toString();
    graphNodeData.type = "service";
  }
  graphNodeData.id = `${graphNodeData.name}-${graphNodeData.type}`;
  return graphNodeData;
};

const createNode = (g: Readonly<GraphNode>): Node<NodeData> => {
  return {
    id: g.id,
    type: BASIC_NODE_TYPE,
    data: {
      id: g.id,
      name: g.serviceName,
      type: g.systemType,
      image: g.image,
      color: g.hasError ? NodeColor.ERROR : NodeColor.NORMAL,
      graphNode: { ...g },
    },
    position: POSITION,
  };
};

const createEdge = (
  node_id: string,
  parent_name: string,
  hasError: boolean,
  duration: number
): Edge<EdgeData> => {
  const edge_id = `${node_id}->${parent_name}`;
  return {
    id: edge_id,
    type: BASIC_EDGE_TYPE,
    source: parent_name,
    target: node_id,
    data: {
      time: `${Math.round(duration / 1000000)}ms`,
      count: 1,
      hasError,
    },
    style: {
      stroke: hasError ? EdgeColor.ERROR : EdgeColor.NORMAL,
      padding: 1,
      cursor: "default",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: hasError ? EdgeColor.ERROR : EdgeColor.NORMAL,
    },
  };
};

const updateEdge = (e: Edge<EdgeData>): void => {
  if (e.data) {
    e.data.count += 1;
  }
};

export const graphNodesToGraphTree = (graphNodes: Readonly<GraphNode[]>) => {
  const nodes: Node<NodeData>[] = [];
  const edges_map = new Map<string, Edge<EdgeData>>();
  const spanServiceMap = new Map<string, GraphNode>();
  graphNodes.forEach((g: Readonly<GraphNode>) => {
    g.spans.forEach((s: Readonly<InternalSpan>) => {
      spanServiceMap.set(s.span.spanId, { ...g });
    });
  });
  graphNodes.forEach((g: Readonly<GraphNode>) => {
    nodes.push(createNode(g));
    g.spans.forEach((s: Readonly<InternalSpan>) => {
      const parent_id = s.span.parentSpanId || "";
      const p = spanServiceMap.get(parent_id);
      if (p) {
        if (g.id !== p.id) {
          // check if is not loop
          const edge_id = `${g.id}->${p.id}`;
          const e = edges_map.get(edge_id);
          e
            ? updateEdge(e)
            : edges_map.set(
                edge_id,
                createEdge(g.id, p.id, g.hasError, g.duration)
              );
        }
      }
    });
  });
  const edges: Edge<EdgeData>[] = [...edges_map.values()];
  return { nodes: nodes, edges: edges };
};
