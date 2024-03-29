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

import cx from "classnames";
import * as React from "react";

// eslint-disable-next-line import/no-cycle
import { VIEW_MIN_RANGE } from "../../TimelineViewer.js";
import DraggableManager from "../../utils/DraggableManager.js";

/**
 * Map from a sub range to the greater view range, e.g, when the view range is
 * the middle half ([0.25, 0.75]), a value of 0.25 befomes 3/8.
 * @returns {number}
 */
function mapFromViewSubRange(viewStart, viewEnd, value) {
  return viewStart + value * (viewEnd - viewStart);
}

/**
 * Map a value from the view ([0, 1]) to a sub-range, e.g, when the view range is
 * the middle half ([0.25, 0.75]), a value of 3/8 becomes 1/4.
 * @returns {number}
 */
function mapToViewSubRange(viewStart, viewEnd, value) {
  return (value - viewStart) / (viewEnd - viewStart);
}

/**
 * Get the layout for the "next" view range time, e.g. the difference from the
 * drag start and the drag end. This is driven by `shiftStart`, `shiftEnd` or
 * `reframe` on `props.viewRangeTime`, not by the current state of the
 * component. So, it reflects in-progress dragging from the span minimap.
 */
function getNextViewLayout(start, position) {
  let [left, right] = start < position ? [start, position] : [position, start];
  if (left >= 1 || right <= 0) {
    return { isOutOfView: true };
  }
  if (left < 0) {
    left = 0;
  }
  if (right > 1) {
    right = 1;
  }
  return {
    isDraggingLeft: start > position,
    left: `${left * 100}%`,
    width: `${(right - left) * 100}%`,
  };
}

/**
 * Render the visual indication of the "next" view range.
 */
function getMarkers(viewStart, viewEnd, from, to, isShift) {
  const mappedFrom = mapToViewSubRange(viewStart, viewEnd, from);
  const mappedTo = mapToViewSubRange(viewStart, viewEnd, to);
  const layout = getNextViewLayout(mappedFrom, mappedTo);
  if (layout.isOutOfView) {
    return null;
  }
  const { isDraggingLeft, left, width } = layout;
  const cls = cx({
    isDraggingLeft,
    isDraggingRight: !isDraggingLeft,
    isReframeDrag: !isShift,
    isShiftDrag: isShift,
  });
  return (
    <div
      className={`TimelineViewingLayer--dragged ${cls}`}
      style={{ left, width }}
    />
  );
}

/**
 * `TimelineViewingLayer` is rendered on top of the TimelineHeaderRow time
 * labels; it handles showing the current view range and handles mouse UX for
 * modifying it.
 */
export default class TimelineViewingLayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this._draggerReframe = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleReframeDragEnd,
      onDragMove: this._handleReframeDragUpdate,
      onDragStart: this._handleReframeDragUpdate,
      onMouseLeave: this._handleReframeMouseLeave,
      onMouseMove: this._handleReframeMouseMove,
    });
    this._root = undefined;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { boundsInvalidator } = this.props;
    if (boundsInvalidator !== nextProps.boundsInvalidator) {
      this._draggerReframe.resetBounds();
    }
  }

  componentWillUnmount() {
    this._draggerReframe.dispose();
  }

  _setRoot = (elm) => {
    this._root = elm;
  };

  _getDraggingBounds = () => {
    if (!this._root) {
      throw new Error("invalid state");
    }
    const { left: clientXLeft, width } = this._root.getBoundingClientRect();
    return { clientXLeft, width };
  };

  _handleReframeMouseMove = ({ value }) => {
    const { viewRangeTime, updateNextViewRangeTime } = this.props;
    const { current } = viewRangeTime;
    const [viewStart, viewEnd] = current;
    const cursor = mapFromViewSubRange(viewStart, viewEnd, value);
    updateNextViewRangeTime({ cursor });
  };

  _handleReframeMouseLeave = () => {
    const { updateNextViewRangeTime } = this.props;
    updateNextViewRangeTime({ cursor: undefined });
  };

  _handleReframeDragUpdate = ({ value }) => {
    const { viewRangeTime, updateNextViewRangeTime } = this.props;
    const { current, reframe } = viewRangeTime;
    const [viewStart, viewEnd] = current;
    const shift = mapFromViewSubRange(viewStart, viewEnd, value);
    const anchor = reframe ? reframe.anchor : shift;
    const update = { reframe: { anchor, shift } };
    updateNextViewRangeTime(update);
  };

  _handleReframeDragEnd = ({ value }) => {
    const { viewRangeTime, updateViewRangeTime } = this.props;
    const { current, reframe } = viewRangeTime;
    const [viewStart, viewEnd] = current;
    const shift = mapFromViewSubRange(viewStart, viewEnd, value);
    const anchor = reframe ? reframe.anchor : shift;
    let [start, end] = shift < anchor ? [shift, anchor] : [anchor, shift];

    if (start === end) {
      start -= VIEW_MIN_RANGE / 2;
      end += VIEW_MIN_RANGE / 2;
    }

    if (start < 0) {
      start = 0;
      end = start + VIEW_MIN_RANGE;
    }
    if (end > 1) {
      end = 1;
      start = end - VIEW_MIN_RANGE;
    }

    // manager.resetBounds()
    updateViewRangeTime(start, end, "timeline-header");
  };

  render() {
    const { viewRangeTime } = this.props;
    const { current, cursor, reframe, shiftEnd, shiftStart } = viewRangeTime;
    const [viewStart, viewEnd] = current;
    const haveNextTimeRange =
      reframe != null || shiftEnd != null || shiftStart != null;
    let cusrorPosition;
    if (
      !haveNextTimeRange &&
      cursor != null &&
      cursor >= viewStart &&
      cursor <= viewEnd
    ) {
      cusrorPosition = `${
        mapToViewSubRange(viewStart, viewEnd, cursor) * 100
      }%`;
    }
    return (
      <div
        aria-hidden
        className="TimelineViewingLayer"
        ref={this._setRoot}
        onMouseDown={this._draggerReframe.handleMouseDown}
        onMouseLeave={this._draggerReframe.handleMouseLeave}
        onMouseMove={this._draggerReframe.handleMouseMove}
      >
        {cusrorPosition != null && (
          <div
            className="TimelineViewingLayer--cursorGuide"
            style={{ left: cusrorPosition }}
          />
        )}
        {reframe != null &&
          getMarkers(viewStart, viewEnd, reframe.anchor, reframe.shift, false)}
        {shiftEnd != null &&
          getMarkers(viewStart, viewEnd, viewEnd, shiftEnd, true)}
        {shiftStart != null &&
          getMarkers(viewStart, viewEnd, viewStart, shiftStart, true)}
      </div>
    );
  }
}
