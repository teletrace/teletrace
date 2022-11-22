import Tween from "./Tween.js";

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
