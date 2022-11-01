import { combineReducers } from "@reduxjs/toolkit";
import TTraceTimeline from "../types/TTraceTimeline";
import {
  COLLAPSE_ALL,
  COLLAPSE_ONE,
  EXPAND_ALL,
  EXPAND_ONE,
  SET_SPAN_NAME_COLUMN_WIDTH,
} from "./constants";
import { HeaderRowActions } from "./root-action";

export function initialState(): TTraceTimeline {
  return {
    childrenHiddenIDs: new Set(),
    detailStates: new Map(),
    hoverIndentGuideIds: new Set(),
    shouldScrollToFirstUiFindMatch: false,
    spanNameColumnWidth: parseFloat(
      localStorage.getItem("spanNameColumnWidth") || "0.25"
    ),
    traceID: null,
  };
}

export function headerRowReducers(
  state: TTraceTimeline = initialState(),
  action: HeaderRowActions
): TTraceTimeline {
  switch (action.type) {
    case SET_SPAN_NAME_COLUMN_WIDTH:
      localStorage.setItem("spanNameColumnWidth", action.payload.toString());
      return { ...state, spanNameColumnWidth: action.payload };
    case EXPAND_ALL:
      const childrenHiddenIDs = new Set<string>();
      return { ...state, childrenHiddenIDs };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  headerRow: headerRowReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
