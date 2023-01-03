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

const COLORS_HEX = ["#548CFF", "#A3E4DB", "#6E3CBC", "#4ABB8C", "#A2D2FF"];

function mapHexToRgb(colors) {
  const hexRegex = /\w\w/g;
  return colors.map((s) => {
    const sl = s.slice(1);
    const rv = [];
    let match = hexRegex.exec(sl);
    while (match) {
      const hex = match[0];
      const b10 = parseInt(hex, 16);
      rv.push(b10);
      match = hexRegex.exec(sl);
    }
    return Object.freeze(rv);
  });
}

export class ColorGenerator {
  constructor(colorsHex = COLORS_HEX) {
    this.colorsHex = colorsHex;
    this.colorsRgb = mapHexToRgb(colorsHex);
    this.cache = new Map();
    this.currentIdx = 0;
  }

  _getColorIndex(key) {
    let i = this.cache.get(key);
    if (i == null) {
      i = this.currentIdx;
      this.cache.set(key, this.currentIdx);
      const next = this.currentIdx + 1;
      this.currentIdx = next % this.colorsHex.length;
    }
    return i;
  }

  /**
   * Will assign a color to an arbitrary key.
   * If the key has been used already, it will
   * use the same color.
   *
   * @param  {String} key Key name
   * @return {String} HEX Color
   */
  getColorByKey(key) {
    const i = this._getColorIndex(key);
    return this.colorsHex[i];
  }

  /**
   * Retrieve the RGB values associated with a key. Adds the key and associates
   * it with a color if the key is not recognized.
   * @return {number[]} An array of three ints [0, 255] representing a color.
   */
  getRgbColorByKey(key) {
    const i = this._getColorIndex(key);
    return this.colorsRgb[i];
  }

  clear() {
    this.cache.clear();
    this.currentIdx = 0;
  }
}

export default new ColorGenerator();
