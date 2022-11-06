import { RawSpan } from "@/types/spans/span";

export type FlattenedSpan = {
  span: RawSpan;
  firstIconPath: string;
  secondIconPath: string;
  spanAction: string;
  spanDuration: string;
  spanDateTime: string;
};

export const SpansMock: FlattenedSpan[] = [
  {
    span: {
      spanId: "spanId",
      traceId: "traceId",
      name: "name",
      kind: 1,
      status: { message: "message", code: 12 },
      startTime: 5,
      endTime: 6,
      traceState: "traceState",
      attributes: { string: "string", number: 1, bool: true },
      droppedAttributesCount: 8,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
    },
    firstIconPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    secondIconPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    spanAction: "Execute",
    spanDuration: "192.45",
    spanDateTime: "1:36.12.610 - Jan 24, 2022",
  },
  {
    span: {
      spanId: "spanId1",
      traceId: "traceId",
      name: "name",
      kind: 1,
      status: { message: "message", code: 12 },
      startTime: 5,
      endTime: 6,
      traceState: "traceState",
      attributes: { string: "string", number: 1, bool: true },
      droppedAttributesCount: 8,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
    },
    firstIconPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    secondIconPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    spanAction: "spanAction",
    spanDuration: "spanDuration",
    spanDateTime: "spanDateTime",
  },
  {
    span: {
      spanId: "spanId2",
      traceId: "traceId",
      name: "name",
      kind: 1,
      status: { message: "message", code: 12 },
      startTime: 5,
      endTime: 6,
      traceState: "traceState",
      attributes: { string: "string", number: 1, bool: true },
      droppedAttributesCount: 8,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
    },
    firstIconPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    secondIconPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    spanAction: "Execute",
    spanDuration: "192.45",
    spanDateTime: "1:36.12.610 - Jan 24, 2022",
  },
];
