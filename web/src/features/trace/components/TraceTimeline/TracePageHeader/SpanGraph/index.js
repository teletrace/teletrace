import * as React from "react";

import CanvasSpanGraph from "./CanvasSpanGraph.js";
import TickLabels from "./TickLabels.js";
// eslint-disable-next-line import/no-cycle
import ViewingLayer from "./ViewingLayer/index.js";

import "./styles.css";

const DEFAULT_HEIGHT = 60;
const TIMELINE_TICK_INTERVAL = 4;

function getItem(span) {
  return {
    serviceName: span.process.serviceName,
    valueOffset: span.relativeStartTime,
    valueWidth: span.duration,
  };
}

export default class SpanGraph extends React.PureComponent {
  constructor(props) {
    super(props);
    const { trace } = props;
    this.state = {
      items: trace ? trace.spans.map(getItem) : [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { trace: nextTrace } = nextProps;
    const { trace: prevTrace } = this.props;
    if (prevTrace !== nextTrace) {
      this.setState({
        items: nextTrace ? nextTrace.spans.map(getItem) : [],
      });
    }
  }

  render() {
    const {
      height,
      trace,
      viewRange,
      updateNextViewRangeTime,
      updateViewRangeTime,
    } = this.props;
    if (!trace) {
      return <div />;
    }
    const { items } = this.state;
    return (
      <div>
        <TickLabels
          numTicks={TIMELINE_TICK_INTERVAL}
          duration={trace.duration}
        />
        <CanvasSpanGraph valueWidth={trace.duration} items={items} />
        <ViewingLayer
          viewRange={viewRange}
          numTicks={TIMELINE_TICK_INTERVAL}
          height={height || DEFAULT_HEIGHT}
          updateViewRangeTime={updateViewRangeTime}
          updateNextViewRangeTime={updateNextViewRangeTime}
        />
      </div>
    );
  }
}

SpanGraph.defaultProps = {
  height: DEFAULT_HEIGHT,
};
