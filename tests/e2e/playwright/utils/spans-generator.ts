import * as opentelemetry from "@opentelemetry/api";
import { Span } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

type traceProps = {
  serviceName: string;
  traceName: string;
  mainSpanName: string;
  numOfChildSpans: number;
  childSpansName: string;
};

export function createMultipleTraces(traceProps: traceProps[]) {
  if (traceProps.length === 0) {
    return;
  }

  const parent = createOpenTelemetryTrace(traceProps[0], null);

  for (let i = 1; i < traceProps.length; i += 1) {
    createOpenTelemetryTrace(traceProps[i], parent);
  }
}

function createOpenTelemetryTrace(
  traceProps: traceProps,
  parentSpan: Span | null
) {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: traceProps.serviceName,
    }),
  });

  const exporter = new OTLPTraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  provider.register();

  const tracer = provider.getTracer(traceProps.traceName);

  if (!parentSpan) {
    parentSpan = tracer.startSpan(traceProps.mainSpanName);
  }

  //   parentSpan.setAttribute("key", "value");

  for (let i = 0; i < traceProps.numOfChildSpans; i += 1) {
    doWork(traceProps.childSpansName, parentSpan, tracer);
  }

  parentSpan.end();
  exporter.shutdown();

  return parentSpan;
}

function doWork(
  childSpansName: string,
  parent: opentelemetry.Span,
  tracer: opentelemetry.Tracer
) {
  const ctx = opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    parent
  );
  const span = tracer.startSpan(childSpansName, undefined, ctx);

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {}

  span.setAttribute("key", "value");

  span.addEvent("invoking doWork");

  span.end();
}

let l: traceProps[] = [];

for (let i = 0; i < 4; i += 1) {
  const t: traceProps = {
    serviceName: "basic-service-f-" + i,
    traceName: "trace-f-" + i,
    mainSpanName: "spanparent-f-" + i,
    numOfChildSpans: 2,
    childSpansName: "child-" + i,
  };

  l.push(t);
}

createMultipleTraces(l);
