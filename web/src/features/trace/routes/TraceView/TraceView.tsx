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

import ReactSplit, { SplitDirection } from "@devbookhq/splitter";
import { Alert, Box, CircularProgress, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Params, useParams, useSearchParams } from "react-router-dom";

import { Head } from "@/components/Head";
import { eventType, sendEvent, useSystemInfo } from "@/features/usageAnalytics";
import { InternalSpan } from "@/types/span";

import { useTraceQuery } from "../../api/traceQuery";
import { SpanDetailsList } from "../../components/SpanDetailsList";
import { TraceGraph } from "../../components/TraceGraph";
import { GraphNode } from "../../components/TraceGraph/types";
import { TraceTimeline } from "../../components/TraceTimeline";
import { styles } from "./styles";
import "./styles.css";

interface TraceViewUrlParams extends Params {
  traceId: string;
}

function getRootSpan(spans: InternalSpan[]) {
  return spans.find((span) => !span.span.parentSpanId);
}

export const TraceView = () => {
  const { traceId } = useParams() as TraceViewUrlParams;
  const { isLoading, isError, data: trace } = useTraceQuery(traceId);
  const { data: systemInfo } = useSystemInfo();
  const [initiallyFocusedSpanId, setInitiallyFocusedSpanId] = useState<
    string | null
  >(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (systemInfo?.systemId && systemInfo?.usageReportingEnabled) {
      sendEvent(systemInfo.systemId, eventType.trace_viewed, { traceId });
    }
  }, [systemInfo?.systemId, systemInfo?.usageReportingEnabled]);

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

  const [layoutSizes, setLayuotSizes] = useState([72, 28]);

  function handleTimelineResizeChange(gutterIdx: number, allSizes: number[]) {
    setLayuotSizes(allSizes);
  }

  const handleAutoSelectedNodeChange = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleGraphNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    setSelectedSpanId(null);
  }, []);

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
      <ReactSplit
        direction={SplitDirection.Vertical}
        initialSizes={layoutSizes}
        onResizeFinished={handleTimelineResizeChange}
        draggerClassName={"custom-dragger-horizontal"}
        gutterClassName={"custom-gutter-horizontal"}
      >
        <ReactSplit>
          <Stack
            direction="column"
            divider={<Divider orientation="horizontal" flexItem />}
            spacing={2}
            sx={{ height: "100%", overflow: "auto" }}
          >
            <Stack
              flex={1}
              spacing={2}
              direction="row"
              sx={styles.graphSpanDetailsContainer}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <TraceGraph
                spans={trace}
                selectedSpanId={selectedSpanId}
                initiallyFocusedSpanId={initiallyFocusedSpanId}
                onAutoSelectedNodeChange={handleAutoSelectedNodeChange}
                onGraphNodeClick={handleGraphNodeClick}
              />
              <SpanDetailsList
                spans={selectedNode?.spans}
                selectedSpanId={selectedSpanId}
                setSelectedSpanId={setSelectedSpanId}
              />
            </Stack>
          </Stack>
        </ReactSplit>
        <ReactSplit classes={["timeline-scroller"]}>
          <Stack
            sx={styles.timelineWrapper}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <TraceTimeline
              trace={trace}
              selectedSpanId={selectedSpanId}
              setSelectedSpanId={setSelectedSpanId}
            />
          </Stack>
        </ReactSplit>
      </ReactSplit>
    </>
  );
};
