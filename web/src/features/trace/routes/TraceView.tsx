import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";

import { Head } from "@/components/Head";
import { InternalSpan } from "@/types/span";

import { SPANS_MOCK } from "../components/spans-mock";
import { TraceGraph } from "../components/TraceGraph/TraceGraph";
import { ServiceSpansList } from "../components/TraceTags/ServiceSpansList/ServiceSpansList";
import { TraceTimeline } from "../components/TraceTimeline";
import { trace_res } from "../types/TraceViewMock";

export const TraceView = () => {
  const [selectedNode, setSelectedNode] = useState({});
  const [spans, setSpans] = useState<InternalSpan[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setSpans(trace_res.spans);
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
          <TraceGraph setSelectedNode={setSelectedNode} spans={spans} />
          <ServiceSpansList spans={SPANS_MOCK} />
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
