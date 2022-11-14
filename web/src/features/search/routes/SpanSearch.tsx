import AdapterDateFns from "@date-io/date-fns";
import { LocalizationProvider } from "@mui/lab";
import { Divider, SliderValueLabel, Stack } from "@mui/material";
import { Fragment, useState } from "react";

import { Head } from "@/components/Head";

import { DateTimeSelector } from "../components/DateTimeSelector/DateTimeSelector";
import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { TimeFrame, TimeFrameSelector } from "../components/TimeFrameSelector";
import { Timeframe } from "../types/spanQuery";

export const SpanSearch = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>();

  return (
    <Fragment>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack direction="row" justifyContent="flex-end">
        <TimeFrameSelector
          onChange={(tf) => {
            console.log(tf);
            setTimeFrame(tf);
          }}
          options={[
            // {
            //   label: "Custom",
            //   startTime: new Date(),
            //   endTime: new Date(),
            // },
            { label: "1H", offsetRange: "1h", relativeTo: "now" },
            { label: "1D", offsetRange: "1d", relativeTo: "now" },
            { label: "3D", offsetRange: "3d", relativeTo: "now" },
          ]}
        />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ height: "100%" }}>
        <aside style={{ width: 320 }}>
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
