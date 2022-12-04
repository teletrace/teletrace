import * as React from "react";

import Ticks from "../Ticks.js";
import TimelineRow from "../TimelineRow.js";
import TimelineColumnResizer from "./TimelineColumnResizer.js";
// eslint-disable-next-line import/no-cycle
import TimelineViewingLayer from "./TimelineViewingLayer.js";

import "./styles.css";

class TimelineHeaderRow extends React.PureComponent {
  render() {
    const {
      duration,
      numTicks,
      updateViewRangeTime,
      updateNextViewRangeTime,
      viewRangeTime,
      traceState,
      setColumnWidth,
    } = this.props;
    const { spanNameColumnWidth } = traceState;
    const [viewStart, viewEnd] = viewRangeTime.current;

    return (
      <TimelineRow className="TimelineHeaderRow">
        <TimelineRow.Cell
          className="ub-flex ub-items-center"
          width={spanNameColumnWidth}
        >
          <div className="TimelineHeaderRow--title">Resources</div>
        </TimelineRow.Cell>
        <TimelineRow.Cell width={1 - spanNameColumnWidth}>
          <TimelineViewingLayer
            boundsInvalidator={spanNameColumnWidth}
            updateNextViewRangeTime={updateNextViewRangeTime}
            updateViewRangeTime={updateViewRangeTime}
            viewRangeTime={viewRangeTime}
          />
          <Ticks
            numTicks={numTicks}
            startTime={viewStart * duration}
            endTime={viewEnd * duration}
            showLabels
          />
        </TimelineRow.Cell>
        <TimelineColumnResizer
          position={spanNameColumnWidth}
          onChange={setColumnWidth}
          min={0.1}
          max={0.6}
        />
      </TimelineRow>
    );
  }
}

export default TimelineHeaderRow;
