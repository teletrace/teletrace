/**
 * Copyright 2022 Epsagon
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

import cx from "classnames";
import * as React from "react";

// eslint-disable-next-line import/no-cycle
import { VIEW_MIN_RANGE } from "../../../TimelineViewer.js";
import DraggableManager, {
  updateTypes,
} from "../../../utils/DraggableManager.js";
import GraphTicks from "../GraphTicks.js";
import Scrubber from "../Scrubber/index.js";

import "./styles.css";

const dragTypes = {
  REFRAME: "REFRAME",
  SHIFT_END: "SHIFT_END",
  SHIFT_START: "SHIFT_START",
};

function getNextViewLayout(start, position) {
  const [left, right] =
    start < position ? [start, position] : [position, start];
  return {
    leadingX: `${position * 100}%`,
    width: `${(right - left) * 100}%`,
    x: `${left * 100}%`,
  };
}

class ViewingLayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this._draggerReframe = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleReframeDragEnd,
      onDragMove: this._handleReframeDragUpdate,
      onDragStart: this._handleReframeDragUpdate,
      onMouseLeave: this._handleReframeMouseLeave,
      onMouseMove: this._handleReframeMouseMove,
      tag: dragTypes.REFRAME,
    });

    this._draggerStart = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleScrubberDragEnd,
      onDragMove: this._handleScrubberDragUpdate,
      onDragStart: this._handleScrubberDragUpdate,
      onMouseEnter: this._handleScrubberEnterLeave,
      onMouseLeave: this._handleScrubberEnterLeave,
      tag: dragTypes.SHIFT_START,
    });

    this._draggerEnd = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleScrubberDragEnd,
      onDragMove: this._handleScrubberDragUpdate,
      onDragStart: this._handleScrubberDragUpdate,
      onMouseEnter: this._handleScrubberEnterLeave,
      onMouseLeave: this._handleScrubberEnterLeave,
      tag: dragTypes.SHIFT_END,
    });

    this._root = undefined;
    this.state = {
      preventCursorLine: false,
    };
  }

  componentWillUnmount() {
    this._draggerReframe.dispose();
    this._draggerEnd.dispose();
    this._draggerStart.dispose();
  }

  _setRoot = (elm) => {
    this._root = elm;
  };

  _getDraggingBounds = (tag) => {
    if (!this._root) {
      throw new Error("invalid state");
    }
    const { left: clientXLeft, width } = this._root.getBoundingClientRect();
    const { viewRange } = this.props;
    const { time } = viewRange;
    const { current } = time;
    const [viewStart, viewEnd] = current;
    let maxValue = 1;
    let minValue = 0;
    if (tag === dragTypes.SHIFT_START) {
      maxValue = viewEnd;
    } else if (tag === dragTypes.SHIFT_END) {
      minValue = viewStart;
    }
    return { clientXLeft, maxValue, minValue, width };
  };

  _handleReframeMouseMove = ({ value }) => {
    const { updateNextViewRangeTime } = this.props;
    updateNextViewRangeTime({ cursor: value });
  };

  _handleReframeMouseLeave = () => {
    const { updateNextViewRangeTime } = this.props;
    updateNextViewRangeTime({ cursor: null });
  };

  _handleReframeDragUpdate = ({ value }) => {
    const shift = value;
    const { viewRange, updateNextViewRangeTime } = this.props;
    const { time } = viewRange;
    const anchor = time.reframe ? time.reframe.anchor : shift;
    const update = { reframe: { anchor, shift } };
    updateNextViewRangeTime(update);
  };

  _handleReframeDragEnd = ({ value }) => {
    const { viewRange, updateViewRangeTime } = this.props;
    const { time } = viewRange;
    const anchor = time.reframe ? time.reframe.anchor : value;
    let [start, end] = value < anchor ? [value, anchor] : [anchor, value];

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
    updateViewRangeTime(start, end, "minimap");
  };

  _handleScrubberEnterLeave = ({ type }) => {
    const preventCursorLine = type === updateTypes.MOUSE_ENTER;
    this.setState({ preventCursorLine });
  };

  _handleScrubberDragUpdate = ({ event, tag, type, value }) => {
    if (type === updateTypes.DRAG_START) {
      event.stopPropagation();
    }
    const { updateNextViewRangeTime } = this.props;
    if (tag === dragTypes.SHIFT_START) {
      updateNextViewRangeTime({ shiftStart: value });
    } else if (tag === dragTypes.SHIFT_END) {
      updateNextViewRangeTime({ shiftEnd: value });
    }
  };

  _handleScrubberDragEnd = ({ manager, tag, value }) => {
    const { viewRange, updateViewRangeTime } = this.props;
    const { time } = viewRange;
    const { current } = time;
    const [viewStart, viewEnd] = current;
    let update;
    if (tag === dragTypes.SHIFT_START) {
      update = [value, viewEnd];
    } else if (tag === dragTypes.SHIFT_END) {
      update = [viewStart, value];
    } else {
      throw new Error("bad state");
    }
    manager.resetBounds();
    this.setState({ preventCursorLine: false });
    updateViewRangeTime(update[0], update[1], "minimap");
  };

  _getMarkers(from, to, isShift) {
    const { height } = this.props;
    const { x, width, leadingX } = getNextViewLayout(from, to);
    const cls = cx({
      isReframeDrag: !isShift,
      isShiftDrag: isShift,
    });
    return [
      <rect
        key="fill"
        className={`ViewingLayer--draggedShift ${cls}`}
        x={x}
        y="0"
        width={width}
        height={height - 2}
      />,
      <rect
        key="edge"
        className={`ViewingLayer--draggedEdge ${cls}`}
        x={leadingX}
        y="0"
        width="1"
        height={height - 2}
      />,
    ];
  }

  render() {
    const { height, viewRange, numTicks } = this.props;
    const { preventCursorLine } = this.state;
    const { current, cursor, shiftStart, shiftEnd, reframe } = viewRange.time;
    const haveNextTimeRange =
      shiftStart != null || shiftEnd != null || reframe != null;
    const [viewStart, viewEnd] = current;
    let leftInactive = 0;
    if (viewStart) {
      leftInactive = viewStart * 100;
    }
    let rightInactive = 100;
    if (viewEnd) {
      rightInactive = 100 - viewEnd * 100;
    }
    let cursorPosition;
    if (!haveNextTimeRange && cursor != null && !preventCursorLine) {
      cursorPosition = `${cursor * 100}%`;
    }

    return (
      <div aria-hidden className="ViewingLayer" style={{ height }}>
        <svg
          height={height}
          className="ViewingLayer--graph"
          ref={this._setRoot}
          onMouseDown={this._draggerReframe.handleMouseDown}
          onMouseLeave={this._draggerReframe.handleMouseLeave}
          onMouseMove={this._draggerReframe.handleMouseMove}
        >
          {leftInactive > 0 && (
            <rect
              x={0}
              y={0}
              height="100%"
              width={`${leftInactive}%`}
              className="ViewingLayer--inactive"
            />
          )}
          {rightInactive > 0 && (
            <rect
              x={`${100 - rightInactive}%`}
              y={0}
              height="100%"
              width={`${rightInactive}%`}
              className="ViewingLayer--inactive"
            />
          )}
          <GraphTicks numTicks={numTicks} />
          {cursorPosition && (
            <line
              className="ViewingLayer--cursorGuide"
              x1={cursorPosition}
              y1="0"
              x2={cursorPosition}
              y2={height - 2}
              strokeWidth="1"
            />
          )}
          {shiftStart != null && this._getMarkers(viewStart, shiftStart, true)}
          {shiftEnd != null && this._getMarkers(viewEnd, shiftEnd, true)}
          <Scrubber
            active={leftInactive > 0}
            isDragging={shiftStart != null}
            onMouseDown={this._draggerStart.handleMouseDown}
            onMouseEnter={this._draggerStart.handleMouseEnter}
            onMouseLeave={this._draggerStart.handleMouseLeave}
            position={viewStart || 0}
          />
          <Scrubber
            active={rightInactive > 0}
            isDragging={shiftEnd != null}
            position={viewEnd || 1}
            onMouseDown={this._draggerEnd.handleMouseDown}
            onMouseEnter={this._draggerEnd.handleMouseEnter}
            onMouseLeave={this._draggerEnd.handleMouseLeave}
          />
          {reframe != null &&
            this._getMarkers(reframe.anchor, reframe.shift, false)}
        </svg>
        {/* fullOverlay updates the mouse cursor blocks mouse events */}
        {haveNextTimeRange && <div className="ViewingLayer--fullOverlay" />}
      </div>
    );
  }
}

export default ViewingLayer;
