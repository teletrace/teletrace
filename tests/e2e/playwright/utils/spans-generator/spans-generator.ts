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
  spans: SpanProps[];
};

export type SpanIdToSpan = {
  spanId: string;
  span: Span;
};

export function createDynamicSpansAndServices(
  numOfNodes: number,
  numOfEdges: number
): TraceProps[] {
  let spansList: SpanProps[] = [];
  let tracesList: TraceProps[] = [];

  if (numOfEdges > numOfNodes) {
    throw "Number of edges can't be bigger than number of nodes";
  }

  for (let i = 0; i <= numOfEdges; i++) {
    const span: SpanProps = {
      spanId: `span-${i}`,
      parentSpanID: i > 0 ? `span-${i - 1}` : null,
    };
    spansList.push(span);
  }
  for (let i = 0; i < numOfNodes; i++) {
    const service: TraceProps = {
      serviceName: `service-${i}`,
      traceName: `trace-${i}`,
      spans: [spansList[i]],
    };
    tracesList.push(service);
  }
  return tracesList;
}

export function createAndSendMultipleTraces(
  traces: TraceProps[]
): SpanIdToSpan[] {
  let spanIdToSpan: SpanIdToSpan[] = [];

  for (const trace of traces) {
    spanIdToSpan = createAndSendTrace(trace, spanIdToSpan);
  }

  return spanIdToSpan;
}

function addSpansAttributes(span: Span, attributes: Attributes[]) {
  for (let attribute of attributes) {
    span.setAttribute(attribute.key, attribute.value);
  }
}

function createAndSendTrace(
  { serviceName, traceName, spans }: TraceProps,
  spanIdToSpan: SpanIdToSpan[]
): SpanIdToSpan[] {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const exporter = new OTLPTraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();

  const tracer = provider.getTracer(traceName);

  for (const spanProps of spans) {
    const parentSpan = spanIdToSpan.find(
      (span) => span.spanId === spanProps.parentSpanID
    );

    let span: Span;

    if (parentSpan) {
      const ctx = opentelemetry.trace.setSpan(
        opentelemetry.context.active(),
        parentSpan.span
      );
      span = tracer.startSpan(spanProps.spanId, undefined, ctx);
    } else {
      span = tracer.startSpan(spanProps.spanId);
    }

    if (spanProps.attributes) {
      addSpansAttributes(span, spanProps.attributes);
    }

    span.end();

    spanIdToSpan.push({ spanId: spanProps.spanId, span: span });
  }

  exporter.shutdown();

  return spanIdToSpan;
}
