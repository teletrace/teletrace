import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import {
  Edge,
  MarkerType,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { EdgeData, NodeData } from "@/components/Graph/types";
import {
  BASIC_EDGE_TYPE,
  BASIC_NODE_TYPE,
  EDGE_ARROW_SIZE,
  POSITION,
} from "@/components/Graph/utils/global";
import { createGraphLayout } from "@/components/Graph/utils/layout";
import { Head } from "@/components/Head";

import { SpansMock } from "../components/spansMock";
import { TraceGraph } from "../components/TraceGraph";
import TraceTags from "../components/TraceTags";
import { TraceTimeline } from "../components/TraceTimeline";

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/checkout",
      image: "IoTHTTP2Protocol",
      type: "Http",
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
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
    },
  },
  {
    id: "e2-3",
    type: BASIC_EDGE_TYPE,
    source: "2",
    target: "3",
    data: { time: "20ms" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
    },
  },
  {
    id: "e2-4",
    type: BASIC_EDGE_TYPE,
    source: "2",
    target: "4",
    data: { time: "20ms" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
    },
  },
];

export const TraceView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    setTimeout(() => {
      createGraphLayout(initialNodes, initialEdges)
        .then((els) => {
          if (els.nodes.length > 0) {
            setIsLoading(false);
            setNodes(els.nodes);
            setEdges(els.edges);
          }
        })
        .catch(() => alert("something went wrong!!! Could not render graph"));
    }, 1000);
  }, []);
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
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            isLoading={isLoading}
          />
          <TraceTags spans={SpansMock} selectedSpanId="" />
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
