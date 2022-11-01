/**
 * All timestamps are in microseconds
 */

// TODO: Everett Tech Debt: Fix KeyValuePair types
export type KeyValuePair = {
  key: string;
  value: any;
};

export type Link = {
  url: string;
  text: string;
};

export type Log = {
  timestamp: number;
  fields: Array<KeyValuePair>;
};

export type Process = {
  serviceName: string;
  tags: Array<KeyValuePair>;
};

export type SpanReference = {
  refType: "CHILD_OF" | "FOLLOWS_FROM";
  // eslint-disable-next-line no-use-before-define
  span: Span | null | undefined;
  spanID: string;
  traceID: string;
};

export type SpanData = {
  spanID: string;
  traceID: string;
  processID: string;
  operationName: string;
  startTime: number;
  duration: number;
  logs: Array<Log>;
  tags?: Array<KeyValuePair>;
  references?: Array<SpanReference>;
  warnings?: Array<string> | null;
};

export type Span = SpanData & {
  depth: number;
  hasChildren: boolean;
  process: Process;
  relativeStartTime: number;
  tags: NonNullable<SpanData["tags"]>;
  references: NonNullable<SpanData["references"]>;
  warnings: NonNullable<SpanData["warnings"]>;
  subsidiarilyReferencedBy: Array<SpanReference>;
};

export type TraceData = {
  processes: Record<string, Process>;
  traceID: string;
};

export type Trace = TraceData & {
  duration: number;
  endTime: number;
  spans: Span[];
  startTime: number;
  traceName: string;
  services: { name: string; numberOfSpans: number }[];
};
