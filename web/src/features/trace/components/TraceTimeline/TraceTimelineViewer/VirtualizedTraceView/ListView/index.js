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

import * as React from "react";

import Positions from "./Positions.js";

const DEFAULT_INITIAL_DRAW = 300;

/**
 * Virtualized list view component, for the most part, only renders the window
 * of items that are in-view with some buffer before and after. Listens for
 * scroll events and updates which items are rendered. See react-virtualized
 * for a suite of components with similar, but generalized, functionality.
 * https://github.com/bvaughn/react-virtualized
 *
 * Note: Presently, ListView cannot be a PureComponent. This is because ListView
 * is sensitive to the underlying state that drives the list items, but it
 * doesn't actually receive that state. So, a render may still be required even
 * if ListView's props are unchanged.
 *
 * @export
 * @class ListView
 */
export default class ListView extends React.Component {
  /**
   * Keeps track of the height and y-value of items, by item index, in the
   * ListView.
   */
  _yPositions;

  /**
   * Keep track of the known / measured heights of the rendered items; populated
   * with values through observation and keyed on the item key, not the item
   * index.
   */
  _knownHeights;

  /**
   * The start index of the items currently drawn.
   */
  _startIndexDrawn;

  /**
   * The end index of the items currently drawn.
   */
  _endIndexDrawn;

  /**
   * The start index of the items currently in view.
   */
  _startIndex;

  /**
   * The end index of the items currently in view.
   */
  _endIndex;

  /**
   * Height of the visual window, e.g. height of the scroller element.
   */
  _viewHeight;

  /**
   * `scrollTop` of the current scroll position.
   */
  _scrollTop;

  /**
   * Used to keep track of whether or not a re-calculation of what should be
   * drawn / viewable has been scheduled.
   */
  _isScrolledOrResized;

  /**
   * If `windowScroller` is true, this notes how far down the page the scroller
   * is located. (Note: repositioning and below-the-fold views are untested)
   */
  _htmlTopOffset;

  _windowScrollListenerAdded;

  _htmlElm;

  /**
   * HTMLElement holding the scroller.
   */
  _wrapperElm;

  /**
   * HTMLElement holding the rendered items.
   */
  _itemHolderElm;

  constructor(props) {
    super(props);

    this._yPositions = new Positions(200);
    // _knownHeights is (item-key -> observed height) of list items
    this._knownHeights = new Map();

    this._startIndexDrawn = 2 ** 20;
    this._endIndexDrawn = -(2 ** 20);
    this._startIndex = 0;
    this._endIndex = 0;
    this._viewHeight = -1;
    this._scrollTop = -1;
    this._isScrolledOrResized = false;

    this._htmlTopOffset = -1;
    this._windowScrollListenerAdded = false;
    // _htmlElm is only relevant if props.windowScroller is true
    this._htmlElm = document.documentElement;
    this._wrapperElm = undefined;
    this._itemHolderElm = undefined;
  }

  componentDidMount() {
    const { windowScroller } = this.props;
    if (windowScroller) {
      if (this._wrapperElm) {
        const { top } = this._wrapperElm.getBoundingClientRect();
        this._htmlTopOffset = top + this._htmlElm.scrollTop;
      }
      window.addEventListener("scroll", this._onScroll);
      this._windowScrollListenerAdded = true;
    }
  }

  componentDidUpdate() {
    if (this._itemHolderElm) {
      this._scanItemHeights();
    }
  }

