import DetailState from "../components/TracePage/TraceTimelineViewer/SpanDetail/DetailState";
import TNil from "./TNil";

type TTraceTimeline = {
  childrenHiddenIDs: Set<string>;
  detailStates: Map<string, DetailState>;
  hoverIndentGuideIds: Set<string>;
  shouldScrollToFirstUiFindMatch: boolean;
  spanNameColumnWidth: number;
  traceID: string | TNil;
};

// eslint-disable-next-line no-undef
export default TTraceTimeline;
