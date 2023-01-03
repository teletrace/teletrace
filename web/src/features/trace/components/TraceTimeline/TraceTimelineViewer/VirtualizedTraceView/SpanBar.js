/*
Copyright (c) 2017 Uber Technologies, Inc.
Modifications copyright (C) 2022 Cisco Systems, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Tooltip } from "@mui/material";
import { compose, onlyUpdateForKeys, withProps, withState } from "recompose";

function toPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function SpanBar(props) {
  const {
    viewEnd,
    viewStart,
    color,
    label,
    hintSide,
    onClick,
    setLongLabel,
    shortLabel,
    rpc,
  } = props;

  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth: "none",
          },
        },
      }}
      title={label}
      arrow
      followCursor
      placement="top"
      onMouseOver={setLongLabel}
      onFocus={setLongLabel}
    >
      <div
        className="SpanBar--wrapper ub-flex ub-items-center"
        onClick={onClick}
        aria-hidden
      >
        <div
          aria-label={shortLabel}
          className="SpanBar--bar"
          style={{
            background: color,
            left: toPercent(viewStart),
            width: toPercent(viewEnd - viewStart),
          }}
        >
          <div className={`SpanBar--label is-${hintSide}`}>{shortLabel}</div>
        </div>
        {rpc && (
          <div
            className="SpanBar--rpc"
            style={{
              background: rpc.color,
              left: toPercent(rpc.viewStart),
              width: toPercent(rpc.viewEnd - rpc.viewStart),
            }}
          />
        )}
      </div>
    </Tooltip>
  );
}

export default compose(
  withState("label", "setLabel", (props) => props.shortLabel),
  withProps(({ setLabel, longLabel }) => ({
    setLongLabel: () => setLabel(longLabel),
    setShortLabel: () => setLabel(null),
  })),
  onlyUpdateForKeys(["label", "rpc", "viewStart", "viewEnd"])
)(SpanBar);
