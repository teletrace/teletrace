import isEqual from "lodash-es/isEqual";

import TreeNode from "../TreeNode.js";
import { formatMillisecondTime, formatSecondTime } from "./date.js";
import { getProcessServiceName } from "./process.js";
import {
  getSpanDuration,
  getSpanId,
  getSpanName,
  getSpanProcessId,
  getSpanServiceName,
  getSpanTimestamp,
  sortSpans,
  transformSpan,
} from "./span.js";

function numberSortComparator(itemA, itemB) {
  return itemA - itemB;
}

export const getTraceId = (trace) => trace.traceID;

export const getTraceSpans = (trace) => trace.spans;

const getTraceProcesses = (trace) => trace.processes;

const getSpanWithProcess = (span, processes) => ({
  ...span,
  process: processes[getSpanProcessId(span)],
});

export const getTraceSpansAsMap = (trace) => {
  const spans = getTraceSpans(trace);
  return spans.reduce((map, span) => map.set(getSpanId(span), span), new Map());
};

export const TREE_ROOT_ID = "__root__";

/**
 * Build a tree of { value: spanID, children } items derived from the
 * `span.references` information. The tree represents the grouping of parent /
 * child relationships. The root-most node is nominal in that
 * `.value === TREE_ROOT_ID`. This is done because a root span (the main trace
 * span) is not always included with the trace data. Thus, there can be
 * multiple top-level spans, and the root node acts as their common parent.
 *
 * The children are sorted by `span.startTime` after the tree is built.
 *
 * @param  {Trace} trace The trace to build the tree of spanIDs.
 * @return {TreeNode}    A tree of spanIDs derived from the relationships
 *                       between spans in the trace.
 */
export function getTraceSpanIdsAsTree(trace) {
  const nodesById = new Map(
    trace.map((span) => [span.spanID, new TreeNode(span.spanID)])
  );
  const spansById = new Map(trace.map((span) => [span.spanID, span]));
  const root = new TreeNode(TREE_ROOT_ID);
  trace.forEach((span) => {
    const node = nodesById.get(span.spanID);
    if (span.parentSpanId) {
      const parent = nodesById.get(span.parentSpanId) || root;
      parent.children.push(node);
    } else {
      root.children.push(node);
    }
  });
  const comparator = (nodeA, nodeB) => {
    const a = spansById.get(nodeA.value);
    const b = spansById.get(nodeB.value);
    return +(a.startTime > b.startTime) || +(a.startTime === b.startTime) - 1;
  };
  trace.forEach((span) => {
    const node = nodesById.get(span.spanID);
    if (node.children.length > 1) {
      node.children.sort(comparator);
    }
  });
  root.children.sort(comparator);
  return root;
}

// attach "process" as an object to each span.
export const hydrateSpansWithProcesses = (trace) => {
  const spans = getTraceSpans(trace);
  const processes = getTraceProcesses(trace);

  return {
    ...trace,
    spans: spans.map((span) => getSpanWithProcess({ processes, span })),
  };
};

export const getTraceSpanCount = (trace) => {
  const spans = getTraceSpans(trace);
  return spans.length;
};

export const getTraceTimestamp = (trace) => {
  const spans = getTraceSpans(trace);
  return spans.reduce(
    (prevTimestamp, span) =>
      prevTimestamp
        ? Math.min(prevTimestamp, getSpanTimestamp(span))
        : getSpanTimestamp(span),
    null
  );
};

export const getTraceDuration = (trace) => {
  const spans = getTraceSpans(trace);
  const timestamp = getTraceTimestamp(trace);

  return spans.reduce(
    (prevDuration, span) =>
      prevDuration
        ? Math.max(
            getSpanTimestamp(span) - timestamp + getSpanDuration(span),
            prevDuration
          )
        : getSpanDuration(span),
    null
  );
};

export const getTraceEndTimestamp = (trace) => {
  const timestamp = getTraceTimestamp(trace);
  const duration = getTraceDuration(trace);

  return timestamp + duration;
};

export const getParentSpan = (trace) => {
  const tree = getTraceSpanIdsAsTree(trace);
  const spanMap = getTraceSpansAsMap(trace);

  return tree.children
    .map((node) => spanMap.get(node.value))
    .sort((spanA, spanB) =>
      numberSortComparator(getSpanTimestamp(spanA), getSpanTimestamp(spanB))
    )[0];
};

