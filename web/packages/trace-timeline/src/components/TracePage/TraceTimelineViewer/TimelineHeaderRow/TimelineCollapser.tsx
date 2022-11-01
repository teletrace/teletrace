import React from "react";
// ** CHANGED - removed Icon and installing and-design/icons **
import { Tooltip } from "antd";
import { RightOutlined, DoubleRightOutlined } from "@ant-design/icons";
import "./TimelineCollapser.css";

type CollapserProps = {
  onCollapseAll: () => void;
  onCollapseOne: () => void;
  onExpandOne: () => void;
  onExpandAll: () => void;
};

function getTitle(value: string) {
  return <span className="TimelineCollapser--tooltipTitle">{value}</span>;
}

export default class TimelineCollapser extends React.PureComponent<CollapserProps> {
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: CollapserProps) {
    super(props);
    this.containerRef = React.createRef();
  }

  // TODO: Something less hacky than createElement to help TypeScript / AntD
  getContainer = () =>
    this.containerRef.current || document.createElement("div");

  render() {
    const { onExpandAll, onExpandOne, onCollapseAll, onCollapseOne } =
      this.props;
    return (
      <div className="TimelineCollapser" ref={this.containerRef}>
        <Tooltip
          title={getTitle("Expand +1")}
          getPopupContainer={this.getContainer}
        >
          <RightOutlined
            type="right"
            onClick={onExpandOne}
            className="TimelineCollapser--btn-expand"
          />
        </Tooltip>
        <Tooltip
          title={getTitle("Collapse +1")}
          getPopupContainer={this.getContainer}
        >
          <RightOutlined
            type="right"
            onClick={onCollapseOne}
            className="TimelineCollapser--btn"
          />
        </Tooltip>
        <Tooltip
          title={getTitle("Expand All")}
          getPopupContainer={this.getContainer}
        >
          <DoubleRightOutlined
            type="double-right"
            onClick={onExpandAll}
            className="TimelineCollapser--btn-expand"
          />
        </Tooltip>
        <Tooltip
          title={getTitle("Collapse All")}
          getPopupContainer={this.getContainer}
        >
          <DoubleRightOutlined
            type="double-right"
            onClick={onCollapseAll}
            className="TimelineCollapser--btn"
          />
        </Tooltip>
      </div>
    );
  }
}
