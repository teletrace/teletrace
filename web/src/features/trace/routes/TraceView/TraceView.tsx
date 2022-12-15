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

import { Alert, Box, CircularProgress, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Params, useParams, useSearchParams } from "react-router-dom";

import { Head } from "@/components/Head";
import { InternalSpan } from "@/types/span";

import { useTraceQuery } from "../../api/traceQuery";
import { SpanDetailsList } from "../../components/SpanDetailsList";
import { TraceGraph } from "../../components/TraceGraph";
import { GraphNode } from "../../components/TraceGraph/types";
import { TraceTimeline } from "../../components/TraceTimeline";
import { styles } from "./styles";

interface TraceViewUrlParams extends Params {
  traceId: string;
}

function getRootSpan(spans: InternalSpan[]) {
  return spans.find((span) => !span.span.parentSpanId);
}

export const TraceView = () => {
  const { traceId } = useParams() as TraceViewUrlParams;
  const { isLoading, isError, data: trace } = useTraceQuery(traceId);

  const [initiallyFocusedSpanId, setInitiallyFocusedSpanId] =
    useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (initiallyFocusedSpanId) {
      return;
    }
    const urlSpanId = searchParams.get("spanId");
    if (urlSpanId) {
      setSelectedSpanId(urlSpanId);
      setInitiallyFocusedSpanId(urlSpanId);
    } else if (trace) {
      const rootSpan = getRootSpan(trace);
      setInitiallyFocusedSpanId(rootSpan?.span.spanId ?? null);
    }
  }, [searchParams, trace, initiallyFocusedSpanId]);

  const handleSelectedNodeChange = (node: GraphNode | null) => {
    setSelectedNode(node);
    if (!node) {
      setSelectedSpanId(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={styles.spinnerWrapper}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !trace || trace.length === 0) {
    return (
      <Alert variant="outlined" severity="error" sx={styles.errorAlert}>
        {`Error loading trace view (traceId=${traceId})
          The trace might not exist or the API is unavailable.`}
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
          flex={1}
          spacing={2}
          direction="row"
          sx={styles.graphSpanDetailsContainer}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <TraceGraph
            setSelectedNode={handleSelectedNodeChange}
            spans={trace}
            initiallyFocusedSpanId={initiallyFocusedSpanId}
          />
          <SpanDetailsList
            spans={selectedNode?.spans}
            selectedSpanId={selectedSpanId}
            setSelectedSpanId={setSelectedSpanId}
          />
        </Stack>
        <Stack
          sx={styles.timelineWrapper}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <TraceTimeline trace={trace} selectedSpanId={selectedSpanId} />
        </Stack>
      </Stack>
    </>
  );
};
