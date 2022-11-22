import { PureComponent } from "react";

// eslint-disable-next-line import/no-cycle
import TimelineHeaderRow from "./TimelineHeaderRow/index.js";
import VirtualizedTraceView from "./VirtualizedTraceView/index.js";

import "./styles.css";

const NUM_TICKS = 4;

/**
 * `TraceTimelineViewer` now renders the header row because it is sensitive to
 * `props.viewRange.time.cursor`. If `VirtualizedTraceView` renders it, it will
 * re-render the ListView every time the cursor is moved on the trace minimap
 * or `TimelineHeaderRow`.
 */
class TraceTimelineViewerImpl extends PureComponent {
  render() {
    const {
      updateNextViewRangeTime,
      updateViewRangeTime,
      viewRange,
      setColumnWidth,
      traceState,
      removeHoverIndentGuideId,
      setTrace,
      removeJumpToSpan,
      childrenToggle,
      addHoverIndentGuideId,
      setActiveTimelineState,
      activeSpan,
      ...rest
    } = this.props;
    const { trace } = rest;
    return (
      <div className="TraceTimelineViewer">
        <TimelineHeaderRow
          duration={trace.duration}
          numTicks={NUM_TICKS}
          onColummWidthChange={setColumnWidth}
          setColumnWidth={setColumnWidth}
          viewRangeTime={viewRange.time}
          updateNextViewRangeTime={updateNextViewRangeTime}
          updateViewRangeTime={updateViewRangeTime}
          traceState={traceState}
        />
        <VirtualizedTraceView
          {...rest}
          traceState={traceState}
          detailStates={traceState}
          childrenHiddenIDs={traceState.childrenHiddenIDs}
          currentViewRangeTime={viewRange.time.current}
          setTrace={setTrace}
          removeJumpToSpan={removeJumpToSpan}
          childrenToggle={childrenToggle}
          removeHoverIndentGuideId={removeHoverIndentGuideId}
          addHoverIndentGuideId={addHoverIndentGuideId}
          setActiveTimelineState={setActiveTimelineState}
          activeSpan={activeSpan}
        />
      </div>
    );
  }
}

export { TraceTimelineViewerImpl };
export default TraceTimelineViewerImpl;
