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
      selectedSpanId,
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
          selectedSpanId={selectedSpanId}
        />
      </div>
    );
  }
}

export { TraceTimelineViewerImpl };
export default TraceTimelineViewerImpl;