  componentWillUnmount() {
    if (this._windowScrollListenerAdded) {
      window.removeEventListener("scroll", this._onScroll);
    }
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  getViewHeight = () => this._viewHeight;

  /**
   * Get the index of the item at the bottom of the current view.
   */
  // eslint-disable-next-line react/no-unused-class-component-methods
  getBottomVisibleIndex = () => {
    const bottomY = this._scrollTop + this._viewHeight;
    return this._yPositions.findFloorIndex(bottomY, this._getHeight);
  };

  /**
   * Get the index of the item at the top of the current view.
   */
  // eslint-disable-next-line react/no-unused-class-component-methods
  getTopVisibleIndex = () =>
    this._yPositions.findFloorIndex(this._scrollTop, this._getHeight);

  // eslint-disable-next-line react/no-unused-class-component-methods
  getRowPosition = (index) =>
    this._yPositions.getRowPosition(index, this._getHeight);

  /**
   * Scroll event listener that schedules a remeasuring of which items should be
   * rendered.
   */
  _onScroll = () => {
    if (!this._isScrolledOrResized) {
      this._isScrolledOrResized = true;
      window.requestAnimationFrame(this._positionList);
    }
  };

  /**
   * Returns true is the view height (scroll window) or scroll position have
   * changed.
   */
  // eslint-disable-next-line react/sort-comp
  _isViewChanged() {
    if (!this._wrapperElm) {
      return false;
    }
    const { windowScroller } = this.props;
    const useRoot = windowScroller;
    const clientHeight = useRoot
      ? this._htmlElm.clientHeight
      : this._wrapperElm.clientHeight;
    const scrollTop = useRoot
      ? this._htmlElm.scrollTop
      : this._wrapperElm.scrollTop;
    return clientHeight !== this._viewHeight || scrollTop !== this._scrollTop;
  }

  /**
   * Recalculate _startIndex and _endIndex, e.g. which items are in view.
   */
  _calcViewIndexes() {
    const { windowScroller } = this.props;
    const useRoot = windowScroller;
    // funky if statement is to satisfy flow
    if (!useRoot) {
      /* istanbul ignore next */
      if (!this._wrapperElm) {
        this._viewHeight = -1;
        this._startIndex = 0;
        this._endIndex = 0;
        return;
      }
      this._viewHeight = this._wrapperElm.clientHeight;
      this._scrollTop = this._wrapperElm.scrollTop;
    } else {
      this._viewHeight = window.innerHeight - this._htmlTopOffset;
      this._scrollTop = window.scrollY;
    }
    const yStart = this._scrollTop;
    const yEnd = this._scrollTop + this._viewHeight;
    this._startIndex = this._yPositions.findFloorIndex(yStart, this._getHeight);
    this._endIndex = this._yPositions.findFloorIndex(yEnd, this._getHeight);
  }

  /**
   * Checked to see if the currently rendered items are sufficient, if not,
   * force an update to trigger more items to be rendered.
   */
  _positionList = () => {
    this._isScrolledOrResized = false;
    if (!this._wrapperElm) {
      return;
    }
    this._calcViewIndexes();
    const { viewBufferMin, dataLength } = this.props;
    // indexes drawn should be padded by at least props.viewBufferMin
    const maxStart =
      viewBufferMin > this._startIndex ? 0 : this._startIndex - viewBufferMin;
    const minEnd =
      viewBufferMin < dataLength - this._endIndex
        ? this._endIndex + viewBufferMin
        : dataLength - 1;
    if (maxStart < this._startIndexDrawn || minEnd > this._endIndexDrawn) {
      this.forceUpdate();
    }
  };

  _initWrapper = (elm) => {
    const { windowScroller } = this.props;
    this._wrapperElm = elm;
    if (!windowScroller && elm) {
      this._viewHeight = elm.clientHeight;
    }
  };

  _initItemHolder = (elm) => {
    this._itemHolderElm = elm;
    this._scanItemHeights();
  };

  /**
   * Go through all items that are rendered and save their height based on their
   * item-key (which is on a data-* attribute). If any new or adjusted heights
   * are found, re-measure the current known y-positions (via .yPositions).
   */
  _scanItemHeights = () => {
    const { getIndexFromKey } = this.props;
    if (!this._itemHolderElm) {
      return;
    }
    // note the keys for the first and last altered heights, the `yPositions`
    // needs to be updated
    let lowDirtyKey = null;
    let highDirtyKey = null;
    let isDirty = false;
    // iterating childNodes is faster than children
    // https://jsperf.com/large-htmlcollection-vs-large-nodelist
    const nodes = this._itemHolderElm.childNodes;
    const max = nodes.length;
    for (let i = 0; i < max; i += 1) {
      const node = nodes[i];
      // use `.getAttribute(...)` instead of `.dataset` for jest / JSDOM
      const itemKey = node.getAttribute("data-item-key");
      if (!itemKey) {
        // eslint-disable-next-line no-console
        console.warn("itemKey not found");
        // eslint-disable-next-line no-continue
        continue;
      }
      // measure the first child, if it's available, otherwise the node itself
      // (likely not transferable to other contexts, and instead is specific to
      // how we have the items rendered)
      const measureSrc = node.firstElementChild || node;
      const observed = measureSrc.clientHeight;
      const known = this._knownHeights.get(itemKey);
      if (observed !== known) {
        this._knownHeights.set(itemKey, observed);
        if (!isDirty) {
          isDirty = true;
          // eslint-disable-next-line no-multi-assign
          lowDirtyKey = highDirtyKey = itemKey;
        } else {
          highDirtyKey = itemKey;
        }
      }
    }
    if (lowDirtyKey != null && highDirtyKey != null) {
      // update yPositions, then redraw
      const imin = getIndexFromKey(lowDirtyKey);
      const imax =
        highDirtyKey === lowDirtyKey ? imin : getIndexFromKey(highDirtyKey);
      this._yPositions.calcHeights(imax, this._getHeight, imin);
      this.forceUpdate();
    }
  };

  /**
   * Get the height of the element at index `i`; first check the known heights,
   * fallback to `.props.itemHeightGetter(...)`.
   */
  _getHeight = (i) => {
    const { getKeyFromIndex, itemHeightGetter } = this.props;
    const key = getKeyFromIndex(i);
    const known = this._knownHeights.get(key);
    // known !== known iff known is NaN
    // eslint-disable-next-line no-self-compare
    if (known != null && known === known) {
      return known;
    }
    return itemHeightGetter(i, key);
  };

  render() {
    const {
      dataLength,
      getKeyFromIndex,
      initialDraw = DEFAULT_INITIAL_DRAW,
      itemRenderer,
      viewBuffer,
      viewBufferMin,
      itemsWrapperClassName,
      windowScroller,
    } = this.props;
    const heightGetter = this._getHeight;
    const items = [];
    let start;
    let end;

    this._yPositions.profileData(dataLength);

    if (!this._wrapperElm) {
      start = 0;
      end = (initialDraw < dataLength ? initialDraw : dataLength) - 1;
    } else {
      if (this._isViewChanged()) {
        this._calcViewIndexes();
      }
      const maxStart =
        viewBufferMin > this._startIndex ? 0 : this._startIndex - viewBufferMin;
      const minEnd =
        viewBufferMin < dataLength - this._endIndex
          ? this._endIndex + viewBufferMin
          : dataLength - 1;
      if (maxStart < this._startIndexDrawn || minEnd > this._endIndexDrawn) {
        start =
          viewBuffer > this._startIndex ? 0 : this._startIndex - viewBuffer;
        end = this._endIndex + viewBuffer;
        if (end >= dataLength) {
          end = dataLength - 1;
        }
      } else {
        start = this._startIndexDrawn;
        end =
          this._endIndexDrawn > dataLength - 1
            ? dataLength - 1
            : this._endIndexDrawn;
      }
    }

    this._yPositions.calcHeights(end, heightGetter, start || -1);
    this._startIndexDrawn = start;
    this._endIndexDrawn = end;

    items.length = end - start + 1;
    for (let i = start; i <= end; i += 1) {
      const { y: top, height } = this._yPositions.getRowPosition(
        i,
        heightGetter
      );
      const style = {
        height,
        position: "absolute",
        top,
      };
      const itemKey = getKeyFromIndex(i);
      const attrs = { "data-item-key": itemKey };
      items.push(itemRenderer(itemKey, style, i, attrs));
    }
    const wrapperProps = {
      ref: this._initWrapper,
      style: { position: "relative" },
    };
    if (!windowScroller) {
      wrapperProps.onScroll = this._onScroll;
      wrapperProps.style.height = "100%";
      wrapperProps.style.overflowY = "auto";
    }
    const scrollerStyle = {
      height: this._yPositions.getEstimatedHeight(),
      position: "relative",
    };
    return (
      <div {...wrapperProps}>
        <div style={scrollerStyle}>
          <div
            style={{
              bottom: 0,
              margin: 0,
              padding: 0,
              position: "absolute",
              top: 0,
            }}
            className={itemsWrapperClassName}
            ref={this._initItemHolder}
          >
            {items}
          </div>
        </div>
      </div>
    );
  }
}

ListView.defaultProps = {
  initialDraw: DEFAULT_INITIAL_DRAW,
  itemsWrapperClassName: "",
  windowScroller: false,
};
