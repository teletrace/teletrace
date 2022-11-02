import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";
import { Timeframe } from "@/types/spans/spanQuery";

import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";

export const SpanSearch = () => {
  const now = new Date().valueOf();
  const hourInMillis = 60 * 60 * 1000;
  const defaultTimeframe: Timeframe = {
    startTime: now - hourInMillis,
    endTime: now,
  };

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
      >
        <Stack
          direction="column"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          flex={1}
        >
          <SearchBar />
          <SpanTable timeframe={defaultTimeframe} />
        </Stack>
      </Stack>
    </>
  );
};
