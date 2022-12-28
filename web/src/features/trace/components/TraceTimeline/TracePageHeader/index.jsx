/*
Copyright (c) 2017 Uber Technologies, Inc.
Modifications copyright (C) 2022 Cisco Systems, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Button } from "@mui/material";
import dayjs from "dayjs";

// eslint-disable-next-line import/no-cycle
import LabeledList from "../LabeledList.jsx";
import { ONE_MILLISECOND, formatDuration } from "../utils/date.jsx";
import SpanGraph from "./SpanGraph/index.jsx";
import "./styles.css";

export const HEADER_ITEMS = [
  {
    key: "timestamp",
    label: "Trace Start",
    renderer: (trace) => (
      <span>
        {dayjs(trace.startTime / ONE_MILLISECOND).format("MMM DD, YYYY")}
        &nbsp;&nbsp;
        {dayjs(trace.startTime / ONE_MILLISECOND).format("HH:mm:ss")}
      </span>
    ),
  },
  {
    key: "duration",
    label: "Duration",
    renderer: (trace) => formatDuration(trace.duration),
  },
];

export function TracePageHeaderFn(props) {
  const { trace, updateNextViewRangeTime, updateViewRangeTime, viewRange } =
    props;

  const { current } = viewRange.time;
  const [viewStart, viewEnd] = current;

  if (!trace) {
    return null;
  }

  const summaryItems = HEADER_ITEMS.map((item) => {
    const { renderer, ...rest } = item;
    return { ...rest, value: renderer(trace) };
  });

  return (
    <header className="TracePageHeader">
      <div className="TracePageHeader--titleRow">
        <LabeledList
          className="TracePageHeader--overviewItems"
          items={summaryItems}
        />
        {(viewStart !== 0 || viewEnd !== 1) && (
          <Button
            disableFocusRipple
            disableElevation
            disableRipple
            variant="text"
            onClick={() => updateViewRangeTime(0, 1)}
          >
            Reset Selection
          </Button>
        )}
      </div>

      <SpanGraph
        trace={trace}
        viewRange={viewRange}
        updateNextViewRangeTime={updateNextViewRangeTime}
        updateViewRangeTime={updateViewRangeTime}
      />
    </header>
  );
}

export default TracePageHeaderFn;
