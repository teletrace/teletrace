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

export type AttributeKey = string;
export type AttributeValue = number | string | boolean;
export type Attributes = Record<AttributeKey, AttributeValue>;

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

export enum StatusCode {
  Unset = 0,
  OK = 1,
  Error = 2,
}

export type SpanStatus = {
  message: string;
  code: StatusCode;
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

export enum SpanKind {
  UNSPECIFIED = 0,
  INTERNAL = 1,
  SERVER = 2,
  CLIENT = 3,
  PRODUCER = 4,
  CONSUMER = 5,
}

export type RawSpan = {
  spanId: string;
  traceId: string;
  parentSpanId?: string;

  name: string;
  kind: SpanKind;
  status: SpanStatus;
  startTimeUnixNano: number;
  endTimeUnixNano: number;
  traceState: string;
  attributes: Attributes;
  droppedAttributesCount: number;

  events?: Event[];
  droppedEventsCount: number;

  links?: Link[];
  droppedLinksCount: number;
};

export type ExternalFields = {
  durationNano: number;
};

export type InternalSpan = {
  span: RawSpan;
  scope: Scope;
  resource: Resource;
  externalFields: ExternalFields;
};
