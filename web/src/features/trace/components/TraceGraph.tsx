import { Paper } from "@mui/material";
import { useCallback } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
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

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

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
    position: { x: 50, y: 200 },
  },
  {
    id: "3",
    type: "basicNode",
    data: { label: "Node 3" },
    position: { x: 450, y: 200 },
  },
  {
    id: "4",
    type: "basicNode",
    data: { label: "Node 4" },
    position: { x: 50, y: 500 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    type: "basicEdge",
    source: "1",
    target: "2",
    animated: false,
    label: "2",
    data: { time: "20ms", count: 1 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e1-3",
    type: "basicEdge",
    source: "1",
    target: "3",
    label: "3",
    data: { time: "20ms", count: 1 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-4",
    type: "basicEdge",
    source: "2",
    target: "4",
    label: "4",
    data: { time: "20ms", count: 1 },
    style: { stroke: "#96979E" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export const TraceGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
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
        snapToGrid={true}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
      </ReactFlow>
    </Paper>
  );
};
