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

import * as React from "react";
import IoArrowRightA from "react-icons/lib/io/arrow-right-a";

import { ResourceIcon } from "@/components/Elements/ResourceIcon";
import { theme } from "@/styles";

import { getSpanResourceType } from "../../../../utils/span-resource-type";
import { formatDuration } from "../../utils/date.js";
import TimelineRow from "../TimelineRow.js";
import SpanBar from "./SpanBar.js";
import SpanTreeOffset from "./SpanTreeOffset.js";

/**
 * This was originally a stateless function, but changing to a PureComponent
 * reduced the render time of expanding a span row detail by ~50%. This is
 * even true in the case where the stateless function has the same prop types as
 * this class and arrow functions are created in the stateless function as
 * handlers to the onClick props. E.g. for now, the PureComponent is more
 * performance than the stateless function.
 */
export default class SpanBarRow extends React.PureComponent {
  _childrenToggle = (e) => {
    e.stopPropagation();
    const { onChildrenToggled, span } = this.props;
    const { spanID } = span;
    onChildrenToggled(spanID);
  };

  render() {
    const {
      className,
      color,
      columnDivision,
      isChildrenExpanded,
      isDetailExpanded,
      rpc,
      showErrorIcon,
      showColdStartIcon,
      getViewedBounds,
      traceStartTime,
      span,
      hoverIndentGuideIds,
      removeHoverIndentGuideId,
      addHoverIndentGuideId,
      selectedSpanId,
      setSelectedSpanId,
    } = this.props;
    const { duration, hasChildren: isParent, operationName, process } = span;
    const serviceName = process.serviceName;
    const label = formatDuration(duration);
    const viewBounds = getViewedBounds(
      span.startTime,
      span.startTime + span.duration
    );
    const viewStart = viewBounds.start;
    const viewEnd = viewBounds.end;
    const icon = (
      <ResourceIcon
        name={getSpanResourceType(span.originalSpan)}
        style={{ height: "15px", width: "15px" }}
      />
    );

    const labelDetail = `${process.serviceName}::${operationName}`;
    let longLabel;
    let hintSide;
    if (viewStart > 1 - viewEnd) {
      longLabel = `${labelDetail} | ${label}`;
      hintSide = "left";
    } else {
      longLabel = `${label} | ${labelDetail}`;
      hintSide = "right";
    }
    return (
      <TimelineRow
        className={`
          span-row
          ${className || ""}
          ${isDetailExpanded ? "is-expanded" : ""}
          ${selectedSpanId === span.spanID ? "is-active" : ""}
        `}
        onClick={() => setSelectedSpanId(span.spanID)}
      >
        <TimelineRow.Cell className="span-name-column" width={columnDivision}>
          <div className="span-name-wrapper">
            <SpanTreeOffset
              onClick={isParent ? this._childrenToggle : null}
              childrenVisible={isChildrenExpanded}
              span={span}
              hoverIndentGuideIds={hoverIndentGuideIds}
              removeHoverIndentGuideId={removeHoverIndentGuideId}
              addHoverIndentGuideId={addHoverIndentGuideId}
            />
            <span
              className={`span-name ${
                isDetailExpanded ? "is-detail-expanded" : ""
              }`}
              aria-checked={isDetailExpanded}
              style={{
                ...theme.typography.body1,
                fontSize: "12px",
                lineHeight: "30px",
              }}
            >
              <div className="span-icon">
                {icon}
                {showErrorIcon && "error icon"}
                {showColdStartIcon && "warning icon"}
              </div>
              <span
                className={`span-svc-name ${
                  isParent && !isChildrenExpanded ? "is-children-collapsed" : ""
                }`}
              >
                {serviceName}
                {rpc && (
                  <span>
                    <IoArrowRightA />{" "}
                    <i
                      className="SpanBarRow--rpcColorMarker"
                      style={{ background: rpc.color }}
                    />
                    {rpc.serviceName}
                  </span>
                )}
              </span>
              <small className="endpoint-name">
                {rpc ? rpc.operationName : operationName}
              </small>
            </span>
          </div>
        </TimelineRow.Cell>
        <TimelineRow.Cell
          className="span-view"
          style={{ cursor: "pointer" }}
          width={1 - columnDivision}
        >
          <SpanBar
            rpc={rpc}
            viewStart={viewStart}
            viewEnd={viewEnd}
            getViewedBounds={getViewedBounds}
            color={color}
            shortLabel={label}
            longLabel={longLabel}
            hintSide={hintSide}
            traceStartTime={traceStartTime}
            span={span}
          />
        </TimelineRow.Cell>
      </TimelineRow>
    );
  }
}

SpanBarRow.defaultProps = {
  className: "",
  rpc: null,
};
