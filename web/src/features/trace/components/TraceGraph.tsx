import { Paper } from "@mui/material";
import { Connection, Edge } from "@reactflow/core/dist/esm/types";
import { useCallback } from "react";
import ReactFlow, {
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import BasicEdge from "@/components/Graph/BasicEdge";
import BasicNode from "@/components/Graph/BasicNode";
import {
  layoutEdges,
  layoutNodes,
} from "@/components/Graph/utils/dynamic_layout";

import "reactflow/dist/style.css";

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

export const TraceGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
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
