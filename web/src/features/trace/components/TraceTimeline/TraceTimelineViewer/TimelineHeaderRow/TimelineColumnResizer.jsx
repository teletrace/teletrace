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

import DraggableManager from "../../utils/DraggableManager.jsx";

export default class TimelineColumnResizer extends React.PureComponent {
  constructor(props) {
    super(props);
    this._dragManager = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleDragEnd,
      onDragMove: this._handleDragUpdate,
      onDragStart: this._handleDragUpdate,
    });
    this._rootElm = undefined;
    this.state = {
      dragPosition: null,
    };
  }

  componentWillUnmount() {
    this._dragManager.dispose();
  }

  _setRootElm = (elm) => {
    this._rootElm = elm;
  };

  _getDraggingBounds = () => {
    if (!this._rootElm) {
      throw new Error("invalid state");
    }
    const { left: clientXLeft, width } = this._rootElm.getBoundingClientRect();
    const { min, max } = this.props;
    return {
      clientXLeft,
      maxValue: max,
      minValue: min,
      width,
    };
  };

  _handleDragUpdate = ({ value }) => {
    this.setState({ dragPosition: value });
  };

  _handleDragEnd = ({ manager, value }) => {
    const { onChange } = this.props;
    manager.resetBounds();
    this.setState({ dragPosition: null });
    onChange(value);
    window.dispatchEvent(new Event("resize"));
  };

  render() {
    let left;
    let draggerStyle;
    let isDraggingCls = "";
    const { position } = this.props;
    const { dragPosition } = this.state;
    left = `${position * 100}%`;
    const gripStyle = { left };

    if (
      this._dragManager.isDragging() &&
      this._rootElm &&
      dragPosition != null
    ) {
      isDraggingCls = cx({
        isDraggingLeft: dragPosition < position,
        isDraggingRight: dragPosition > position,
      });
      left = `${dragPosition * 100}%`;
      // Draw a highlight from the current dragged position back to the original
      // position, e.g. highlight the change. Draw the highlight via `left` and
      // `right` css styles (simpler than using `width`).
      const draggerLeft = `${Math.min(position, dragPosition) * 100}%`;
      // subtract 1px for draggerRight to deal with the right border being off
      // by 1px when dragging left
      const draggerRight = `calc(${
        (1 - Math.max(position, dragPosition)) * 100
      }% - 1px)`;
      draggerStyle = { left: draggerLeft, right: draggerRight };
    } else {
      draggerStyle = gripStyle;
    }
    return (
      <div
        className={`TimelineColumnResizer ${isDraggingCls}`}
        ref={this._setRootElm}
      >
        <div className="TimelineColumnResizer--gripIcon" style={gripStyle} />
        <div
          aria-hidden
          className="TimelineColumnResizer--dragger"
          onMouseDown={this._dragManager.handleMouseDown}
          style={draggerStyle}
        />
      </div>
    );
  }
}
