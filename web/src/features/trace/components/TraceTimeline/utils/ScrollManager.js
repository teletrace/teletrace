/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns `{ isHidden: true, ... }` if one of the parents of `span` is
 * collapsed, e.g. has children hidden.
 *
 * @param {Span} span The Span to check for.
 * @param {Set<string>} childrenAreHidden The set of Spans known to have hidden
 * children, either because it is collapsed or has a collapsed parent.
 * @param {Map<string, ?Span} spansMap Mapping from spanID to Span.
 * @returns {{ isHidden: boolean, parentIds: Set<string> }}
 */
function isSpanHidden(span, childrenAreHidden, spansMap) {
  const parentIDs = new Set();
  let { references } = span;
  let parentID;

  const checkRef = (ref) => {
    if (ref.parentSpanId) {
      parentID = ref.spanID;
      parentIDs.add(parentID);
      return childrenAreHidden.has(parentID);
    }
    return false;
  };

  while (Array.isArray(references) && references.length) {
    const isHidden = references.some(checkRef);
    if (isHidden) {
      return { isHidden, parentIDs };
    }

    if (!parentID) {
      break;
    }

    const parent = spansMap.get(parentID);
    parentID = undefined;
    references = parent && parent.references;
  }

  return { isHidden: false, parentIDs };
}

/**
 * @description ScrollManager is intended for scrolling the TracePage. Has two modes, paging
 * and scrolling to the previous or next visible span.
 */
export default class ScrollManager {
  constructor(trace, scroller) {
    this.trace = trace;
    this.scroller = scroller;
    this.accessors = undefined;
  }

  _scrollPast(rowIndex, direction) {
    const xrs = this.accessors;

    if (!xrs) {
      throw new Error("Accessors not set");
    }

    const isUp = direction < 0;
    const position = xrs.getRowPosition(rowIndex);

    if (!position) {
      // eslint-disable-next-line no-console
      console.warn("Invalid row index");
      return;
    }

    let { y } = position;
    const vh = xrs.getViewHeight();
    if (!isUp) {
      y += position.height;
      // scrollTop is based on the top of the window
      y -= vh;
    }
    y += direction * 0.5 * vh;
    this.scroller.scrollTo(y);
  }

  _scrollToVisibleSpan(direction) {
    const xrs = this.accessors;

    if (!xrs) {
      throw new Error("Accessors not set");
    }

    if (!this.trace) {
      return;
    }
    const { duration, spans, startTime: traceStartTime } = this.trace;
    const isUp = direction < 0;
    const boundaryRow = isUp
      ? xrs.getTopRowIndexVisible()
      : xrs.getBottomRowIndexVisible();
    const spanIndex = xrs.mapRowIndexToSpanIndex(boundaryRow);
    if (
      (spanIndex === 0 && isUp) ||
      (spanIndex === spans.length - 1 && !isUp)
    ) {
      return;
    }
    // fullViewSpanIndex is one row inside the view window unless already at the top or bottom
    let fullViewSpanIndex = spanIndex;
    if (spanIndex !== 0 && spanIndex !== spans.length - 1) {
      fullViewSpanIndex -= direction;
    }
    const [viewStart, viewEnd] = xrs.getViewRange();
    const checkVisibility = viewStart !== 0 || viewEnd !== 1;
    // use NaN as fallback to make flow happy
    const startTime = checkVisibility
      ? traceStartTime + duration * viewStart
      : NaN;
    const endTime = checkVisibility ? traceStartTime + duration * viewEnd : NaN;
    const collapsed = xrs.getCollapsedChildren();
    const childrenAreHidden = collapsed ? new Set(collapsed) : null;
    // use empty Map as fallback to make flow happy
    const spansMap = childrenAreHidden
      ? new Map(spans.map((s) => [s.spanID, s]))
      : new Map();
    const boundary = direction < 0 ? -1 : spans.length;
    let nextSpanIndex;

    for (
      let i = fullViewSpanIndex + direction;
      i !== boundary;
      i += direction
    ) {
      const span = spans[i];
      const { duration: spanDuration, startTime: spanStartTime } = span;
      const spanEndTime = spanStartTime + spanDuration;
      if (
        checkVisibility &&
        (spanStartTime > endTime || spanEndTime < startTime)
      ) {
        // span is not visible within the view range
        // eslint-disable-next-line no-continue
        continue;
      }

      if (childrenAreHidden) {
        // make sure the span is not collapsed
        const { isHidden, parentIDs } = isSpanHidden(
          span,
          childrenAreHidden,
          spansMap
        );
        if (isHidden) {
          childrenAreHidden.add(...parentIDs);
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      nextSpanIndex = i;
      break;
    }
    if (!nextSpanIndex || nextSpanIndex === boundary) {
      // might as well scroll to the top or bottom
      nextSpanIndex = boundary - direction;

      // If there are hidden children, scroll to the last visible span
      if (childrenAreHidden) {
        let isFallbackHidden;
        do {
          const { isHidden, parentIDs } = isSpanHidden(
            spans[nextSpanIndex],
            childrenAreHidden,
            spansMap
          );
          if (isHidden) {
            childrenAreHidden.add(...parentIDs);
            nextSpanIndex -= 1;
          }
          isFallbackHidden = isHidden;
        } while (isFallbackHidden);
      }
    }
    const nextRow = xrs.mapSpanIndexToRowIndex(nextSpanIndex);
    this.scrollPast(nextRow, direction);
  }

  /**
   * Sometimes the ScrollManager is created before the trace is loaded. This
   * setter allows the trace to be set asynchronously.
   */
  setTrace(trace) {
    this.trace = trace;
  }

  /**
   * `setAccessors` is bound in the ctor, so it can be passed as a prop to
   * children components.
   */
  setAccessors = (accessors) => {
    this.accessors = accessors;
  };

  /**
   * Scrolls around one page down (0.95x). It is bounds in the ctor, so it can
   * be used as a keyboard shortcut handler.
   */
  scrollPageDown = () => {
    if (!this.scroller || !this.accessors) {
      return;
    }
    this.scroller.scrollBy(0.95 * this.accessors.getViewHeight(), true);
  };

  /**
   * Scrolls around one page up (0.95x). It is bounds in the ctor, so it can
   * be used as a keyboard shortcut handler.
   */
  scrollPageUp = () => {
    if (!this.scroller || !this.accessors) {
      return;
    }
    this.scroller.scrollBy(-0.95 * this.accessors.getViewHeight(), true);
  };

  /**
   * Scrolls to the next visible span, ignoring spans that do not match the
   * text filter, if there is one. It is bounds in the ctor, so it can
   * be used as a keyboard shortcut handler.
   */
  scrollToNextVisibleSpan = () => {
    this.scrollToVisibleSpan(1);
  };

  /**
   * Scrolls to the previous visible span, ignoring spans that do not match the
   * text filter, if there is one. It is bounds in the ctor, so it can
   * be used as a keyboard shortcut handler.
   */
  scrollToPrevVisibleSpan = () => {
    this.scrollToVisibleSpan(-1);
  };

  destroy() {
    this.trace = undefined;
    this.scroller = undefined;
    this.accessors = undefined;
  }
}
