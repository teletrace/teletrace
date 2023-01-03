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

import cx from "classnames";

import { theme } from "@/styles";

import "./styles.css";

export default function Scrubber({
  active,
  isDragging,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  position,
}) {
  const xPercent = `${position * 100}%`;
  const className = cx("Scrubber", {
    active: active || isDragging,
    isDragging,
  });
  return (
    <g className={className}>
      <g
        className="Scrubber--handles"
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* handleExpansion is only visible when `isDragging` is true */}
        <rect
          x={xPercent}
          className="Scrubber--handleExpansion"
          style={{ transform: `translate(-4.5px)` }}
          width="4"
          height={active || isDragging ? "100%" : "20px"}
        />
        <rect
          x={xPercent}
          className="Scrubber--handle"
          fill={active || isDragging ? "#fff" : theme.palette.grey[900]}
          style={{ transform: `translate(-1.5px)` }}
          width="2"
          height={active || isDragging ? "100%" : "20px"}
        />
      </g>
      <line
        fill={active || isDragging ? "#fff" : theme.palette.grey[900]}
        className="Scrubber--line"
        y2="100%"
        x1={xPercent}
        x2={xPercent}
      />
    </g>
  );
}
