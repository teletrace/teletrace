/*
Copyright (c) 2017 Uber Technologies, Inc.
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

import { formatDuration } from "../../utils/date.js";

export default function TickLabels(props) {
  const { numTicks, duration } = props;

  const ticks = [];
  for (let i = 0; i < numTicks; i += 1) {
    const portion = i / numTicks;
    const style =
      // eslint-disable-next-line no-nested-ternary
      portion === 1
        ? { right: "0" }
        : portion === 0
        ? { left: "1%" }
        : { left: `${portion * 100}%` };
    ticks.push(
      <div
        key={portion}
        className="TickLabels--label"
        style={style}
        data-test="tick"
      >
        {formatDuration(duration * portion)}
      </div>
    );
  }

  return <div className="TickLabels">{ticks}</div>;
}
