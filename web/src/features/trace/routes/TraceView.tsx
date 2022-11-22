import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Head } from "@/components/Head";
import { InternalSpan } from "@/types/span";

import { SPANS_MOCK } from "../components/spans-mock";
import { TRACE_MOCK } from "../components/trace-mock";
import { TraceGraph } from "../components/TraceGraph";
import { ServiceSpansList } from "../components/TraceTags/ServiceSpansList/ServiceSpansList";
import { TraceTimeline } from "../components/TraceTimeline";
import { trace_res } from "../types/TraceViewMock";

export const TraceView = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { traceId } = useParams(); // trace ID
  const [trace, setTrace] = useState<InternalSpan[] | null>(null);
  const [selectedNode, setSelectedNode] = useState({});
  const [spans, setSpans] = useState<InternalSpan[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setSpans(trace_res.spans);
    }, 1000);
  }, []);

  useEffect(() => {
    setTrace(TRACE_MOCK);
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
          <TraceGraph setSelectedNode={setSelectedNode} spans={spans} />
          <ServiceSpansList spans={SPANS_MOCK} />
        </Stack>
        <Stack divider={<Divider orientation="vertical" flexItem />} flex={1}>
          {trace && <TraceTimeline trace={trace} />}
        </Stack>
      </Stack>
    </>
  );
};
