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

export function createAndSendMultipleTraces(traceProps: TraceProps[]) {
  if (traceProps.length === 0) {
    return;
  }

  let spanIdToSpan: SpanIdToSpan[] = [];

  for (let i = 0; i < traceProps.length; i += 1) {
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

function createAndSendTrace(
  { serviceName, traceName, spans }: TraceProps,
  spanIdToSpan: SpanIdToSpan[]
) {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const exporter = new OTLPTraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();

  const tracer = provider.getTracer(traceName);

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
  }

  exporter.shutdown();

  return spanIdToSpan;
}
