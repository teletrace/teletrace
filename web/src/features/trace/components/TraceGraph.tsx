import { Box, Paper, Typography } from "@mui/material";
import { useCallback } from "react";
import ReactFlow, {
  Background,
  Connection,
  Edge,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 100 } },
  { id: "3", data: { label: "Node 3" }, position: { x: 400, y: 100 } },
  { id: "4", data: { label: "Node 4" }, position: { x: 400, y: 200 } },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
];

export const TraceGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );
  return (
    <Paper
      sx={{
        position: "relative",
        height: 500,
        width: 550,
      }}
    >
      <Box
        sx={{
          position: "relative",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
      </ReactFlow>
    </Paper>
  );
};
