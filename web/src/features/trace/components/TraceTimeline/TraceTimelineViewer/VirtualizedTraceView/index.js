/*
Copyright (c) 2017 Uber Technologies, Inc.
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

import cx from "classnames";
import * as React from "react";

import colorGenerator from "../../utils/color-generator.js";
import {
  createViewedBoundsFunc,
  findServerChildSpan,
  isColdStartSpan,
  isErrorSpan,
} from "../../utils/index.js";
import ListView from "./ListView/index.js";
import SpanBarRow from "./SpanBarRow.js";

import "./styles.css";

const DEFAULT_HEIGHTS = {
  bar: 30,
  detail: 161,
  detailWithLogs: 197,
};

function generateRowStates(spans, { childrenHiddenIDs, detailStates }) {
  if (!spans) {
    return [];
  }
  let collapseDepth = null;
  const rowStates = [];

  for (let i = 0; i < spans.length; i += 1) {
    const span = spans[i];
    const { spanID, depth } = span;
    let hidden = false;
    if (collapseDepth != null) {
      if (depth >= collapseDepth) {
        hidden = true;
      } else {
        collapseDepth = null;
      }
    }
    if (hidden) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (childrenHiddenIDs.has(spanID)) {
      collapseDepth = depth + 1;
    }
    rowStates.push({
      isSelected: false,
      isDetail: false,
      span,
      spanIndex: i,
    });
    if (detailStates.has(spanID)) {
      rowStates.push({
        isDetail: true,
        span,
        spanIndex: i,
      });
    }
  }
  return rowStates;
}

function getCssClasses(currentViewRange) {
  const [zoomStart, zoomEnd] = currentViewRange;
  return cx({
    "clipping-left": zoomStart > 0,
    "clipping-right": zoomEnd < 1,
  });
}

class VirtualizedTraceViewImpl extends React.Component {
  clippingCssClasses;

  listView;

  rowStates;

  getViewedBounds;

  constructor(props) {
    super(props);
    // keep "prop derivations" on the instance instead of calculating in
    // `.render()` to avoid recalculating in every invocation of `.renderRow()`
    this.selectedSpanRef = null;
    const { trace, currentViewRangeTime } = props;
    this.clippingCssClasses = getCssClasses(currentViewRangeTime);
    const [zoomStart, zoomEnd] = currentViewRangeTime;
    this.getViewedBounds = createViewedBoundsFunc({
      max: trace.endTime,
      min: trace.startTime,
      viewEnd: zoomEnd,
      viewStart: zoomStart,
    });

    this.rowStates = generateRowStates(trace.spans, props.traceState);
    props.setTrace(trace);
  }

  UNSAFE_componentWillUpdate({
    currentViewRangeTime: nextViewRangeTime,
    registerAccessors: nextRegisterAccessors,
    childrenHiddenIDs: nextChildrenHiddenIDs,
  }) {
    const { registerAccessors, currentViewRangeTime, trace, traceState } =
      this.props;
    const { detailStates } = traceState;
    this.rowStates = generateRowStates(trace.spans, {
      childrenHiddenIDs: nextChildrenHiddenIDs,
      detailStates,
    });

    if (currentViewRangeTime !== nextViewRangeTime) {
      this.clippingCssClasses = getCssClasses(nextViewRangeTime);
      const [zoomStart, zoomEnd] = nextViewRangeTime;
      this.getViewedBounds = createViewedBoundsFunc({
        max: trace.endTime,
        min: trace.startTime,
        viewEnd: zoomEnd,
        viewStart: zoomStart,
      });
    }
    if (this.listView && registerAccessors !== nextRegisterAccessors) {
      nextRegisterAccessors(this.getAccessors());
    }
  }

  componentDidUpdate() {
    if (this.selectedSpanRef && this.selectedSpanRef.current) {
      const { removeJumpToSpan } = this.props;
      this.selectedSpanRef.current.scrollIntoView({ behavior: "auto" });
      removeJumpToSpan();
      this.selectedSpanRef = null;
    }
  }

  getAccessors() {
    const lv = this.listView;
    if (!lv) {
      throw new Error("ListView unavailable");
    }
    return {
      getBottomRowIndexVisible: lv.getBottomVisibleIndex,
      getCollapsedChildren: this.getCollapsedChildren,
      getRowPosition: lv.getRowPosition,
      getTopRowIndexVisible: lv.getTopVisibleIndex,
      getViewHeight: lv.getViewHeight,
      getViewRange: this.getViewRange,
      mapRowIndexToSpanIndex: this.mapRowIndexToSpanIndex,
      mapSpanIndexToRowIndex: this.mapSpanIndexToRowIndex,
    };
  }

  getViewRange = () => {
    const { currentViewRangeTime } = this.props;
    return currentViewRangeTime;
  };

  getCollapsedChildren = () => {
    const { traceState } = this.props;
    const { childrenHiddenIDs } = traceState;
    return childrenHiddenIDs;
  };

  mapRowIndexToSpanIndex = (index) => this.rowStates[index].spanIndex;

  mapSpanIndexToRowIndex = (index) => {
    const max = this.rowStates.length;
    for (let i = 0; i < max; i += 1) {
      const { spanIndex } = this.rowStates[i];
      if (spanIndex === index) {
        return i;
      }
    }
    throw new Error(`unable to find row for span index: ${index}`);
  };

  setListView = (listView) => {
    const isChanged = this.listView !== listView;
    this.listView = listView;
    if (listView && isChanged) {
      const { registerAccessors } = this.props;
      registerAccessors(this.getAccessors());
    }
  };

  getKeyFromIndex = (index) => {
    const { isDetail, span } = this.rowStates[index];
    return `${span.spanID}--${isDetail ? "detail" : "bar"}`;
  };

  getIndexFromKey = (key) => {
    const parts = key.split("--");
    const spanIDPart = parts[0];
    const isDetailPart = parts[1] === "detail";
    const max = this.rowStates.length;
    for (let i = 0; i < max; i += 1) {
      const { span, isDetail } = this.rowStates[i];
      if (span.spanID === spanIDPart && isDetail === isDetailPart) {
        return i;
      }
    }
    return -1;
  };

  getRowHeight = (index) => {
    const { span, isDetail } = this.rowStates[index];
    if (!isDetail) {
      return DEFAULT_HEIGHTS.bar;
    }
    if (Array.isArray(span.logs) && span.logs.length) {
      return DEFAULT_HEIGHTS.detailWithLogs;
    }
    return DEFAULT_HEIGHTS.detail;
  };

  renderRow = (key, style, index, attrs) => {
    const { span, spanIndex } = this.rowStates[index];
    return this.renderSpanBarRow(span, spanIndex, key, style, attrs);
  };

  renderSpanBarRow(span, spanIndex, key, style, attrs) {
    const { spanID } = span;
    const { serviceName } = span.process;
    const {
      trace,
      traceState,
      childrenToggle,
      removeHoverIndentGuideId,
      addHoverIndentGuideId,
    } = this.props;

    if (!trace) {
      return null;
    }
    const color = colorGenerator.getColorByKey(serviceName);
    const isCollapsed = traceState.childrenHiddenIDs.has(spanID);
    const isDetailExpanded = traceState.detailStates.has(spanID);
    const showErrorIcon = isErrorSpan(span);
    const showColdStartIcon = isColdStartSpan(span);

    // Check for direct child "server" span if the span is a "client" span.
    let rpc = null;
    if (isCollapsed) {
      const rpcSpan = findServerChildSpan(trace.spans.slice(spanIndex));
      if (rpcSpan) {
        const rpcViewBounds = this.getViewedBounds(
          rpcSpan.startTime,
          rpcSpan.startTime + rpcSpan.duration
        );
        rpc = {
          color: colorGenerator.getColorByKey(rpcSpan.process.serviceName),
          operationName: rpcSpan.operationName,
          serviceName: rpcSpan.process.serviceName,
          viewEnd: rpcViewBounds.end,
          viewStart: rpcViewBounds.start,
        };
      }
    }
    const { selectedSpanId } = this.props;
    return (
      <div
        className="VirtualizedTraceView--row"
        key={key}
        style={style}
        {...attrs}
      >
        <SpanBarRow
          className={this.clippingCssClasses}
          color={color}
          traceState={traceState}
          columnDivision={traceState.spanNameColumnWidth}
          hoverIndentGuideIds={traceState.hoverIndentGuideIds}
          removeHoverIndentGuideId={removeHoverIndentGuideId}
          addHoverIndentGuideId={addHoverIndentGuideId}
          isChildrenExpanded={!isCollapsed}
          isDetailExpanded={isDetailExpanded}
          onChildrenToggled={childrenToggle}
          rpc={rpc}
          showErrorIcon={showErrorIcon}
          showColdStartIcon={showColdStartIcon}
          getViewedBounds={this.getViewedBounds}
          traceStartTime={trace.startTime}
          span={span}
          selectedSpanId={selectedSpanId}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="VirtualizedTraceView--spans">
        <ListView
          ref={this.setListView}
          dataLength={this.rowStates.length}
          itemHeightGetter={this.getRowHeight}
          itemRenderer={this.renderRow}
          viewBuffer={3000}
          viewBufferMin={2000}
          itemsWrapperClassName="VirtualizedTraceView--rowsWrapper"
          getKeyFromIndex={this.getKeyFromIndex}
          getIndexFromKey={this.getIndexFromKey}
          windowScroller
        />
      </div>
    );
  }
}

export default VirtualizedTraceViewImpl;
