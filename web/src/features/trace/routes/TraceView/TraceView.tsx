import { Alert, Box, CircularProgress, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Params, useParams } from "react-router-dom";

import { Head } from "@/components/Head";
import { InternalSpan } from "@/types/span";

import { useTraceQuery } from "../../api/traceQuery";
import { SPANS_MOCK } from "../../components/spans-mock";
import { TRACE_MOCK } from "../../components/trace-mock";
import { TraceGraph } from "../../components/TraceGraph";
import { ServiceSpansList } from "../../components/TraceTags/ServiceSpansList/ServiceSpansList";
import { TraceTimeline } from "../../components/TraceTimeline";
import { trace_res } from "../../types/TraceViewMock";
import { styles } from "./styles";

interface TraceViewUrlParams extends Params {
  traceId: string;
}

export const TraceView = () => {
  const { traceId } = useParams();
  if (traceId) {
    return <ProductionTraceView />;
  }
  // Temporary for development with mock data
  return <MockDataTraceView />;
};

const ProductionTraceView = () => {
  const { traceId } = useParams() as TraceViewUrlParams;
  const { isLoading, data: trace, error } = useTraceQuery(traceId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedNode, setSelectedNode] = useState({});

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
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent="space-between"
          flex={1}
        >
          <TraceGraph setSelectedNode={setSelectedNode} spans={trace} />
          <ServiceSpansList spans={SPANS_MOCK} />
        </Stack>
        <Stack divider={<Divider orientation="vertical" flexItem />} flex={1}>
          <TraceTimeline trace={trace} />
        </Stack>
      </Stack>
    </>
  );
};

const MockDataTraceView = () => {
  const [trace, setTrace] = useState<InternalSpan[] | null>(null);
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

  useEffect(() => {
    setTrace(TRACE_MOCK);
  }, []);

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
