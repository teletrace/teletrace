import { Paper } from "@mui/material";
import { useEffect } from "react";
import {
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Loader } from "@/components/Elements/Loader";
import BasicEdge from "@/components/Graph/BasicEdge";
import BasicNode from "@/components/Graph/BasicNode";
import { EdgeData, NodeData } from "@/components/Graph/types";
import {
  basicEdgeType,
  basicNodeType,
  position,
} from "@/components/Graph/utils/global";
import { createGraphLayout } from "@/components/Graph/utils/layout";

import "reactflow/dist/style.css";

export const initialNodes: Node<NodeData>[] = [
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

export const initialEdges: Edge<EdgeData>[] = [
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

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

export const TraceGraph = () => {
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
    <Paper sx={{ width: "100%" }}>
      {nodes ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Controls />
        </ReactFlow>
      ) : (
        <Loader />
      )}
    </Paper>
  );
};
