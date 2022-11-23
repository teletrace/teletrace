import { Box, CircularProgress, Stack } from "@mui/material";
import {
  MouseEvent as ReactMouseEvent,
  memo,
  useEffect,
  useState,
} from "react";
import {
  Controls,
  Edge,
  Node,
  ReactFlow,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { BasicEdge } from "./Graph/BasicEdge";
import { BasicNode } from "./Graph/BasicNode";
import { EdgeData, NodeData, TraceData, TraceGraphParams } from "./Graph/types";
import { createGraphLayout, spansToGraphData } from "./Graph/utils/layout";
import {
  applyHoverEdgeStyle,
  applyHoveredNodeStyle,
  applyNormalEdgeStyle,
  applyNormalNodeStyle,
  applySelectedEdgeStyle,
  applySelectedNodeStyle,
} from "./Graph/utils/utils";

import "reactflow/dist/style.css";

const nodeTypes = { basicNode: BasicNode };
const edgeTypes = { basicEdge: BasicEdge };

const TraceGraphImpl = ({ setSelectedNode, spans }: TraceGraphParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>([]);
  const [traceData, setTraceData] = useState<TraceData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const { nodes, edges } = spansToGraphData(spans);
    createGraphLayout(nodes, edges)
      .then((els: { nodes: Node<NodeData>[]; edges: Edge<EdgeData>[] }) => {
        if (els.nodes.length > 0) {
          setTraceData(els);
          setIsLoading(false);
        }
      })
      .catch(() => alert("something went wrong!!! Could not render graph"));
  }, [spans]);

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
    <Box sx={{ flex: 1 }}>
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
    </Box>
  );
};

export const TraceGraph = memo(TraceGraphImpl);
