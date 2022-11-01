import React from "react";
import { Dropdown, Menu, Tooltip } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import NewWindowIcon from "../../common/NewWindowIcon";

import { SpanReference } from "../../../types/trace";

import "./ReferencesButton.css";
// ** CHANGED - commenting out ReferenceLink usage to be resolved once basic structure shall achieved **
// import ReferenceLink from '../url/ReferenceLink';

type TReferencesButtonProps = {
  references: SpanReference[];
  children: React.ReactNode;
  tooltipText: string;
  focusSpan: (spanID: string) => void;
};

export default class ReferencesButton extends React.PureComponent<TReferencesButtonProps> {
  referencesList = (references: SpanReference[]) => (
    <Menu>
      {references.map((ref) => {
        const { span, spanID } = ref;
        return (
          <Menu.Item key={`${spanID}`}>
            {/* <ReferenceLink
              reference={ref}
              focusSpan={this.props.focusSpan}
              className="ReferencesButton--TraceRefLink"
            >
              {span
                ? `${span.process.serviceName}:${span.operationName} - ${ref.spanID}`
                : `(another trace) - ${ref.spanID}`}
              {!span && <NewWindowIcon />}
            </ReferenceLink> */}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  render() {
    const { references, children, tooltipText, focusSpan } = this.props;

    const tooltipProps = {
      arrowPointAtCenter: true,
      mouseLeaveDelay: 0.5,
      placement: "bottom" as TooltipPlacement,
      title: tooltipText,
      overlayClassName: "ReferencesButton--tooltip",
    };

    if (references.length > 1) {
      return (
        <Tooltip {...tooltipProps}>
          <Dropdown
            overlay={this.referencesList(references)}
            placement="bottomRight"
            trigger={["click"]}
          >
            <a className="ReferencesButton-MultiParent">{children}</a>
          </Dropdown>
        </Tooltip>
      );
    }
    const ref = references[0];
    return (
      <Tooltip {...tooltipProps}>
        {/* <ReferenceLink reference={ref} focusSpan={focusSpan} className="ReferencesButton-MultiParent">
          {children}
        </ReferenceLink> */}
      </Tooltip>
    );
  }
}
