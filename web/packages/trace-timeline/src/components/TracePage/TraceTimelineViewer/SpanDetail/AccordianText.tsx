import * as React from "react";
import cx from "classnames";
// ** CHANGED - replaced react-icons with ant-design/icons **
import { ArrowDownOutlined, ArrowRightOutlined } from "@ant-design/icons";
import TextList from "./TextList";
import { TNil } from "../../../../types";

import "./AccordianText.css";

type AccordianTextProps = {
  className?: string | TNil;
  data: string[];
  headerClassName?: string | TNil;
  highContrast?: boolean;
  interactive?: boolean;
  isOpen: boolean;
  label: React.ReactNode;
  onToggle?: null | (() => void);
};

export default function AccordianText(props: AccordianTextProps) {
  const {
    className,
    data,
    headerClassName,
    highContrast,
    interactive,
    isOpen,
    label,
    onToggle,
  } = props;
  const isEmpty = !Array.isArray(data) || !data.length;
  const iconCls = cx("u-align-icon", {
    "AccordianKeyValues--emptyIcon": isEmpty,
  });
  let arrow: React.ReactNode | null = null;
  let headerProps: Object | null = null;
  if (interactive) {
    arrow = isOpen ? (
      <ArrowDownOutlined className={iconCls} />
    ) : (
      <ArrowRightOutlined className={iconCls} />
    );
    headerProps = {
      "aria-checked": isOpen,
      onClick: isEmpty ? null : onToggle,
      role: "switch",
    };
  }
  return (
    <div className={className || ""}>
      <div
        className={cx("AccordianText--header", headerClassName, {
          "is-empty": isEmpty,
          "is-high-contrast": highContrast,
          "is-open": isOpen,
        })}
        {...headerProps}
      >
        {arrow} <strong>{label}</strong> ({data.length})
      </div>
      {isOpen && <TextList data={data} />}
    </div>
  );
}

AccordianText.defaultProps = {
  className: null,
  highContrast: false,
  interactive: true,
  onToggle: null,
};
