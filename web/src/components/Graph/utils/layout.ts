import Elk, { ElkNode } from "elkjs";
import { ElkExtendedEdge } from "elkjs/lib/elk-api";
import { Edge, MarkerType, Node, Position } from "reactflow";

import {
  EdgeColor,
  EdgeData,
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
  return spanArrayToGraphTree(spans);
};

const getServiceType = (attr: Attributes, span_name: string) => {
  const nodeData = {
    name: span_name,
    image: "",
    type: "",
  };
  if (typeof attr["db.system"] === "string") {
    if (typeof attr["db.name"] === "string") {
      nodeData.name = attr["db.name"];
    }
    nodeData.image = attr["db.system"];
    nodeData.type = attr["db.system"];
  } else if (typeof attr["messaging.system"] === "string") {
    if (typeof attr["messaging.destination"] === "string") {
      nodeData.name = attr["messaging.destination"];
    }
    nodeData.image = attr["messaging.system"];
    nodeData.type = attr["messaging.system"];
  } else if (typeof attr["rpc.system"] === "string") {
    if (typeof attr["rpc.service"] === "string") {
      nodeData.name = attr["rpc.service"];
    }
    nodeData.image = attr["rpc.system"];
    nodeData.type = attr["rpc.system"];
  } else if (typeof attr["faas.trigger"] === "string") {
    if (typeof attr["faas.name"] === "string") {
      nodeData.name = attr["faas.name"];
    }
    nodeData.image = "lambda";
    nodeData.type = attr["faas.trigger"];
  } else if (typeof attr["service.name"] === "string") {
    if (typeof attr["telemetry.sdk.language"] === "string") {
      nodeData.image = attr["telemetry.sdk.language"];
    }
    nodeData.type = attr["service.name"];
  }
  return nodeData;
};

const hasError = (status: SpanStatus): boolean => status.code !== 0;

const createGraphNode = (s: InternalSpan): Node<NodeData> => {
  const attr = { ...s.span.attributes, ...s.resource.attributes };
  const nodeData = getServiceType(attr, s.span.name);
  console.log(nodeData);
  return {
    id: s.span.spanId,
    type: BASIC_NODE_TYPE,
    data: {
      ...nodeData,
      color: hasError(s.span.status) ? NodeColor.ERR_NORMAL : NodeColor.NORMAL,
      span_data: { ...s },
    },
    position: POSITION,
  };
};

const createGraphEdge = (s: InternalSpan): Edge<EdgeData> => {
  const span = { ...s.span };
  const time = Math.trunc(
    (span.endTimeUnixNano - span.startTimeUnixNano) / 1000000
  );
  const edgeColor = hasError(s.span.status)
    ? EdgeColor.ERROR
    : EdgeColor.NORMAL;
  return {
    id: `${span.parentSpanId}-${span.spanId}`,
    type: BASIC_EDGE_TYPE,
    source: span.parentSpanId ? span.parentSpanId : "",
    target: span.spanId,
    data: {
      time: `${time}ms`,
    },
    style: {
      stroke: edgeColor,
      padding: 1,
      cursor: "default",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: edgeColor,
    },
  };
};

const isRoot = (parentId: string): boolean => parentId === "";

export const spanArrayToGraphTree = (
  spans: InternalSpan[],
  parentId = "",
  initialNodes: Node<NodeData>[] = [],
  initialEdges: Edge<EdgeData>[] = []
) => {
  spans.forEach((s: InternalSpan) => {
    if (s.span.parentSpanId === parentId) {
      initialNodes.push(createGraphNode(s));
      if (!isRoot(parentId)) {
        initialEdges.push(createGraphEdge(s));
      }
      spanArrayToGraphTree(spans, s.span.spanId, initialNodes, initialEdges);
    }
  });
  return { nodes: initialNodes, edges: initialEdges };
};
