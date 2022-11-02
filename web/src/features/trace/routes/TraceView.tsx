import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect } from "react";
import {
  Edge,
  MarkerType,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { EdgeData, NodeData } from "@/components/Graph/types";
import {
  basicEdgeType,
  basicNodeType,
  position,
} from "@/components/Graph/utils/global";
import { createGraphLayout } from "@/components/Graph/utils/layout";
import { Head } from "@/components/Head";

import { TraceGraph } from "../components/TraceGraph";
import { TraceTags } from "../components/TraceTags";
import { TraceTimeline } from "../components/TraceTimeline";

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: basicNodeType,
    data: {
      name: "/checkout",
      image: "IoTHTTP2Protocol",
      type: "Http",
    },
    position,
  },
  {
    id: "2",
    type: basicNodeType,
    data: {
      name: "/invoices",
      image: "LambdaFunction",
      type: "Node.js",
    },
    position,
  },
  {
    id: "3",
    type: basicNodeType,
    data: {
      name: "update-subscription",
      image: "ApiGatewayEndpoint",
      type: "SNS",
    },
    position,
  },
  {
    id: "4",
    type: basicNodeType,
    data: {
      name: "/payment",
      image: "IoTHTTP2Protocol",
      type: "Http",
    },
    position,
  },
];

const initialEdges: Edge<EdgeData>[] = [
  {
    id: "e1-2",
    type: basicEdgeType,
    source: "1",
    target: "2",
    data: { time: "20ms", count: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e2-3",
    type: basicEdgeType,
    source: "2",
    target: "3",
    data: { time: "20ms" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e2-4",
    type: basicEdgeType,
    source: "2",
    target: "4",
    data: { time: "20ms" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
];

export const TraceView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    const fetchData = async () => {
      const els = await createGraphLayout(initialNodes, initialEdges);
      if (els) {
        setNodes(els.nodes);
        setEdges(els.edges);
      }
    };
    fetchData().catch(console.error);
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
          />
          <TraceTags />
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
