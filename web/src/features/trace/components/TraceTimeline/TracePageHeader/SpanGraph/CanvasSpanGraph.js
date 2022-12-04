import * as React from "react";

import colorGenerator from "../../utils/color-generator.js";
import renderIntoCanvas from "./render-into-canvas.js";

const getColor = (str) => colorGenerator.getRgbColorByKey(str);

class CanvasSpanGraph extends React.PureComponent {
  constructor(props) {
    super(props);
    this._canvasElm = undefined;
  }

  componentDidMount() {
    this._draw();
  }

  componentDidUpdate() {
    this._draw();
  }

  _setCanvasRef = (elm) => {
    this._canvasElm = elm;
  };

  _draw() {
    if (this._canvasElm) {
      const { valueWidth: totalValueWidth, items } = this.props;
      renderIntoCanvas(this._canvasElm, items, totalValueWidth, getColor);
    }
  }

  render() {
    return <canvas className="CanvasSpanGraph" ref={this._setCanvasRef} />;
  }
}

export default CanvasSpanGraph;
