import * as React from "react";
// ** CHANGED - no support for json-markup - package import commented out **
// import jsonMarkup from 'json-markup';
// ** CHANGED - removed Icon and installing and-design/icons **
import { Dropdown, Menu } from "antd";
import { LinkOutlined } from "@ant-design/icons";

import CopyIcon from "../../../common/CopyIcon";

import { TNil } from "../../../../types";
import { KeyValuePair, Link } from "../../../../types/trace";

import "./KeyValuesTable.css";

const jsonObjectOrArrayStartRegex = /^(\[|\{)/;

function tryParseJson(value: string) {
  // if the value is a string representing actual json object or array, then use json-markup
  // otherwise just return as is
  try {
    return jsonObjectOrArrayStartRegex.test(value) ? JSON.parse(value) : value;
  } catch (_) {
    return value;
  }
}

const stringMarkup = (value: string) => (
  <div className="json-markup">
    <span className="json-markup-string">{value}</span>
  </div>
);

function _jsonMarkup(value: any) {
  // ** CHANGED - no support for json-markup - package import commented out - invocation replaced with empty string **
  const markup = { __html: "" };

  return (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={markup} />
  );
}

function formatValue(value: any) {
  let content;

  if (typeof value === "string") {
    const parsed = tryParseJson(value);
    content =
      typeof parsed === "string" ? stringMarkup(parsed) : _jsonMarkup(parsed);
  } else {
    content = _jsonMarkup(value);
  }

  return <div className="ub-inline-block">{content}</div>;
}

export const LinkValue = (props: {
  href: string;
  title?: string;
  children: React.ReactNode;
}) => (
  <a
    href={props.href}
    title={props.title}
    target="_blank"
    rel="noopener noreferrer"
  >
    {props.children}{" "}
    <LinkOutlined className="KeyValueTable--linkIcon" type="export" />
  </a>
);

LinkValue.defaultProps = {
  title: "",
};

const linkValueList = (links: Link[]) => (
  <Menu>
    {links.map(({ text, url }, index) => (
      // `index` is necessary in the key because url can repeat
      // eslint-disable-next-line react/no-array-index-key
      <Menu.Item key={`${url}-${index}`}>
        <LinkValue href={url}>{text}</LinkValue>
      </Menu.Item>
    ))}
  </Menu>
);

type KeyValuesTableProps = {
  data: KeyValuePair[];
  linksGetter: ((pairs: KeyValuePair[], index: number) => Link[]) | TNil;
};

export default function KeyValuesTable(props: KeyValuesTableProps) {
  const { data, linksGetter } = props;
  return (
    <div className="KeyValueTable u-simple-scrollbars">
      <table className="u-width-100">
        <tbody className="KeyValueTable--body">
          {data.map((row, i) => {
            const jsonTable = formatValue(row.value);
            const links = linksGetter ? linksGetter(data, i) : null;
            let valueMarkup;
            if (links && links.length === 1) {
              valueMarkup = (
                <div>
                  <LinkValue href={links[0].url} title={links[0].text}>
                    {jsonTable}
                  </LinkValue>
                </div>
              );
            } else if (links && links.length > 1) {
              valueMarkup = (
                <div>
                  <Dropdown
                    overlay={linkValueList(links)}
                    placement="bottomRight"
                    trigger={["click"]}
                  >
                    <a>
                      {jsonTable}{" "}
                      <LinkOutlined
                        className="KeyValueTable--linkIcon"
                        type="profile"
                      />
                    </a>
                  </Dropdown>
                </div>
              );
            } else {
              valueMarkup = jsonTable;
            }
            return (
              // `i` is necessary in the key because row.key can repeat
              // eslint-disable-next-line react/no-array-index-key
              <tr className="KeyValueTable--row" key={`${row.key}-${i}`}>
                <td className="KeyValueTable--keyColumn">{row.key}</td>
                <td>{valueMarkup}</td>
                <td className="KeyValueTable--copyColumn">
                  <CopyIcon
                    className="KeyValueTable--copyIcon"
                    copyText={JSON.stringify(row, null, 2)}
                    tooltipTitle="Copy JSON"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
