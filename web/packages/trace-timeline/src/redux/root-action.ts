import {
  COLLAPSE_ALL,
  COLLAPSE_ONE,
  EXPAND_ALL,
  EXPAND_ONE,
  SET_SPAN_NAME_COLUMN_WIDTH,
} from "./constants";
import { typedAction } from "./helpers";

export const setSpanNameColumnWidthAction = (width: number) => {
  return typedAction(SET_SPAN_NAME_COLUMN_WIDTH, width);
};

export const expandAllAction = () => {
  return typedAction(EXPAND_ALL);
};

export const expandOneAction = () => {
  return typedAction(EXPAND_ONE);
};

export const collapseAllAction = () => {
  return typedAction(COLLAPSE_ALL);
};

export const collapseOneAction = () => {
  return typedAction(COLLAPSE_ONE);
};

export type HeaderRowActions = ReturnType<
  | typeof setSpanNameColumnWidthAction
  | typeof expandAllAction
  | typeof expandOneAction
  | typeof collapseAllAction
  | typeof collapseOneAction
>;
