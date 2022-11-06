import { Stack } from "@mui/material";
import { Fragment } from "react";

import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { Timeframe } from "../types/spanQuery";

import { Head } from "@/components/Head";

export const SpanSearch = () => {
  const now = new Date().valueOf();
  const hourInMillis = 60 * 60 * 1000;
  const defaultTimeframe: Timeframe = {
    startTime: now - hourInMillis,
    endTime: now,
  };

  return (
    <Fragment>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />

      <Stack direction="row" spacing={2}>
        <aside style={{ width: 320 }}>
          <TagSidebar />
        </aside>

        <Stack direction="column" spacing={2} flex={1}>
          <SearchBar />
          <SpanTable timeframe={defaultTimeframe} />
        </Stack>
      </Stack>
    </Fragment>
  );
};
