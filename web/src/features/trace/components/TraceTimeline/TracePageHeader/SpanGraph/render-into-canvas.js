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

export const BG_COLOR = "#1B1C21";
export const ITEM_ALPHA = 0.8;
export const MIN_ITEM_HEIGHT = 2;
export const MAX_TOTAL_HEIGHT = 200;
export const MIN_ITEM_WIDTH = 10;
export const MIN_TOTAL_HEIGHT = 60;

export default function renderIntoCanvas(
  canvas,
  items,
  totalValueWidth,
  getFillColor
) {
  const fillCache = new Map();
  const cHeight =
    items.length < MIN_TOTAL_HEIGHT
      ? MIN_TOTAL_HEIGHT
      : Math.min(items.length, MAX_TOTAL_HEIGHT);
  const cWidth = window.innerWidth * 2;
  // eslint-disable-next-line no-param-reassign
  canvas.width = cWidth;
  // eslint-disable-next-line no-param-reassign
  canvas.height = cHeight;
  const itemHeight = Math.max(MIN_ITEM_HEIGHT, cHeight / items.length);
  const itemYChange = cHeight / items.length;

  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, cWidth, cHeight);
  for (let i = 0; i < items.length; i += 1) {
    const { valueWidth, valueOffset, serviceName } = items[i];
    const x = (valueOffset / totalValueWidth) * cWidth;
    let width = (valueWidth / totalValueWidth) * cWidth;
    if (width < MIN_ITEM_WIDTH) {
      width = MIN_ITEM_WIDTH;
    }
    let fillStyle = fillCache.get(serviceName);
    if (!fillStyle) {
      fillStyle = `rgba(${getFillColor(serviceName)
        .concat(ITEM_ALPHA)
        .join()})`;
      fillCache.set(serviceName, fillStyle);
    }
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, i * itemYChange, width, itemHeight);
  }
}
