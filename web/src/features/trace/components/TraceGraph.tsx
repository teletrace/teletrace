import { Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  Connection,
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Loader } from "@/components/Elements/Loader";
import BasicEdge from "@/components/Graph/BasicEdge";
import BasicNode from "@/components/Graph/BasicNode";
import { getLayoutElements } from "@/components/Graph/utils/dynamic_layout";
import {
  basicEdgeType,
  basicNodeType,
  position,
} from "@/components/Graph/utils/global";

import "reactflow/dist/style.css";

interface NodeData {
  name: string;
  image: string;
  type: string;
}

interface EdgeData {
  time: string;
  count?: number;
}

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
    label: "2",
    data: { time: "20ms", count: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e2-3",
    type: basicEdgeType,
    source: "2",
    target: "3",
    label: "3",
    data: { time: "20ms" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e2-4",
    type: basicEdgeType,
    source: "2",
    target: "4",
    label: "4",
    data: { time: "20ms" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
];

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

export const TraceGraph = () => {
  const { nodes: layoutNodes, edges: layoutEdges } = getLayoutElements(
    initialNodes,
    initialEdges
  );

  const [loader, setLoader] = useState(false);
  const [nodes, , onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  useEffect(() => {
    const isGraphElReady = () => {
      return nodes.length > 0 && edges.length >= 0;
    };
    setLoader(isGraphElReady);
  }, []);

  return (
    <Paper sx={{ width: "100%" }}>
      {loader ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          edgeTypes={edgeTypes}
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
