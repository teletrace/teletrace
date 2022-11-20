import Elk, { ElkNode } from "elkjs";
import { ElkExtendedEdge } from "elkjs/lib/elk-api";
import { Edge, MarkerType, Node, Position } from "reactflow";

import { Attributes, InternalSpan } from "@/types/span";

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
  return graphNodesToGraphTree(
    groupGraphNodesBySystemName(spanToGraphNodes(spans))
  );
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
  const graphNodes: GraphNode[] = [];
  spans.forEach((s: InternalSpan) => {
    const nodeData = getGraphNodeData({
      ...s.span.attributes,
      ...s.resource.attributes,
    });
    graphNodes.push(createGraphNode(s, nodeData));
  });
  return graphNodes;
};

const groupGraphNodesBySystemName = (graphNodes: GraphNode[]) => {
  return graphNodes.reduce((graphNodes: GraphNode[], graphNode: GraphNode) => {
    const sameService = graphNodes.find(
      (g: GraphNode) =>
        g.systemType === graphNode.systemType &&
        g.serviceName === graphNode.serviceName
    );
    if (sameService) {
      sameService.spans = [...sameService.spans, ...graphNode.spans];
      sameService.hasError = sameService.hasError || graphNode.hasError;
      sameService.duration = sameService.duration + graphNode.duration;
    } else {
      graphNodes.push(graphNode);
    }
    return graphNodes;
  }, []);
};

const getGraphNodeData = (attr: Attributes): GraphNodeData => {
  const graphNodeData = {
    name:
      typeof attr["net.peer.name"] === "string" ? attr["net.peer.name"] : "",
    image: "",
    type: "service",
  };
  if (typeof attr["db.system"] === "string") {
    graphNodeData.image = attr["db.system"];
    graphNodeData.type = attr["db.system"];
    if (typeof attr["db.name"] === "string") {
      graphNodeData.name = attr["db.name"];
    }
  } else if (typeof attr["messaging.system"] === "string") {
    graphNodeData.image = attr["messaging.system"];
    graphNodeData.type = attr["messaging.system"];
    if (typeof attr["messaging.destination"] === "string") {
      graphNodeData.name = attr["messaging.destination"];
    }
  } else if (typeof attr["service.name"] === "string") {
    graphNodeData.name = attr["service.name"];
    graphNodeData.image = "http";
    if (typeof attr["telemetry.sdk.language"] === "string") {
      graphNodeData.image = attr["telemetry.sdk.language"];
    }
  }
  return graphNodeData;
};

const createNode = (g: GraphNode): Node<NodeData> => {
  return {
    id: g.id,
    type: BASIC_NODE_TYPE,
    data: {
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
      count: 0,
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

const updateEdge = (oldEdge: Edge<EdgeData>): Edge<EdgeData> => {
  if (oldEdge.data) {
    const old_data = { ...oldEdge.data };
    const count = old_data.count + 1;
    return {
      ...oldEdge,
      data: {
        ...old_data,
        count: count,
      },
    };
  }
  return oldEdge;
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
