import ease from "tween-functions";

export default class Tween {
  constructor({ duration, from, to, delay, onUpdate, onComplete }) {
    this.startTime = Date.now() + (delay || 0);
    this.duration = duration;
    this.from = from;
    this.to = to;
    if (!onUpdate && !onComplete) {
      this.callbackComplete = undefined;
      this.callbackUpdate = undefined;
      this.timeoutID = undefined;
      this.requestID = undefined;
    } else {
      this.callbackComplete = onComplete;
      this.callbackUpdate = onUpdate;
      if (delay) {
        this.timeoutID = setTimeout(this._frameCallback, delay);
        this.requestID = undefined;
      } else {
        this.requestID = window.requestAnimationFrame(this._frameCallback);
        this.timeoutID = undefined;
      }
    }
  }

  _frameCallback = () => {
    this.timeoutID = undefined;
    this.requestID = undefined;
    const current = Object.freeze(this.getCurrent());
    if (this.callbackUpdate) {
      this.callbackUpdate(current);
    }
    if (this.callbackComplete && current.done) {
      this.callbackComplete(current);
    }
    if (current.done) {
      this.callbackComplete = undefined;
      this.callbackUpdate = undefined;
    } else {
      this.requestID = window.requestAnimationFrame(this._frameCallback);
    }
  };

  cancel() {
    if (this.timeoutID != null) {
      clearTimeout(this.timeoutID);
      this.timeoutID = undefined;
    }
    if (this.requestID != null) {
      window.cancelAnimationFrame(this.requestID);
      this.requestID = undefined;
    }
    this.callbackComplete = undefined;
    this.callbackUpdate = undefined;
  }

  getCurrent() {
    const t = Date.now() - this.startTime;
    if (t <= 0) {
      // still in the delay period
      return { done: false, value: this.from };
    }
    if (t >= this.duration) {
      // after the expiration
      return { done: true, value: this.to };
    }
    // mid-tween
    return {
      done: false,
      value: ease.easeOutQuint(t, this.from, this.to, this.duration),
    };
  }
}
