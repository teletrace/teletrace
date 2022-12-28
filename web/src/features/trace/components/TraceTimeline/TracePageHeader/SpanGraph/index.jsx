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

import CanvasSpanGraph from "./CanvasSpanGraph.jsx";
import TickLabels from "./TickLabels.jsx";
// eslint-disable-next-line import/no-cycle
import ViewingLayer from "./ViewingLayer/index.jsx";

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
