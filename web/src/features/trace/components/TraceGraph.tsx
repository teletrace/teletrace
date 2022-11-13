import { CircularProgress, Paper, Stack } from "@mui/material";
import { MouseEvent as ReactMouseEvent, memo, useEffect } from "react";
import {
  Controls,
  Edge,
  Node,
  ReactFlow,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { BasicEdge } from "@/components/Graph/BasicEdge";
import { BasicNode } from "@/components/Graph/BasicNode";
import { EdgeData, NodeData, TraceGraphParams } from "@/components/Graph/types";
import {
  applyHoverEdgeStyle,
  applyHoveredNodeStyle,
  applyNormalEdgeStyle,
  applyNormalNodeStyle,
  applySelectedEdgeStyle,
  applySelectedNodeStyle,
} from "@/components/Graph/utils/utils";

import "reactflow/dist/style.css";

const nodeTypes = { basicNode: BasicNode };
const edgeTypes = { basicEdge: BasicEdge };

const TraceGraphImpl = ({
  isLoading,
  traceData,
  setSelectedNode,
}: TraceGraphParams) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>([]);

  useEffect(() => {
    setNodes(traceData.nodes);
    setEdges(traceData.edges);
  }, [traceData]);

  const onNodeClick = (event: ReactMouseEvent, node: Node<NodeData>) => {
    event.stopPropagation();
    setSelectedNode(node);
    const connectedEdges = getConnectedEdges([node], edges);
    setNodes(
      nodes.map((n: Node<NodeData>) =>
        n.id === node.id ? applySelectedNodeStyle(n) : applyNormalNodeStyle(n)
      )
    );
    setEdges(
      edges.map((e: Edge<EdgeData>) =>
        connectedEdges.includes(e)
          ? applySelectedEdgeStyle(e)
          : applyNormalEdgeStyle(e)
      )
    );
  };

  const onNodeMouseEnter = (event: ReactMouseEvent, node: Node<NodeData>) => {
    event.stopPropagation();
    if (!node.selected) {
      const connectedEdges = getConnectedEdges([node], edges);
      setNodes(
        nodes.map((n: Node<NodeData>) =>
          n.id === node.id ? applyHoveredNodeStyle(n) : n
        )
      );
      setEdges(
        edges.map((e: Edge<EdgeData>) =>
          !e.selected && connectedEdges.includes(e) ? applyHoverEdgeStyle(e) : e
        )
      );
    }
  };

  const onNodeMouseLeave = (event: ReactMouseEvent, node: Node<NodeData>) => {
    event.stopPropagation();
    if (!node.selected) {
      const connectedEdges = getConnectedEdges([node], edges);
      setNodes(
        nodes.map((n: Node<NodeData>) =>
          n.id === node.id ? applyNormalNodeStyle(n) : n
        )
      );
      setEdges(
        edges.map((e: Edge<EdgeData>) =>
          !e.selected && connectedEdges.includes(e)
            ? applyNormalEdgeStyle(e)
            : e
        )
      );
    }
  };

  const onPaneClick = (event: ReactMouseEvent) => {
    event.stopPropagation();
    setSelectedNode({});
    setNodes(nodes.map((n: Node<NodeData>) => applyNormalNodeStyle(n)));
    setEdges(edges.map((e: Edge<EdgeData>) => applyNormalEdgeStyle(e)));
  };

  return (
    <Paper sx={{ width: "100%" }}>
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <CircularProgress />
        </Stack>
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
          fitView
        >
          <Controls />
        </ReactFlow>
      ) : (
        <Stack alignItems="center" justifyContent="center" height="100%">
          No data to display
        </Stack>
      )}
    </Paper>
  );
};

export const TraceGraph = memo(TraceGraphImpl);
