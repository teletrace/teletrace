import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import {
  Edge,
  MarkerType,
  Node,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
} from "reactflow";

import {
  EdgeColor,
  EdgeData,
  NodeColor,
  NodeData,
} from "@/components/Graph/types";
import {
  BASIC_EDGE_TYPE,
  BASIC_NODE_TYPE,
  EDGE_ARROW_SIZE,
  POSITION,
} from "@/components/Graph/utils/global";
import { createGraphLayout } from "@/components/Graph/utils/layout";
import {
  updateEdgeStyle,
  updateNodeStyle,
} from "@/components/Graph/utils/utils";
import { Head } from "@/components/Head";

import { TraceGraph } from "../components/TraceGraph";
import { TraceTags } from "../components/TraceTags";
import { TraceTimeline } from "../components/TraceTimeline";

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/checkout",
      image: "IoTHTTP2Protocol",
      type: "Http",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
  {
    id: "2",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/invoices",
      image: "LambdaFunction",
      type: "Node.js",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
  {
    id: "3",
    type: BASIC_NODE_TYPE,
    data: {
      name: "update-subscription",
      image: "ApiGatewayEndpoint",
      type: "SNS",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
  {
    id: "4",
    type: BASIC_NODE_TYPE,
    data: {
      name: "/payment",
      image: "IoTHTTP2Protocol",
      type: "Http",
      color: NodeColor.NORMAL,
    },
    position: POSITION,
  },
];

const initialEdges: Edge<EdgeData>[] = [
  {
    id: "e1-2",
    type: BASIC_EDGE_TYPE,
    source: "1",
    target: "2",
    data: { time: "20ms", count: 2 },
    style: {
      stroke: EdgeColor.NORMAL,
      padding: 1,
      cursor: "default",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: EdgeColor.NORMAL,
    },
  },
  {
    id: "e2-3",
    type: BASIC_EDGE_TYPE,
    source: "2",
    target: "3",
    data: { time: "20ms" },
    style: {
      padding: 1,
      cursor: "default",
      stroke: EdgeColor.NORMAL,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: EdgeColor.NORMAL,
    },
  },
  {
    id: "e2-4",
    type: BASIC_EDGE_TYPE,
    source: "2",
    target: "4",
    data: { time: "20ms" },
    style: {
      stroke: EdgeColor.NORMAL,
      padding: 1,
      cursor: "default",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: EDGE_ARROW_SIZE,
      height: EDGE_ARROW_SIZE,
      color: EdgeColor.NORMAL,
    },
  },
];

export const TraceView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>([]);
  const [selectedNodeId, setSelectedNodeId] = useState("");
  useEffect(() => {
    setTimeout(() => {
      createGraphLayout(initialNodes, initialEdges)
        .then((els) => {
          if (els.nodes.length > 0) {
            setIsLoading(false);
            setNodes(els.nodes);
            setEdges(els.edges);
          }
        })
        .catch(() => alert("something went wrong!!! Could not render graph"));
    }, 1000);
  }, []);

  const onNodeClick = (event: ReactMouseEvent, node: Node<NodeData>) => {
    event.stopPropagation();
    setSelectedNodeId(node.id);
    const connectedEdges = getConnectedEdges([node], edges);
    setNodes(
      nodes.map((n: Node<NodeData>) =>
        n.id === node.id
          ? updateNodeStyle({ ...n }, true, NodeColor.SELECTED)
          : updateNodeStyle({ ...n }, false, NodeColor.NORMAL)
      )
    );
    setEdges(
      edges.map((e: Edge<EdgeData>) =>
        connectedEdges.includes(e)
          ? updateEdgeStyle({ ...e }, true, true, EdgeColor.SELECTED)
          : updateEdgeStyle({ ...e }, false, false, EdgeColor.NORMAL)
      )
    );
  };

  const onNodeMouseEnter = (event: ReactMouseEvent, node: Node<NodeData>) => {
    event.stopPropagation();
    if (!node.selected) {
      const connectedEdges = getConnectedEdges([node], edges);
      setNodes(
        nodes.map((n: Node<NodeData>) =>
          n.id === node.id
            ? updateNodeStyle({ ...n }, false, NodeColor.HOVER)
            : { ...n }
        )
      );
      setEdges(
        edges.map((e: Edge<EdgeData>) =>
          !e.selected && connectedEdges.includes(e)
            ? updateEdgeStyle({ ...e }, true, false, EdgeColor.HOVER)
            : { ...e }
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
          n.id === node.id
            ? updateNodeStyle({ ...n }, false, NodeColor.NORMAL)
            : { ...n }
        )
      );
      setEdges(
        edges.map((e: Edge<EdgeData>) =>
          !e.selected && connectedEdges.includes(e)
            ? updateEdgeStyle({ ...e }, false, false, EdgeColor.NORMAL)
            : { ...e }
        )
      );
    }
  };

  const onPaneClick = (event: ReactMouseEvent) => {
    event.stopPropagation();
    setSelectedNodeId("");
    setNodes(
      nodes.map((n: Node<NodeData>) =>
        updateNodeStyle({ ...n }, true, NodeColor.NORMAL)
      )
    );
    setEdges(
      edges.map((e: Edge<EdgeData>) =>
        updateEdgeStyle({ ...e }, false, false, EdgeColor.NORMAL)
      )
    );
  };

  return (
    <>
      <Head
        title="Trace View"
        description="Designated page to view trace's flow graph and timeline"
      />
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
        sx={{ height: "100%" }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent="space-between"
          flex={1}
        >
          <TraceGraph
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            isLoading={isLoading}
          />
          <TraceTags />
        </Stack>

        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          flex={1}
        >
          <TraceTimeline />
        </Stack>
      </Stack>
    </>
  );
};
