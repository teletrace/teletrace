import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";
import { SpanTable } from "../components/SpanTable/SpanTable";

export const SpanSearch = () => {
  return (
    <>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
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
          sx={{ minHeight: "0" }}
          flex={1}
        >
          <SpanTable />
        </Stack>

        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        ></Stack>
      </Stack>
    </>
  );
};
