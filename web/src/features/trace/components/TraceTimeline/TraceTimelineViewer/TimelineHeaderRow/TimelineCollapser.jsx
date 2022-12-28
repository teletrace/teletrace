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

import { KeyboardArrowRight } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

function getTitle(value) {
  return <span className="TimelineCollapser--tooltipTitle">{value}</span>;
}

export default class TimelineCollapser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  getContainer = () => this.containerRef.current;

  render() {
    const { onExpandAll, onExpandOne, onCollapseAll, onCollapseOne } =
      this.props;
    return (
      <div className="TimelineCollapser" ref={this.containerRef}>
        <Tooltip ref={this.getContainer} title={getTitle("Expand +1")}>
          <KeyboardArrowRight
            onClick={onExpandOne}
            className="TimelineCollapser--btn-expand"
          />
        </Tooltip>
        <Tooltip ref={this.getContainer} title={getTitle("Collapse +1")}>
          RightOutlined
          <KeyboardArrowRight
            onClick={onCollapseOne}
            className="TimelineCollapser--btn"
          />
        </Tooltip>
        <Tooltip ref={this.getContainer} title={getTitle("Expand All")}>
          DoubleRightOutlined
          <KeyboardArrowRight
            onClick={onExpandAll}
            className="TimelineCollapser--btn-expand"
          />
        </Tooltip>
        <Tooltip
          title={getTitle("Collapse All")}
          getPopupContainer={this.getContainer}
        >
          DoubleRightOutlined
          <KeyboardArrowRight
            onClick={onCollapseAll}
            className="TimelineCollapser--btn"
          />
        </Tooltip>
      </div>
    );
  }
}
