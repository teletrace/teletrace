import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Edge, Node } from "reactflow";

import { EdgeData, NodeData } from "@/components/Graph/types";
import {
  createGraphLayout,
  spansToGraphData,
} from "@/components/Graph/utils/layout";
import { Head } from "@/components/Head";

import { TraceGraph } from "../components/TraceGraph";
import { TraceTags } from "../components/TraceTags";
import { TraceTimeline } from "../components/TraceTimeline";
import { trace_res } from "../types/TraceViewMock";

export interface TraceData {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
}

export const TraceView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState({});
  const [traceData, setTraceData] = useState<TraceData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    setTimeout(() => {
      const { nodes, edges } = spansToGraphData(trace_res.spans);
      createGraphLayout(nodes, edges)
        .then((els: { nodes: Node<NodeData>[]; edges: Edge<EdgeData>[] }) => {
          if (els) {
            setTraceData(els);
            setIsLoading(false);
          }
        })
        .catch((e) => console.log(e));
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(selectedNode);
  }, [selectedNode]);

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
            isLoading={isLoading}
            setSelectedNode={setSelectedNode}
            traceData={traceData}
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
