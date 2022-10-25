import { Paper } from "@mui/material";
import { Connection, Edge } from "@reactflow/core/dist/esm/types";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Loader } from "@/components/Elements/Loader";
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
  const [loader, setLoader] = useState(false);
  const [nodes, , onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  useEffect(() => {
    const graphIsCreated = () => {
      //TODO implement fetch
      return nodes.length > 0 && edges.length > 0;
    };
    setLoader(graphIsCreated);
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
