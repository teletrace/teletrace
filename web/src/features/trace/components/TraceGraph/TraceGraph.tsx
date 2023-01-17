/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Box, CircularProgress, Stack } from "@mui/material";
import {
  MouseEvent as ReactMouseEvent,
  memo,
  useCallback,
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

import { InternalSpan } from "@/types/span";

import { BasicEdge } from "./BasicEdge";
import { BasicNode } from "./BasicNode";
import { EdgeData, GraphNode, NodeData, TraceData } from "./types";
import { createGraphLayout, spansToGraphData } from "./utils/layout";
import {
  applyHoverEdgeStyle,
  applyHoveredNodeStyle,
  applyNormalEdgeStyle,
  applyNormalNodeStyle,
  applySelectedEdgeStyle,
  applySelectedNodeStyle,
} from "./utils/utils";

import "reactflow/dist/style.css";

export interface TraceGraphProps {
  spans: InternalSpan[];
  initiallyFocusedSpanId: string | null;
  onInitialNodeSelection: (node: GraphNode) => void;
  onSelectedNodeChange: (node: GraphNode) => void;
}

const nodeTypes = { basicNode: BasicNode };
const edgeTypes = { basicEdge: BasicEdge };

const TraceGraphImpl = ({
  spans,
  initiallyFocusedSpanId,
  onInitialNodeSelection,
  onSelectedNodeChange,
}: TraceGraphProps) => {
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
  }, [traceData, setNodes, setEdges]);

  const markSelectedNode = useCallback(
    (
      nodes: Node<NodeData>[],
      edges: Edge<EdgeData>[],
      selectedNode: Node<NodeData>
    ) => {
      const connectedEdges = getConnectedEdges([selectedNode], edges);
      setNodes(
        nodes.map((n: Node<NodeData>) =>
          n.id === selectedNode.id
            ? applySelectedNodeStyle(n)
            : applyNormalNodeStyle(n)
        )
      );
      setEdges(
        edges.map((e: Edge<EdgeData>) =>
          connectedEdges.includes(e)
            ? applySelectedEdgeStyle(e)
            : applyNormalEdgeStyle(e)
        )
      );
    },
    [setEdges, setNodes]
  );

  useEffect(() => {
    if (!initiallyFocusedSpanId) {
      return;
    }
    for (const node of traceData.nodes) {
      const isSpanWithinNode = node.data.graphNode.spans.some(
        (span) => span.span.spanId === initiallyFocusedSpanId
      );
      if (isSpanWithinNode) {
        markSelectedNode(traceData.nodes, traceData.edges, node);
        onInitialNodeSelection(node.data.graphNode);
        break;
      }
    }
  }, [
    traceData,
    markSelectedNode,
    initiallyFocusedSpanId,
    onInitialNodeSelection,
  ]);

  const onNodeClick = (event: ReactMouseEvent, node: Node<NodeData>) => {
    event.stopPropagation();
    markSelectedNode(nodes, edges, node);
    onSelectedNodeChange(node.data.graphNode);
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

  return (
    <Box sx={{ flex: 1, "& .react-flow__attribution": { display: "none" } }}>
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          selectNodesOnDrag={false}
          fitView
        >
          <Controls />
        </ReactFlow>
      )}
    </Box>
  );
};

export const TraceGraph = memo(TraceGraphImpl);
