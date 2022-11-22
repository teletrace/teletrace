import { useEffect, useState } from "react";

import TimelineViewer from "./TimelineViewer";
import { FETCHED_STATE } from "./utils/constants.js";
import { transformTraceData } from "./utils/trace";

export function TraceTimeline({ trace }) {
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [traceData, setTraceData] = useState({});
  const [traceState, setTraceState] = useState({
    childrenHiddenIDs: new Set(),
    detailStates: new Map(),
    hoverIndentGuideIds: new Set(),
    jumpToSpan: null,
    spanNameColumnWidth: 0.25,
  });

  useEffect(() => {
    const loadTrace = async () => {
      setTraceData({ state: FETCHED_STATE.LOADING });
      if (!trace) {
        setTraceData({
          error: new Error("Invalid trace data received."),
          state: FETCHED_STATE.ERROR,
        });
      } else {
        setTraceData({
          data: transformTraceData(trace),
          state: FETCHED_STATE.DONE,
        });
      }
    };

    loadTrace();
  }, []);

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
      trace={traceData}
      activeSpan={selectedSpan?.spanID}
      setActiveTimelineState={setSelectedSpan}
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
