import * as React from "react";
import cx from "classnames";
// ** CHANGED - replaced react-icons with ant-design/icons **
import { ArrowDownOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "./AccordianReferences.css";
import { SpanReference } from "../../../../types/trace";
// ** CHANGED - commenting out ReferenceLink usage to be resolved once basic structure shall achieved **
// import ReferenceLink from '../../url/ReferenceLink';

type AccordianReferencesProps = {
  data: SpanReference[];
  highContrast?: boolean;
  interactive?: boolean;
  isOpen: boolean;
  onToggle?: null | (() => void);
  focusSpan: (uiFind: string) => void;
};

type ReferenceItemProps = {
  data: SpanReference[];
  focusSpan: (uiFind: string) => void;
};

// export for test
export function References(props: ReferenceItemProps) {
  const { data, focusSpan } = props;

  return (
    <div className="ReferencesList u-simple-scrollbars">
      <ul className="ReferencesList--List">
        {data.map((reference) => {
          return (
            <li className="ReferencesList--Item" key={`${reference.spanID}`}>
              {/* <ReferenceLink reference={reference} focusSpan={focusSpan}>
                <span className="ReferencesList--itemContent">
                  {reference.span ? (
                    <span>
                      <span className="span-svc-name">{reference.span.process.serviceName}</span>
                      <small className="endpoint-name">{reference.span.operationName}</small>
                    </span>
                  ) : (
                    <span className="span-svc-name">&lt; span in another trace &gt;</span>
                  )}
                  <small className="SpanReference--debugInfo">
                    <span className="SpanReference--debugLabel" data-label="Reference Type:">
                      {reference.refType}
                    </span>
                    <span className="SpanReference--debugLabel" data-label="SpanID:">
                      {reference.spanID}
                    </span>
                  </small>
                </span>
              </ReferenceLink> */}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default class AccordianReferences extends React.PureComponent<AccordianReferencesProps> {
  static defaultProps = {
    highContrast: false,
    interactive: true,
    onToggle: null,
  };

  render() {
    const { data, highContrast, interactive, isOpen, onToggle, focusSpan } =
      this.props;
    const isEmpty = !Array.isArray(data) || !data.length;
    const iconCls = cx("u-align-icon", {
      "AccordianKReferences--emptyIcon": isEmpty,
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
      <div className="AccordianReferences">
        <div
          className={cx(
            "AccordianReferences--header",
            "AccordianReferences--header",
            {
              "is-empty": isEmpty,
              "is-high-contrast": highContrast,
              "is-open": isOpen,
            }
          )}
          {...headerProps}
        >
          {arrow}
          <strong>
            <span className="AccordianReferences--label">References</span>
          </strong>{" "}
          ({data.length})
        </div>
        {isOpen && <References data={data} focusSpan={focusSpan} />}
      </div>
    );
  }
}
