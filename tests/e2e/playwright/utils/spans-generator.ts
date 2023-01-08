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
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

export type Attributes = {
  key: string;
  value: string;
};

export type SpanProps = {
  name: string;
  attributes?: Attributes[];
};

export type TraceProps = {
  serviceName: string;
  traceName: string;
  mainSpan: SpanProps;
  childSpans: SpanProps[];
};

export function createMultipleTraces(traceProps: TraceProps[]) {
  if (traceProps.length === 0) {
    return;
  }

  const parent = createOpenTelemetryTrace(traceProps[0], null);

  for (let i = 1; i < traceProps.length; i += 1) {
    createOpenTelemetryTrace(traceProps[i], parent);
  }
}

function addSpansAttributes(span: Span, att: Attributes[] | undefined) {
  if (att) {
    for (let i = 0; i < att.length; i += 1) {
      span.setAttribute(att[i].key, att[i].value);
    }
  }
}

function createChildSpans(
  childSpans: SpanProps[],
  parentSpan: Span,
  tracer: Tracer
) {
  for (let i = 0; i < childSpans.length; i += 1) {
    const ctx = opentelemetry.trace.setSpan(
      opentelemetry.context.active(),
      parentSpan
    );
    const span = tracer.startSpan(childSpans[i].name, undefined, ctx);

    addSpansAttributes(span, childSpans[i].attributes);
    span.end();
  }
}

function createOpenTelemetryTrace(
  { serviceName, traceName, mainSpan, childSpans }: TraceProps,
  parentSpan: Span | null
) {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const exporter = new OTLPTraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  provider.register();

  const tracer = provider.getTracer(traceName);

  if (!parentSpan) {
    parentSpan = tracer.startSpan(mainSpan.name);
  }

  addSpansAttributes(parentSpan, mainSpan.attributes);

  createChildSpans(childSpans, parentSpan, tracer);

  parentSpan.end();
  exporter.shutdown();

  return parentSpan;
}
