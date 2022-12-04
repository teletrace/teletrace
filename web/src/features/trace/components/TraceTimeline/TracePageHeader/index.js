import { Button } from "@mui/material";
import dayjs from "dayjs";

// eslint-disable-next-line import/no-cycle
import LabeledList from "../LabeledList.js";
import { ONE_MILLISECOND, formatDuration } from "../utils/date.js";
import SpanGraph from "./SpanGraph/index.js";
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
