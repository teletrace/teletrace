export type Attributes = Record<string, number | string | boolean>;

export type Resource = {
  attributes: Attributes;
  droppedAttributesCount: number;
};

export type Scope = {
  name: string;
  version: string;
  attributes: Attributes;
  droppedAttributesCount: number;
};

export type SpanStatus = {
  message: string;
  code: number;
};

export type Event = {
  timeUnixNano: number;
  name: string;
  attributes: Attributes;
  droppedAttributesCount: number;
};

export type Link = {
  traceId: string;
  spanId: string;
  traceState: string;
  attributes: Attributes;
  droppedAttributesCount: number;
};

export type RawSpan = {
  spanId: string;
  traceId: string;
  parentSpanId?: string;

  name: string;
  kind: number;
  status: SpanStatus;
  startTime: number;
  endTime: number;
  traceState: string;
  attributes: Attributes;
  droppedAttributesCount: number;

  events?: Event[];
  droppedEventsCount: number;

  links?: Link[];
  droppedLinksCount: number;
};

export type ExternalFields = {
  duration: number;
};

export type InternalSpan = {
  span: RawSpan;
  scope: Scope;
  resource: Resource;
  externalFields: ExternalFields;
};
