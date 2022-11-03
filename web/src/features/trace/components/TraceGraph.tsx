import { Paper } from "@mui/material";
import { Controls, ReactFlow } from "reactflow";

import { Loader } from "@/components/Elements/Loader";
import { BasicEdge } from "@/components/Graph/BasicEdge";
import { BasicNode } from "@/components/Graph/BasicNode";
import { TraceGraphParams } from "@/components/Graph/types";

import "reactflow/dist/style.css";

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

export const TraceGraph = (params: TraceGraphParams) => {
  const { nodes, edges, onNodesChange, onEdgesChange } = params;
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
