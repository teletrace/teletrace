import * as React from "react";
import cx from "classnames";
import _sortBy from "lodash/sortBy";
// ** CHANGED - replaced react-icons with ant-design/icons **
import { ArrowDownOutlined, ArrowRightOutlined } from "@ant-design/icons";

import AccordianKeyValues from "./AccordianKeyValues";
import { formatDuration } from "../utils";
import { TNil } from "../../../../types";
import { Log, KeyValuePair, Link } from "../../../../types/trace";

import "./AccordianLogs.css";

type AccordianLogsProps = {
  interactive?: boolean;
  isOpen: boolean;
  linksGetter: ((pairs: KeyValuePair[], index: number) => Link[]) | TNil;
  logs: Log[];
  onItemToggle?: (log: Log) => void;
  onToggle?: () => void;
  openedItems?: Set<Log>;
  timestamp: number;
};

export default function AccordianLogs(props: AccordianLogsProps) {
  const {
    interactive,
    isOpen,
    linksGetter,
    logs,
    openedItems,
    onItemToggle,
    onToggle,
    timestamp,
  } = props;
  let arrow: React.ReactNode | null = null;
  let HeaderComponent: "span" | "a" = "span";
  let headerProps: Object | null = null;
  if (interactive) {
    arrow = isOpen ? (
      <ArrowDownOutlined className="u-align-icon" />
    ) : (
      <ArrowRightOutlined className="u-align-icon" />
    );
    HeaderComponent = "a";
    headerProps = {
      "aria-checked": isOpen,
      onClick: onToggle,
      role: "switch",
    };
  }

  return (
    <div className="AccordianLogs">
      <HeaderComponent
        className={cx("AccordianLogs--header", { "is-open": isOpen })}
        {...headerProps}
      >
        {arrow} <strong>Logs</strong> ({logs.length})
      </HeaderComponent>
      {isOpen && (
        <div className="AccordianLogs--content">
          {_sortBy(logs, "timestamp").map((log, i) => (
            <AccordianKeyValues
              // `i` is necessary in the key because timestamps can repeat
              // eslint-disable-next-line react/no-array-index-key
              key={`${log.timestamp}-${i}`}
              className={i < logs.length - 1 ? "ub-mb1" : null}
              data={log.fields || []}
              highContrast
              interactive={interactive}
              isOpen={openedItems ? openedItems.has(log) : false}
              label={`${formatDuration(log.timestamp - timestamp)}`}
              linksGetter={linksGetter}
              onToggle={
                interactive && onItemToggle ? () => onItemToggle(log) : null
              }
            />
          ))}
          <small className="AccordianLogs--footer">
            Log timestamps are relative to the start time of the full trace.
          </small>
        </div>
      )}
    </div>
  );
}

AccordianLogs.defaultProps = {
  interactive: true,
  linksGetter: undefined,
  onItemToggle: undefined,
  onToggle: undefined,
  openedItems: undefined,
};
