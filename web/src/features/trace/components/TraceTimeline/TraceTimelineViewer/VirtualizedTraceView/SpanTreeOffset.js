/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import cx from "classnames";
import { PureComponent } from "react";

import { theme } from "@/styles";

import spanAncestorIds from "../../utils/span-ancestor-ids.js";

class SpanTreeOffset extends PureComponent {
  constructor(props) {
    super(props);

    this.ancestorIds = spanAncestorIds(props.span);
    // Some traces have multiple root-level spans, this connects them all under one guideline and adds the
    // necessary padding for the collapse icon on root-level spans.
    this.ancestorIds.push("root");

    this.ancestorIds.reverse();
  }

  render() {
    const {
      childrenVisible,
      onClick,
      showChildrenIcon,
      span,
      hoverIndentGuideIds,
    } = this.props;
    const { hasChildren } = span;
    const wrapperProps = hasChildren
      ? { "aria-checked": childrenVisible, role: "switch" }
      : null;
    const icon =
      showChildrenIcon &&
      hasChildren &&
      (childrenVisible ? (
        <KeyboardArrowDown fontSize="small" onClick={onClick} />
      ) : (
        <KeyboardArrowRight fontSize="small" onClick={onClick} />
      ));

    return (
      <span
        className={`SpanTreeOffset ${hasChildren ? "is-parent" : ""}`}
        {...wrapperProps}
      >
        {this.ancestorIds.map((ancestorId) => (
          <span
            key={ancestorId}
            className={cx("SpanTreeOffset--indentGuide", {
              "is-active": hoverIndentGuideIds.has(ancestorId),
            })}
            data-ancestor-id={ancestorId}
          />
        ))}
        {icon && (
          <span
            className="SpanTreeOffset--iconWrapper"
            style={{ color: theme.palette.common.white }}
          >
            {icon}
          </span>
        )}
      </span>
    );
  }
}

SpanTreeOffset.defaultProps = {
  childrenVisible: false,
  onClick: null,
  showChildrenIcon: true,
};

export default SpanTreeOffset;
