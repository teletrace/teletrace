import { Alert, Box, CircularProgress, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { Params, useParams } from "react-router-dom";

import { Head } from "@/components/Head";

import { useTraceQuery } from "../../api/traceQuery";
import { SpanDetailsList } from "../../components/SpanDetailsList";
import { TraceGraph } from "../../components/TraceGraph";
import { GraphNode } from "../../components/TraceGraph/Graph/types";
import { TraceTimeline } from "../../components/TraceTimeline";
import { styles } from "./styles";

interface TraceViewUrlParams extends Params {
  traceId: string;
}

export const TraceView = () => {
  const { traceId } = useParams() as TraceViewUrlParams;
  const { isLoading, data: trace, error } = useTraceQuery(traceId);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  if (isLoading) {
    return (
      <Box sx={styles.spinnerWrapper}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !trace) {
    return (
      <Alert variant="outlined" severity="error">
        Error loading trace view. Please try to refresh the page
      </Alert>
    );
  }
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
          flex={3}
          spacing={2}
          direction="row"
          sx={styles.graphSpanDetailsContainer}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <TraceGraph setSelectedNode={setSelectedNode} spans={trace} />
          <SpanDetailsList spans={selectedNode?.spans} />
        </Stack>
        <Stack flex={1} divider={<Divider orientation="vertical" flexItem />}>
          <TraceTimeline trace={trace} />
        </Stack>
      </Stack>
    </>
  );
};
