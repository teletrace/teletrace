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

/*
This example creates 4 services:
- service1 is the root service.
- service2 is a child of service1
- service3 is a child of service2
- service4 is a child of service2 and service1
 */

import {
  createAndSendMultipleTraces,
  SpanIdToSpan,
  SpanProps,
  TraceProps,
} from "./spans-generator";

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
  parentSpanID: "span-1",
};

const span4: SpanProps = {
  spanId: "span-4",
  parentSpanID: "span-3",
};

const span5: SpanProps = {
  spanId: "span-5",
  parentSpanID: "span-3",
};

const span6: SpanProps = {
  spanId: "span-6",
  parentSpanID: "span-1",
};

const span7: SpanProps = {
  spanId: "span-7",
  parentSpanID: null,
};

const Service1: TraceProps = {
  serviceName: "graph1-test-service-1",
  traceName: "graph1-test-trace-1",
  spans: [span1],
};

const Service2: TraceProps = {
  serviceName: "graph1-test-service-2",
  traceName: "graph1-test-trace-2",
  spans: [span2, span3, span5],
};

const Service3: TraceProps = {
  serviceName: "graph1-test-service-3",
  traceName: "graph1-test-trace-3",
  spans: [span4],
};

const Service4: TraceProps = {
  serviceName: "graph6-service-4",
  traceName: "graph6-trace-4",
  spans: [span5, span6, span2],
};

export function SendDefaultTrace(): SpanIdToSpan[] {
  let traces: TraceProps[] = [];

  traces.push(Service1);
  traces.push(Service2);
  traces.push(Service3);
  // traces.push(Service4);

  const result = createAndSendMultipleTraces(traces);
  console.log(result);
  return result;
}

SendDefaultTrace();
