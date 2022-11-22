import Elk, { ElkNode } from "elkjs";
import { ElkExtendedEdge } from "elkjs/lib/elk-api";
import { Edge, MarkerType, Node, Position } from "reactflow";

import { InternalSpan } from "@/types/span";

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
  internalSpan: InternalSpan,
  nodeData: GraphNodeData
): GraphNode => {
  return {
    id: `${nodeData.name}${nodeData.type}`,
    serviceName: nodeData.name,
    systemType: nodeData.type,
    image: nodeData.image,
    hasError: internalSpan.span.status.code !== 0,
    duration: internalSpan.externalFields.duration,
    spans: [{ ...internalSpan }],
  };
};

const spanToGraphNodes = (spans: InternalSpan[]): GraphNode[] => {
  const idGraphNodeMap = new Map<string, GraphNode>();
  spans.forEach((s: InternalSpan) => {
    const nodeData = getGraphNodeData(s);
    const graphNode = idGraphNodeMap.get(nodeData.id);
    graphNode
      ? idGraphNodeMap.set(nodeData.id, updateGraphNode(graphNode, s))
      : idGraphNodeMap.set(nodeData.id, createGraphNode(s, nodeData));
  });
  return [...idGraphNodeMap.values()];
};

const updateGraphNode = (
  g: GraphNode,
  internalSpan: InternalSpan
): GraphNode => {
  g.spans.push({ ...internalSpan });
  g.hasError = g.hasError || internalSpan.span.status.code !== 0;
  g.duration = g.duration + internalSpan.externalFields.duration;
  return g;
};

const getGraphNodeData = (s: InternalSpan): GraphNodeData => {
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
  for (const [key, value] of Object.entries(attr)) {
    const names = typeNameMap.get(key);
    if (names) {
      graphNodeData.type = value.toString();
      graphNodeData.image = value.toString();
      names.forEach((n) => {
        if (attr[n]) {
          graphNodeData.name = attr[n].toString();
          return;
        }
      });
    } else {
      graphNodeData.name = attr["service.name"].toString();
      graphNodeData.type = "service";
    }
  }
  graphNodeData.id = `${graphNodeData.name}${graphNodeData.type}`;
  return graphNodeData;
};

const createNode = (g: GraphNode): Node<NodeData> => {
  return {
    id: g.id,
    type: BASIC_NODE_TYPE,
    data: {
      id: g.id,
      name: g.serviceName,
      type: g.systemType,
      image: g.image,
      color: g.hasError ? NodeColor.ERR_NORMAL : NodeColor.NORMAL,
      graph_node: { ...g },
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
  const edge_id = `${node_id}${parent_name}`;
  return {
    id: edge_id,
    type: BASIC_EDGE_TYPE,
    source: parent_name,
    target: node_id,
    data: {
      time: `${duration / 1000000}ms`,
      count: 1,
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

const updateEdge = (e: Edge<EdgeData>): Edge<EdgeData> => {
  if (e.data) {
    e.data.count += 1;
  }
  return e;
};

export const graphNodesToGraphTree = (graphNodes: GraphNode[]) => {
  const nodes: Node<NodeData>[] = [];
  const edges_map = new Map<string, Edge<EdgeData>>();
  const spanServiceMap = new Map<string, GraphNode>();
  graphNodes.forEach((g: GraphNode) => {
    g.spans.forEach((s: InternalSpan) => {
      spanServiceMap.set(s.span.spanId, { ...g });
    });
  });
  graphNodes.forEach((g: GraphNode) => {
    nodes.push(createNode(g));
    g.spans.forEach((s: InternalSpan) => {
      const parent_id = s.span.parentSpanId || "";
      const p = spanServiceMap.get(parent_id);
      if (p) {
        const edge_id = `${g.id}${p.id}`;
        const e = edges_map.get(edge_id);
        e
          ? edges_map.set(edge_id, updateEdge(e))
          : edges_map.set(
              edge_id,
              createEdge(g.id, p.id, g.hasError, g.duration)
            );
      }
    });
  });
  const edges: Edge<EdgeData>[] = [...edges_map.values()];
  return { nodes: nodes, edges: edges };
};
