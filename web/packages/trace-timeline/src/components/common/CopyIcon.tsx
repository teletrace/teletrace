import * as React from "react";

import { Button, Tooltip } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip/index";
import cx from "classnames";
import copy from "copy-to-clipboard";

import "./CopyIcon.css";

type PropsType = {
  className?: string;
  copyText: string;
  icon?: string;
  placement?: TooltipPlacement;
  tooltipTitle: string;
};

type StateType = {
  hasCopied: boolean;
};

export default class CopyIcon extends React.PureComponent<
  PropsType,
  StateType
> {
  static defaultProps: Partial<PropsType> = {
    className: undefined,
    icon: "copy",
    placement: "left",
  };

  state = {
    hasCopied: false,
  };

  handleClick = () => {
    this.setState({
      hasCopied: true,
    });
    copy(this.props.copyText);
  };

  handleTooltipVisibilityChange = (visible: boolean) => {
    if (!visible && this.state.hasCopied) {
      this.setState({
        hasCopied: false,
      });
    }
  };

  render() {
    return (
      <Tooltip
        arrowPointAtCenter
        mouseLeaveDelay={0.5}
        onVisibleChange={this.handleTooltipVisibilityChange}
        placement={this.props.placement}
        title={this.state.hasCopied ? "Copied" : this.props.tooltipTitle}
      >
        <Button
          className={cx(this.props.className, "CopyIcon")}
          htmlType="button"
          icon={this.props.icon}
          onClick={this.handleClick}
        />
      </Tooltip>
    );
  }
}
