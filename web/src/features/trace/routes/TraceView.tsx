import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";

import { TraceGraph } from "../components/TraceGraph";
import { TraceTags } from "../components/TraceTags";
import { TraceTimeline } from "../components/TraceTimeline";

export const TraceView = () => {
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
          <TraceGraph />
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