export const getTraceDepth = (trace) => {
  const spanTree = getTraceSpanIdsAsTree(trace);
  return spanTree.depth - 1;
};

export const getTraceServices = (trace) => {
  const processes = getTraceProcesses(trace);
  return Object.keys(processes).reduce(
    (services, processID) =>
      services.add(getProcessServiceName(processes[processID])),
    new Set()
  );
};

export const getTraceServiceCount = (trace) => {
  const services = getTraceServices(trace);
  return services.size;
};

// establish constants to determine how math should be handled
// for nanosecond-to-millisecond conversions.
export const DURATION_FORMATTERS = {
  ms: formatMillisecondTime,
  s: formatSecondTime,
};

export const getTraceName = (trace) => {
  const spanWithProcesses = hydrateSpansWithProcesses(trace);
  const parentSpan = getParentSpan(spanWithProcesses);
  const name = getSpanName(parentSpan);
  const serviceName = getSpanServiceName(parentSpan);
  return `${serviceName}: ${name}`;
};

export const omitCollapsedSpans = (spans, tree, collapse) => {
  const hiddenSpanIds = collapse.reduce((result, collapsedSpanId) => {
    tree
      .find(collapsedSpanId)
      .walk((id) => id !== collapsedSpanId && result.add(id));
    return result;
  }, new Set());

  return hiddenSpanIds.size > 0
    ? spans.filter((span) => !hiddenSpanIds.has(getSpanId(span)))
    : spans;
};

export const DEFAULT_TICK_INTERVAL = 4;
export const DEFAULT_TICK_WIDTH = 3;

// timestamps will be spaced over the interval, starting from the initial timestamp
export const getTicksForTrace = (trace, interval, width) =>
  [...Array(interval + 1).keys()].map((num) => ({
    timestamp:
      getTraceTimestamp(trace) + getTraceDuration(trace) * (num / interval),
    width,
  }));

export function transformTraceData(trace) {
  const sortedSpans = sortSpans(trace);
  const transformedSpans = sortedSpans.map(transformSpan);

  let traceEndTime = 0;
  let traceStartTime = Number.MAX_SAFE_INTEGER;
  const spanIdCounts = new Map();
  const spanMap = new Map();
  // filter out spans with empty start times
  // eslint-disable-next-line no-param-reassign
  const max = transformedSpans.length;
  for (let i = 0; i < max; i += 1) {
    const span = transformedSpans[i];
    const { startTime, duration } = span;

    let { spanID } = span;
    // check for start / end time for the trace
    if (startTime < traceStartTime) {
      traceStartTime = startTime;
    }
    if (startTime + duration > traceEndTime) {
      traceEndTime = startTime + duration;
    }
    // make sure span IDs are unique
    const idCount = spanIdCounts.get(spanID);
    if (idCount != null) {
      // eslint-disable-next-line no-console
      console.warn(
        `Dupe spanID, ${idCount + 1} x ${spanID}`,
        span,
        spanMap.get(spanID)
      );
      if (isEqual(span, spanMap.get(spanID))) {
        // eslint-disable-next-line no-console
        console.warn("\t two spans with same ID have `isEqual(...) === true`");
      }
      spanIdCounts.set(spanID, idCount + 1);
      spanID = `${spanID}_${idCount}`;
      span.spanID = spanID;
    } else {
      spanIdCounts.set(spanID, 1);
    }

    spanMap.set(spanID, span);
  }
  // tree is necessary to sort the spans, so children follow parents, and
  // siblings are sorted by start time
  const tree = getTraceSpanIdsAsTree(trace);
  const spans = [];

  tree.walk((spanID, node, depth = 0) => {
    if (spanID === "__root__") {
      return;
    }
    const span = spanMap.get(spanID);
    if (!span) {
      return;
    }

    span.relativeStartTime = span.startTime - traceStartTime;
    span.depth = depth - 1;
    span.hasChildren = node.children.length > 0;
    if (span.parentSpanId) {
      const refSpan = spanMap.get(span.parentSpanId);
      if (refSpan) {
        span.references = [];
        span.references.push({
          span: refSpan,
          spanID: refSpan.spanID,
        });
      }
    }
    spans.push(span);
  });

  return {
    startTime: traceStartTime,
    endTime: traceEndTime,
    duration: traceEndTime - traceStartTime,
    spans,
    traceID: spans[0].traceId,
  };
}
