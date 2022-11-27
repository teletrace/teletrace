import _get from "lodash-es/get";

const LEFT_MOUSE_BUTTON = 0;

export const updateTypes = {
  DRAG_END: "DRAG_END",
  DRAG_MOVE: "DRAG_MOVE",
  DRAG_START: "DRAG_START",
  MOUSE_ENTER: "MOUSE_ENTER",
  MOUSE_LEAVE: "MOUSE_LEAVE",
  MOUSE_MOVE: "MOUSE_MOVE",
};

export default class DraggableManager {
  constructor({ getBounds, tag, resetBoundsOnResize = true, ...rest }) {
    this.handleMouseDown = this._handleDragEvent;
    this.handleMouseEnter = this._handleMinorMouseEvent;
    this.handleMouseMove = this._handleMinorMouseEvent;
    this.handleMouseLeave = this._handleMinorMouseEvent;

    this.getBounds = getBounds;
    this.tag = tag;
    this._isDragging = false;
    this._bounds = undefined;
    this._resetBoundsOnResize = Boolean(resetBoundsOnResize);
    if (this._resetBoundsOnResize) {
      window.addEventListener("resize", this.resetBounds);
    }
    this._onMouseEnter = rest.onMouseEnter;
    this._onMouseLeave = rest.onMouseLeave;
    this._onMouseMove = rest.onMouseMove;
    this._onDragStart = rest.onDragStart;
    this._onDragMove = rest.onDragMove;
    this._onDragEnd = rest.onDragEnd;
  }

  _getBounds() {
    if (!this._bounds) {
      this._bounds = this.getBounds(this.tag);
    }
    return this._bounds;
  }

  _getPosition(clientX) {
    const { clientXLeft, maxValue, minValue, width } = this._getBounds();
    let x = clientX - clientXLeft;
    let value = x / width;
    if (minValue != null && value < minValue) {
      value = minValue;
      x = minValue * width;
    } else if (maxValue != null && value > maxValue) {
      value = maxValue;
      x = maxValue * width;
    }
    return { value, x };
  }

  _stopDragging() {
    window.removeEventListener("mousemove", this._handleDragEvent);
    window.removeEventListener("mouseup", this._handleDragEvent);
    const style = _get(document, "body.style");
    if (style) {
      style.userSelect = null;
    }
    this._isDragging = false;
  }

  isDragging() {
    return this._isDragging;
  }

  dispose() {
    if (this._isDragging) {
      this._stopDragging();
    }
    if (this._resetBoundsOnResize) {
      window.removeEventListener("resize", this.resetBounds);
    }
    this._bounds = undefined;
    this._onMouseEnter = undefined;
    this._onMouseLeave = undefined;
    this._onMouseMove = undefined;
    this._onDragStart = undefined;
    this._onDragMove = undefined;
    this._onDragEnd = undefined;
  }

  resetBounds = () => {
    this._bounds = undefined;
  };

  _handleMinorMouseEvent = (event) => {
    const { button, clientX, type: eventType } = event;
    if (this._isDragging || button !== LEFT_MOUSE_BUTTON) {
      return;
    }
    let type = "";
    let handler;
    if (eventType === "mouseenter") {
      type = updateTypes.MOUSE_ENTER;
      handler = this._onMouseEnter;
    } else if (eventType === "mouseleave") {
      type = updateTypes.MOUSE_LEAVE;
      handler = this._onMouseLeave;
    } else if (eventType === "mousemove") {
      type = updateTypes.MOUSE_MOVE;
      handler = this._onMouseMove;
    } else {
      throw new Error(`invalid event type: ${eventType}`);
    }
    if (!handler) {
      return;
    }
    const { value, x } = this._getPosition(clientX);
    handler({
      event,
      manager: this,
      tag: this.tag,
      type,
      value,
      x,
    });
  };

  _handleDragEvent = (event) => {
    const { button, clientX, type: eventType } = event;
    let type = "";
    let handler;
    if (eventType === "mousedown") {
      if (this._isDragging || button !== LEFT_MOUSE_BUTTON) {
        return;
      }
      window.addEventListener("mousemove", this._handleDragEvent);
      window.addEventListener("mouseup", this._handleDragEvent);
      const style = _get(document, "body.style");
      if (style) {
        style.userSelect = "none";
      }
      this._isDragging = true;

      type = updateTypes.DRAG_START;
      handler = this._onDragStart;
    } else if (eventType === "mousemove") {
      if (!this._isDragging) {
        return;
      }
      type = updateTypes.DRAG_MOVE;
      handler = this._onDragMove;
    } else if (eventType === "mouseup") {
      if (!this._isDragging) {
        return;
      }
      this._stopDragging();
      type = updateTypes.DRAG_END;
      handler = this._onDragEnd;
    } else {
      throw new Error(`invalid event type: ${eventType}`);
    }
    if (!handler) {
      return;
    }
    const { value, x } = this._getPosition(clientX);
    handler({
      event,
      manager: this,
      tag: this.tag,
      type,
      value,
      x,
    });
  };
}
