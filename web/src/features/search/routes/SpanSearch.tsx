import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";

import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable/index";
import { SearchFilter, Timeframe } from "../types/spanQuery";

export const SpanSearch = () => {
  const now = new Date().valueOf();
  const hourInMillis = 60 * 60 * 1000;
  const defaultTimeframe: Timeframe = { startTime: now - hourInMillis, endTime: now };

  return (
    <>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack
        direction="row"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Stack
          direction="column"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          justifyContent="space-between"
          sx={{ minHeight: "0" }}
          flex={1}
        >
          <SearchBar />          
          <SpanTable timeframe={defaultTimeframe} />
        </Stack>
      </Stack>
    </>
  );
};
