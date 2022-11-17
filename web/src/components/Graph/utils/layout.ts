import Elk, { ElkNode } from "elkjs";
import { ElkExtendedEdge } from "elkjs/lib/elk-api";
import { Edge, MarkerType, Node, Position } from "reactflow";

import {
  EdgeColor,
  EdgeData,
  GraphNode,
  GraphNodeData,
  NodeColor,
  NodeData,
} from "@/components/Graph/types";
import {
  BASIC_EDGE_TYPE,
  BASIC_NODE_TYPE,
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  EDGE_ARROW_SIZE,
  POSITION,
} from "@/components/Graph/utils/global";
import { Attributes, InternalSpan, SpanStatus } from "@/types/span";

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

  nodes.forEach((node) => {
    layerNodes.push({
      id: node.id,
      width: DEFAULT_NODE_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
    });
  });
  edges.forEach((edge) => {
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

  nodes.map((el) => {
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
  const graphNodes = groupGraphNodesBySystemName(spanToGraphNodes(spans));
  return graphNodesToGraphTree(graphNodes);
};

const span_service_map = new Map<string, GraphNodeData>();

const spanServiceMap = (span_id: string, nodeData: GraphNodeData) => {
  span_service_map.set(span_id, nodeData);
};

const createGraphNode = (s: InternalSpan): GraphNode => {
  const nodeData = getGraphNodeData({
    ...s.span.attributes,
    ...s.resource.attributes,
  });
  const span_id = s.span.spanId;
  spanServiceMap(span_id, nodeData);
  return {
    serviceName: nodeData.name,
    systemType: nodeData.type,
    spansIds: [span_id],
    parentSpansIds: s.span.parentSpanId ? [s.span.parentSpanId] : [""],
    spans: [{ ...s }],
  };
};

const spanToGraphNodes = (spans: InternalSpan[]): GraphNode[] => {
  const graphNodes: GraphNode[] = [];
  spans.forEach((s) => {
    graphNodes.push(createGraphNode(s));
  });
  return graphNodes;
};

const groupGraphNodesBySystemName = (graphNodes: GraphNode[]) => {
  return graphNodes.reduce((m: GraphNode[], o: GraphNode) => {
    const found = m.find(
      (p) => p.systemType === o.systemType && p.serviceName === o.serviceName
    );
    if (found) {
      found.spans = [...found.spans, ...o.spans];
      found.spansIds = [...found.spansIds, ...o.spansIds];
      found.parentSpansIds = [...found.parentSpansIds, ...o.parentSpansIds];
    } else {
      m.push(o);
    }
    return m;
  }, []);
};

const getGraphNodeData = (attr: Attributes, span_name = ""): GraphNodeData => {
  const graphNodeData = {
    name: span_name,
    image: "",
    type: "",
  };
  if (typeof attr["db.system"] === "string") {
    if (typeof attr["db.name"] === "string") {
      graphNodeData.name = attr["db.name"];
    }
    graphNodeData.image = attr["db.system"];
    graphNodeData.type = attr["db.system"];
  } else if (typeof attr["messaging.system"] === "string") {
    if (typeof attr["messaging.destination"] === "string") {
      graphNodeData.name = attr["messaging.destination"];
    }
    graphNodeData.image = attr["messaging.system"];
    graphNodeData.type = attr["messaging.system"];
  } else if (typeof attr["rpc.system"] === "string") {
    if (typeof attr["rpc.service"] === "string") {
      graphNodeData.name = attr["rpc.service"];
    }
    graphNodeData.image = attr["rpc.system"];
    graphNodeData.type = attr["rpc.system"];
  } else if (typeof attr["faas.trigger"] === "string") {
    if (typeof attr["faas.name"] === "string") {
      graphNodeData.name = attr["faas.name"];
    }
    graphNodeData.image = "lambda";
    graphNodeData.type = attr["faas.trigger"];
  } else if (typeof attr["service.name"] === "string") {
    if (typeof attr["telemetry.sdk.language"] === "string") {
      graphNodeData.image = attr["telemetry.sdk.language"];
    }
    graphNodeData.type = attr["service.name"];
  }
  return graphNodeData;
};

const hasError = (status: SpanStatus): boolean => status.code !== 0;

const createNode = (g: GraphNode): Node<NodeData> => {
  const node_id = `${g.serviceName}${g.systemType}`;
  return {
    id: node_id,
    type: BASIC_NODE_TYPE,
    data: {
      name: g.serviceName,
      type: g.systemType,
      image: "",
      color: NodeColor.NORMAL,
      graph_node: { ...g },
    },
    position: POSITION,
  };
};

const createEdge = (node_id: string, parent_name: string): Edge<EdgeData> => {
  const edge_id = `${node_id}${parent_name}`;
  return {
    id: edge_id,
    type: BASIC_EDGE_TYPE,
    source: parent_name,
    target: node_id,
    data: {
      time: `1ms`,
      count: 0,
    },
    style: {
      stroke: EdgeColor.NORMAL,
      padding: 1,
      cursor: "default",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: EdgeColor.NORMAL,
    },
  };
};

const updateEdge = (old_edge: Edge<EdgeData>): Edge<EdgeData> => {
  if (old_edge.data) {
    const old_data = { ...old_edge.data };
    const count = old_data.count + 1;
    return {
      ...old_edge,
      data: {
        ...old_data,
        count: count,
      },
    };
  }
  return old_edge;
};

const isRoot = (obj: object): boolean => Object.keys(obj).length === 0;

export const graphNodesToGraphTree = (graphNodes: GraphNode[] = []) => {
  const initialNodes: Node<NodeData>[] = [];
  const added_edges = new Map<string, Edge<EdgeData>>();
  graphNodes.forEach((g: GraphNode) => {
    initialNodes.push(createNode(g));
    g.parentSpansIds.forEach((parent_id) => {
      const parent_node_ref = { ...span_service_map.get(parent_id) };
      if (!isRoot(parent_node_ref)) {
        const node_id = `${g.serviceName}${g.systemType}`;
        const parent_name = `${parent_node_ref.name}${parent_node_ref.type}`;
        const edge_id = `${node_id}${parent_name}`;
        const e = added_edges.get(edge_id);
        if (e) {
          added_edges.set(edge_id, updateEdge(e));
        } else {
          added_edges.set(edge_id, createEdge(node_id, parent_name));
        }
      }
    });
  });
  const initialEdges: Edge<EdgeData>[] = [...added_edges.values()];
  return { nodes: initialNodes, edges: initialEdges };
};
