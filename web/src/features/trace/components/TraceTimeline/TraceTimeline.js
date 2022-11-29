import { useMemo, useState } from "react";

import TimelineViewer from "./TimelineViewer";
import { transformTraceData } from "./utils/trace";

export function TraceTimeline({ trace, selectedSpanId }) {
  const [traceState, setTraceState] = useState({
    childrenHiddenIDs: new Set(),
    detailStates: new Map(),
    hoverIndentGuideIds: new Set(),
    jumpToSpan: null,
    spanNameColumnWidth: 0.25,
  });

  const transformedTrace = useMemo(() => transformTraceData(trace), [trace]);

  const setColumnWidth = (width) => {
    const newTraceState = { ...traceState, spanNameColumnWidth: width };
    setTraceState(newTraceState);
  };

  const removeHoverIndentGuideId = (spanID) => {
    const newHoverIndentGuideIds = new Set(traceState.hoverIndentGuideIds);
    newHoverIndentGuideIds.delete(spanID);

    const newTraceState = {
      ...traceState,
      hoverIndentGuideIds: newHoverIndentGuideIds,
    };
    setTraceState(newTraceState);
  };

  const setTrace = (trace) => {
    const { traceID } = trace;
    if (traceID === traceState.traceID) {
      return;
    }
    // preserve spanNameColumnWidth when resetting state
    const { spanNameColumnWidth } = traceState;
    const childrenHiddenIDs = new Set();
    const detailStates = new Map();
    const newTraceState = {
      ...traceState,
      childrenHiddenIDs,
      detailStates,
      spanNameColumnWidth,
      traceID,
    };
    setTraceState(newTraceState);
  };

  const removeJumpToSpan = () => {
    const newTraceState = { ...traceState, jumpToSpan: null };
    setTraceState(newTraceState);
  };

  const childrenToggle = (spanID) => {
    const childrenHiddenIDs = new Set(traceState.childrenHiddenIDs);
    if (childrenHiddenIDs.has(spanID)) {
      childrenHiddenIDs.delete(spanID);
    } else {
      childrenHiddenIDs.add(spanID);
    }
    const newTraceState = { ...traceState, childrenHiddenIDs };
    setTraceState(newTraceState);
  };

  const addHoverIndentGuideId = (spanID) => {
    const newHoverIndentGuideIds = new Set(traceState.hoverIndentGuideIds);
    newHoverIndentGuideIds.add(spanID);

    const newTraceState = {
      ...traceState,
      hoverIndentGuideIds: newHoverIndentGuideIds,
    };
    setTraceState(newTraceState);
  };

  return (
    <TimelineViewer
      trace={transformedTrace}
      selectedSpanId={selectedSpanId}
      setColumnWidth={setColumnWidth}
      removeHoverIndentGuideId={removeHoverIndentGuideId}
      setTrace={setTrace}
      removeJumpToSpan={removeJumpToSpan}
      childrenToggle={childrenToggle}
      traceState={traceState}
      addHoverIndentGuideId={addHoverIndentGuideId}
    />
  );
}
