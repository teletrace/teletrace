import AdapterDateFns from "@date-io/date-fns";
import { LocalizationProvider } from "@mui/lab";
import { Divider, SliderValueLabel, Stack } from "@mui/material";
import { Fragment, useState } from "react";

import { Head } from "@/components/Head";

import { DateTimeSelector } from "../components/DateTimeSelector/DateTimeSelector";
import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { TimeFrameSelector } from "../components/TimeFrameSelector";
import { Timeframe } from "../types/common";

export const SpanSearch = () => {
  const [timeframe, setTimeFrame] = useState<Timeframe>();

  return (
    <Fragment>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack direction="row" justifyContent="flex-end">
        <TimeFrameSelector
          onChange={(timeframe) => {
            setTimeFrame(timeframe);
            console.log("start time: " + timeframe.startTime);
            console.log("end time: " + timeframe.endTime);
          }}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ height: "100%" }}
      >
        <aside style={{ display: "flex", maxHeight: "100%" }}>
          <TagSidebar />
        </aside>

        <Stack
          direction="column"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          sx={{ height: "100%" }}
        >
          <SearchBar />
          <SpanTable timeframe={{ startTime: 0, endTime: 0 }} />
        </Stack>
      </Stack>
    </Fragment>
  );
};
