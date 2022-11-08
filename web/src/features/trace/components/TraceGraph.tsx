import { Box, Paper } from "@mui/material";
import { memo, useMemo } from "react";
import { Controls, ReactFlow } from "reactflow";

import { Loader } from "@/components/Elements/Loader";
import { BasicEdge } from "@/components/Graph/BasicEdge";
import { BasicNode } from "@/components/Graph/BasicNode";
import { TraceGraphParams } from "@/components/Graph/types";

import "reactflow/dist/style.css";

const TraceGraphImpl = (params: TraceGraphParams) => {
  const nodeTypes = useMemo(() => ({ basicNode: BasicNode }), []);
  const edgeTypes = useMemo(() => ({ basicEdge: BasicEdge }), []);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onPaneClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    isLoading,
  } = params;

  return (
    <Paper sx={{ width: "100%" }}>
      {isLoading ? (
        <Loader />
      ) : nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          selectNodesOnDrag={false}
          defaultMarkerColor={"#96979E"}
          fitView
        >
          <Controls />
        </ReactFlow>
      ) : (
        <Box>No Data to display</Box>
      )}
    </Paper>
  );
};

export const TraceGraph = memo(TraceGraphImpl);
