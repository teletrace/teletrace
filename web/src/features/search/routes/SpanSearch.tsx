/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { Head } from "@/components/Head";
import { useSpanSearchStore } from "@/stores/spanSearchStore";

import { LiveSpanSwitch } from "../components/LiveSpansSwitch";
import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable";
import { TagSidebar } from "../components/TagSidebar";
import { TimeFrameSelector } from "../components/TimeFrameSelector";

export const SpanSearch = () => {
  const { liveSpansState, timeframeState } = useSpanSearchStore((state) => state);

  useEffect(() => {
    if (liveSpansState.isOn) {
      timeframeState.setRelativeTimeframe(
        timeframeState.currentTimeframe.startTimeUnixNanoSec
      );
    }
  }, [liveSpansState.isOn]);

  return (
    <Stack display="flex" flexDirection="column" sx={{ height: "100%" }}>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack
        sx={{ paddingBottom: "12px", paddingTop: "24px" }}
        display="flex"
        flexDirection="row"
      >
        <Typography variant="h5" fontWeight="600">
          Spans
        </Typography>
        <Stack marginLeft="auto" direction="row">
          <Stack sx={{ paddingRight: "24px", justifyContent: "center" }}>
            <TimeFrameSelector />
          </Stack>
          <LiveSpanSwitch />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ height: "100%", minWidth: 0, minHeight: 0 }}
      >
        <aside style={{ display: "flex", maxHeight: "100%" }}>
          <TagSidebar />
        </aside>

        <Stack
          direction="column"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          sx={{ height: "100%", width: "100%", minWidth: 0 }}
        >
          <SearchBar />
          <SpanTable />
        </Stack>
      </Stack>
    </Stack>
  );
};
