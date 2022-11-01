import React from "react";
import cx from "classnames";
import _get from "lodash/get";
// ** CHANGED - replaced react-icons with ant-design/icons **
import { ArrowDownOutlined, RightOutlined } from "@ant-design/icons";
// ** CHANGED - commenting out redux implementation **
// import { connect } from 'react-redux';
// import { bindActionCreators, Dispatch } from 'redux';
// import { actions } from './duck';
// import { ReduxState } from '../../../types';
import { Span } from "../../../types/trace";
import spanAncestorIds from "../../../utils/span-ancestor-ids";

import "./SpanTreeOffset.css";

type TDispatchProps = {
  addHoverIndentGuideId: (spanID: string) => void;
  removeHoverIndentGuideId: (spanID: string) => void;
};

type TProps = TDispatchProps & {
  childrenVisible?: boolean;
  hoverIndentGuideIds: Set<string>;
  onClick?: () => void;
  span: Span;
  showChildrenIcon?: boolean;
};

export class UnconnectedSpanTreeOffset extends React.PureComponent<TProps> {
  ancestorIds: string[];

  static defaultProps = {
    childrenVisible: false,
    onClick: undefined,
    showChildrenIcon: true,
  };

  constructor(props: TProps) {
    super(props);

    this.ancestorIds = spanAncestorIds(props.span);
    // Some traces have multiple root-level spans, this connects them all under one guideline and adds the
    // necessary padding for the collapse icon on root-level spans.
    this.ancestorIds.push("root");

    this.ancestorIds.reverse();
  }

  /**
   * If the mouse leaves to anywhere except another span with the same ancestor id, this span's ancestor id is
   * removed from the set of hoverIndentGuideIds.
   *
   * @param {Object} event - React Synthetic event tied to mouseleave. Includes the related target which is
   *     the element the user is now hovering.
   * @param {string} ancestorId - The span id that the user was hovering over.
   */
  handleMouseLeave = (
    event: React.MouseEvent<HTMLSpanElement>,
    ancestorId: string
  ) => {
    if (
      !(event.relatedTarget instanceof HTMLSpanElement) ||
      _get(event, "relatedTarget.dataset.ancestorId") !== ancestorId
    ) {
      this.props.removeHoverIndentGuideId(ancestorId);
    }
  };

  /**
   * If the mouse entered this span from anywhere except another span with the same ancestor id, this span's
   * ancestorId is added to the set of hoverIndentGuideIds.
   *
   * @param {Object} event - React Synthetic event tied to mouseenter. Includes the related target which is
   *     the last element the user was hovering.
   * @param {string} ancestorId - The span id that the user is now hovering over.
   */
  handleMouseEnter = (
    event: React.MouseEvent<HTMLSpanElement>,
    ancestorId: string
  ) => {
    if (
      !(event.relatedTarget instanceof HTMLSpanElement) ||
      _get(event, "relatedTarget.dataset.ancestorId") !== ancestorId
    ) {
      this.props.addHoverIndentGuideId(ancestorId);
    }
  };

  render() {
    const { childrenVisible, onClick, showChildrenIcon, span } = this.props;
    const { hasChildren, spanID } = span;
    const wrapperProps = hasChildren
      ? { onClick, role: "switch", "aria-checked": childrenVisible }
      : null;
    const icon =
      showChildrenIcon &&
      hasChildren &&
      (childrenVisible ? <ArrowDownOutlined /> : <RightOutlined />);
    return (
      <span
        className={`SpanTreeOffset ${hasChildren ? "is-parent" : ""}`}
        {...wrapperProps}
      >
        {this.ancestorIds.map((ancestorId) => (
          <span
            key={ancestorId}
            className={cx("SpanTreeOffset--indentGuide", {
              "is-active": this.props.hoverIndentGuideIds.has(ancestorId),
            })}
            data-ancestor-id={ancestorId}
            onMouseEnter={(event) => this.handleMouseEnter(event, ancestorId)}
            onMouseLeave={(event) => this.handleMouseLeave(event, ancestorId)}
          />
        ))}
        {icon && (
          <span
            className="SpanTreeOffset--iconWrapper"
            onMouseEnter={(event) => this.handleMouseEnter(event, spanID)}
            onMouseLeave={(event) => this.handleMouseLeave(event, spanID)}
          >
            {icon}
          </span>
        )}
      </span>
    );
  }
}

// ** CHANGED - commenting out redux implementation **
// export function mapStateToProps(state: ReduxState): { hoverIndentGuideIds: Set<string> } {
//   const { hoverIndentGuideIds } = state.traceTimeline;
//   return { hoverIndentGuideIds };
// }

// export function mapDispatchToProps(dispatch: Dispatch<ReduxState>): TDispatchProps {
//   const { addHoverIndentGuideId, removeHoverIndentGuideId } = bindActionCreators(actions, dispatch);
//   return { addHoverIndentGuideId, removeHoverIndentGuideId };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(UnconnectedSpanTreeOffset);
