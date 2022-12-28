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

import Tween from "./Tween.jsx";

const DURATION_MS = 350;

let lastTween;

function onTweenUpdate({ done, value }) {
  window.scrollTo(window.scrollX, value);
  if (done) {
    lastTween = null;
  }
}

export function scrollBy(yDelta, appendToLast = false) {
  const { scrollY } = window;
  let targetFrom = scrollY;
  if (appendToLast && lastTween) {
    const currentDirection = lastTween.to < scrollY ? "up" : "down";
    const nextDirection = yDelta < 0 ? "up" : "down";
    if (currentDirection === nextDirection) {
      targetFrom = lastTween.to;
    }
  }
  const to = targetFrom + yDelta;
  lastTween = new Tween({
    duration: DURATION_MS,
    from: scrollY,
    onUpdate: onTweenUpdate,
    to,
  });
}

export function scrollTo(y) {
  const { scrollY } = window;
  lastTween = new Tween({
    duration: DURATION_MS,
    from: scrollY,
    onUpdate: onTweenUpdate,
    to: y,
  });
}

export function cancel() {
  if (lastTween) {
    lastTween.cancel();
    lastTween = undefined;
  }
}
