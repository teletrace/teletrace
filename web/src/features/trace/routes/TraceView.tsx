import { Box, Container, Divider, Toolbar } from "@mui/material";
import { Stack } from "@mui/system";

import { MainLayout } from "@/components/Layout";

import { TraceGraph } from "../components/TraceGraph";
import { TraceTags } from "../components/TraceTags";
import { TraceTimeline } from "../components/TraceTimeline";

export const TraceView = () => {
  return (
    <MainLayout title="Trace View">
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Stack
            direction="column"
            divider={<Divider orientation="horizontal" flexItem />}
            spacing={2}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <TraceGraph />
              <TraceTags />
            </Stack>

            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <TraceTimeline />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </MainLayout>
  );
};
