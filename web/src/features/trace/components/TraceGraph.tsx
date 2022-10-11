import { Paper } from "@mui/material";
import { useCallback } from "react";
import ReactFlow, {
  Connection,
  Edge,
  MarkerType,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import BasicEdge from "@/components/Graph/BasicEdge";
import BasicNode from "@/components/Graph/BasicNode";

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "basicNode",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    type: "basicNode",
    data: { label: "Node 2" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "basicNode",
    data: { label: "Node 3" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    type: "basicNode",
    data: { label: "Node 4" },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: false,
    label: "2",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: false,
    label: "3",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: false,
    label: "4",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

export const TraceGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  return (
    <Paper sx={{ width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      ></ReactFlow>
    </Paper>
  );
};
