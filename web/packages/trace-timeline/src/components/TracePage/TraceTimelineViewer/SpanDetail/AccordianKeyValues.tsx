import * as React from "react";
import cx from "classnames";
// ** CHANGED - replaced react-icons with ant-design/icons **
import { ArrowDownOutlined, ArrowRightOutlined } from "@ant-design/icons";

import * as markers from "./AccordianKeyValues.markers";
import KeyValuesTable from "./KeyValuesTable";
import { TNil } from "../../../../types";
import { KeyValuePair, Link } from "../../../../types/trace";

import "./AccordianKeyValues.css";

type AccordianKeyValuesProps = {
  className?: string | TNil;
  data: KeyValuePair[];
  highContrast?: boolean;
  interactive?: boolean;
  isOpen: boolean;
  label: string;
  linksGetter: ((pairs: KeyValuePair[], index: number) => Link[]) | TNil;
  onToggle?: null | (() => void);
};

// export for tests
export function KeyValuesSummary(props: { data?: KeyValuePair[] }) {
  const { data } = props;
  if (!Array.isArray(data) || !data.length) {
    return null;
  }
  return (
    <ul className="AccordianKeyValues--summary">
      {data.map((item, i) => (
        // `i` is necessary in the key because item.key can repeat
        // eslint-disable-next-line react/no-array-index-key
        <li
          className="AccordianKeyValues--summaryItem"
          key={`${item.key}-${i}`}
        >
          <span className="AccordianKeyValues--summaryLabel">{item.key}</span>
          <span className="AccordianKeyValues--summaryDelim">=</span>
          {String(item.value)}
        </li>
      ))}
    </ul>
  );
}

KeyValuesSummary.defaultProps = {
  data: null,
};

export default function AccordianKeyValues(props: AccordianKeyValuesProps) {
  const {
    className,
    data,
    highContrast,
    interactive,
    isOpen,
    label,
    linksGetter,
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
    <div className={cx(className, "u-tx-ellipsis")}>
      <div
        className={cx("AccordianKeyValues--header", {
          "is-empty": isEmpty,
          "is-high-contrast": highContrast,
        })}
        {...headerProps}
      >
        {arrow}
        <strong data-test={markers.LABEL}>
          {label}
          {isOpen || ":"}
        </strong>
        {!isOpen && <KeyValuesSummary data={data} />}
      </div>
      {isOpen && <KeyValuesTable data={data} linksGetter={linksGetter} />}
    </div>
  );
}

AccordianKeyValues.defaultProps = {
  className: null,
  highContrast: false,
  interactive: true,
  onToggle: null,
};
