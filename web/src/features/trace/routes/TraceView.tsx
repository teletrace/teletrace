import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Edge, MarkerType, Node } from "reactflow";

import {
  EdgeColor,
  EdgeData,
  NodeColor,
  NodeData,
} from "@/components/Graph/types";
import {
  BASIC_EDGE_TYPE,
  BASIC_NODE_TYPE,
  EDGE_ARROW_SIZE,
  POSITION,
} from "@/components/Graph/utils/global";
import { createGraphLayout } from "@/components/Graph/utils/layout";
import { Head } from "@/components/Head";

import { SPANS_MOCK } from "../components/spans-mock";
import { TraceGraph } from "../components/TraceGraph";
import { ServiceSpansList } from "../components/TraceTags/ServiceSpansList/ServiceSpansList";
import { TraceTimeline } from "../components/TraceTimeline";

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/checkout",
      image: "IoTHTTP2Protocol",
      type: "Http",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
  {
    id: "2",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/invoices",
      image: "LambdaFunction",
      type: "Node.js",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
  {
    id: "3",
    type: BASIC_NODE_TYPE,
    data: {
      name: "update-subscription",
      image: "ApiGatewayEndpoint",
      type: "SNS",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
  {
    id: "4",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/payment",
      image: "IoTHTTP2Protocol",
      type: "Http",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
];

const initialEdges: Edge<EdgeData>[] = [
  {
    id: "e1-2",
    type: BASIC_EDGE_TYPE,
    source: "1",
    target: "2",
    data: { time: "20ms", count: 2 },
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
  },
  {
    id: "e2-3",
    type: BASIC_EDGE_TYPE,
    source: "2",
    target: "3",
    data: { time: "20ms" },
    style: {
      padding: 1,
      cursor: "default",
      stroke: EdgeColor.NORMAL,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: EdgeColor.NORMAL,
    },
  },
  {
    id: "e2-4",
    type: BASIC_EDGE_TYPE,
    source: "2",
    target: "4",
    data: { time: "20ms" },
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
  },
];

export interface TraceData {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
}

export const TraceView = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { traceId } = useParams(); // trace ID
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState({});
  const [traceData, setTraceData] = useState<TraceData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    setTimeout(() => {
      createGraphLayout(initialNodes, initialEdges)
        .then((els: { nodes: Node<NodeData>[]; edges: Edge<EdgeData>[] }) => {
          if (els) {
            setTraceData(els);
            setIsLoading(false);
          }
        })
        .catch(() => alert("something went wrong!!! Could not render graph"));
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(selectedNode);
  }, [selectedNode]);

  return (
    <>
      <Head
        title="Trace View"
        description="Designated page to view trace's flow graph and timeline"
      />
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
        sx={{ height: "100%" }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent="space-between"
          flex={1}
        >
          <TraceGraph
            isLoading={isLoading}
            setSelectedNode={setSelectedNode}
            traceData={traceData}
          />
          <ServiceSpansList spans={SPANS_MOCK} />
        </Stack>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          flex={1}
        >
          <TraceTimeline />
        </Stack>
      </Stack>
    </>
  );
};
