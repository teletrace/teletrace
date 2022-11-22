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
