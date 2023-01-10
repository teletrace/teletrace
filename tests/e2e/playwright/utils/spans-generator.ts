/**
 * Copyright 2022 Cisco Systems, Inc.
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

import * as opentelemetry from "@opentelemetry/api";
import { Span, Tracer } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

export type Node = {
  parent: Node | null;
  serviceName: string;
  spans: SpanProps[];
  // childNodes: Node[] | null;
};

const root: Node = { parent: null, serviceName: "root-service", spans: [] };
const childHier1: Node = { parent: root, serviceName: "childier1", spans: [] };

export type Attributes = {
  key: string;
  value: string;
};

export type SpanProps = {
  spanId: string;
  parentSpanID: string | null;
  attributes?: Attributes[];
};

export type TraceProps = {
  serviceName: string;
  traceName: string;
  //   parentServiceName: SpanProps;
  spans: SpanProps[];
};

// export type ReturnTrace = {
//   serviceName: string;
//   //   mainSpan: Span;
//   spans: Span[];
// };

export type SpanIdToSpan = {
  spanId: string;
  span: Span;
};

export function createAndSendMultipleTraces(traceProps: TraceProps[]) {
  if (traceProps.length === 0) {
    return;
  }
  //   let returnTrace: ReturnTrace[] = [];

  let spanIdToSpan: SpanIdToSpan[] = [];

  //   spanIdToSpan = createAndSendTrace(traceProps[0], spanIdToSpan);
  //   spanIdToSpan.push({ServiceName: traceProps[0].serviceName, span: returnFirstTrace.mainSpan})

  //   returnTrace.push(returnFirstTrace);

  for (let i = 1; i < traceProps.length; i += 1) {
    spanIdToSpan = createAndSendTrace(traceProps[i], spanIdToSpan);
  }

  return spanIdToSpan;
}

function addSpansAttributes(span: Span, att: Attributes[] | undefined) {
  if (att) {
    for (let i = 0; i < att.length; i += 1) {
      span.setAttribute(att[i].key, att[i].value);
    }
  }
}

// function createChildSpans(
//   childSpans: SpanProps[],
//   parentSpan: Span,
//   tracer: Tracer
// ) {
//   let returnSpans: Span[] = [];
//   for (let i = 0; i < childSpans.length; i += 1) {
//     const ctx = opentelemetry.trace.setSpan(
//       opentelemetry.context.active(),
//       parentSpan
//     );
//     const span = tracer.startSpan(childSpans[i].name, undefined, ctx);
//     returnSpans.push(span);

//     addSpansAttributes(span, childSpans[i].attributes);
//     span.end();
//   }
//   return returnSpans;
// }

function createAndSendTrace(
  { serviceName, traceName, spans }: TraceProps,
  spanIdToSpan: SpanIdToSpan[]
) {
  //   const localSpanIdToSpan: SpanIdToSpan[] = [];
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const exporter = new OTLPTraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();

  const tracer = provider.getTracer(traceName);

  //   if (!parentSpan) {
  //     parentSpan = tracer.startSpan(mainSpan.name);

  //     addSpansAttributes(parentSpan, mainSpan.attributes);

  //     parentSpan.end();
  //   }

  for (let i = 0; i < spans.length; i += 1) {
    const parentSpan = spanIdToSpan.find(
      (span) => span.spanId === spans[i].parentSpanID
    );
    let span: Span | null = null;

    if (parentSpan) {
      const ctx = opentelemetry.trace.setSpan(
        opentelemetry.context.active(),
        parentSpan.span
      );
      span = tracer.startSpan(spans[i].spanId, undefined, ctx);
    } else {
      span = tracer.startSpan(spans[i].spanId);
    }

    addSpansAttributes(span, spans[i].attributes);

    span.end();

    spanIdToSpan.push({ spanId: spans[i].spanId, span: span });
    // returnSpans.push(span);
  }

  // const returnedSpans = createChildSpans(childSpans, parentSpan, tracer);

  exporter.shutdown();

  //   const returnTrace: ReturnTrace = {
  //     serviceName: serviceName,
  //     mainSpan: parentSpan,
  //     childSpans: returnChildSpans,
  //   };

  return spanIdToSpan;
}

const span1: SpanProps = {
  spanId: "span-1",
  parentSpanID: null,
};

const span2: SpanProps = {
  spanId: "span-2",
  parentSpanID: "span-1",
};

const span3: SpanProps = {
  spanId: "span-3",
  parentSpanID: "span-2",
};

const span4: SpanProps = {
  spanId: "span-4",
  parentSpanID: "span-2",
};

const Service1: TraceProps = {
  serviceName: "test-service-1",
  traceName: "test-service-1",
  spans: [span1],
};

const Service2: TraceProps = {
  serviceName: "test-service-2",
  traceName: "test-service-2",
  spans: [span2],
};

const Service3: TraceProps = {
  serviceName: "test-service-3",
  traceName: "test-service-3",
  spans: [span3],
};

const Service4: TraceProps = {
  serviceName: "test-service-4",
  traceName: "test-service-4",
  spans: [span4],
};

let traces: TraceProps[] = [];

traces.push(Service1);
traces.push(Service2);
traces.push(Service3);
traces.push(Service4);

const result = createAndSendMultipleTraces(traces);
console.log(result);
