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

import { InternalSpan } from "@/types/span";

export const TRACE_MOCK: InternalSpan[] = [
  {
    resource: {
      attributes: {
        "host.name": "eefd775c8e13",
        "process.command_args": "/go/bin/main",
        "process.executable.name": "main",
        "process.executable.path": "/go/bin/main",
        "process.owner": "root",
        "process.pid": 1,
        "process.runtime.description": "go version go1.18.8 linux/amd64",
        "process.runtime.name": "go",
        "process.runtime.version": "go1.18.8",
        "service.name": "demo-client",
        "telemetry.sdk.language": "go",
        "telemetry.sdk.name": "opentelemetry",
        "telemetry.sdk.version": "1.11.1",
      },
      droppedAttributesCount: 0,
    },
    scope: {
      name: "demo-client-tracer",
      version: "",
      attributes: {},
      droppedAttributesCount: 0,
    },
    span: {
      traceId: "5dc00c879d4441eb6d94b990f5de9f08",
      spanId: "624a9feada90f6dd",
      traceState: "",
      parentSpanId: "",
      name: "ExecuteRequest",
      kind: 1,
      startTimeUnixNano: 1669028108943646000,
      endTimeUnixNano: 1669028109013150700,
      attributes: {},
      droppedAttributesCount: 0,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
      status: {
        message: "",
        code: 0,
      },
    },
    externalFields: {
      durationNano: 69504877,
    },
  },
  {
    resource: {
      attributes: {
        "host.name": "eefd775c8e13",
        "process.command_args": "/go/bin/main",
        "process.executable.name": "main",
        "process.executable.path": "/go/bin/main",
        "process.owner": "root",
        "process.pid": 1,
        "process.runtime.description": "go version go1.18.8 linux/amd64",
        "process.runtime.name": "go",
        "process.runtime.version": "go1.18.8",
        "service.name": "demo-client",
        "telemetry.sdk.language": "go",
        "telemetry.sdk.name": "opentelemetry",
        "telemetry.sdk.version": "1.11.1",
      },
      droppedAttributesCount: 0,
    },
    scope: {
      name: "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
      version: "semver:0.36.1",
      attributes: {},
      droppedAttributesCount: 0,
    },
    span: {
      traceId: "5dc00c879d4441eb6d94b990f5de9f08",
      spanId: "d3adcea44092b358",
      traceState: "",
      parentSpanId: "624a9feada90f6dd",
      name: "HTTP GET",
      kind: 3,
      startTimeUnixNano: 1669028108944017400,
      endTimeUnixNano: 1669028109013030700,
      attributes: {
        "http.flavor": "1.1",
        "http.host": "demo-server:7080",
        "http.method": "GET",
        "http.scheme": "http",
        "http.status_code": 200,
        "http.url": "http://demo-server:7080/hello",
      },
      droppedAttributesCount: 0,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
      status: {
        message: "",
        code: 0,
      },
    },
    externalFields: {
      durationNano: 69013148,
    },
  },
  {
    resource: {
      attributes: {
        "host.name": "85bf291d9864",
        "process.command_args": "/go/bin/main",
        "process.executable.name": "main",
        "process.executable.path": "/go/bin/main",
        "process.owner": "root",
        "process.pid": 1,
        "process.runtime.description": "go version go1.18.8 linux/amd64",
        "process.runtime.name": "go",
        "process.runtime.version": "go1.18.8",
        "service.name": "demo-server",
        "telemetry.sdk.language": "go",
        "telemetry.sdk.name": "opentelemetry",
        "telemetry.sdk.version": "1.11.1",
      },
      droppedAttributesCount: 0,
    },
    scope: {
      name: "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
      version: "semver:0.36.1",
      attributes: {},
      droppedAttributesCount: 0,
    },
    span: {
      traceId: "5dc00c879d4441eb6d94b990f5de9f08",
      spanId: "932d97c430002526",
      traceState: "",
      parentSpanId: "d3adcea44092b358",
      name: "/hello",
      kind: 2,
      startTimeUnixNano: 1669028108950463500,
      endTimeUnixNano: 1669028109012403500,
      attributes: {
        "baggage key:client": "cli",
        "baggage key:method": "repl",
        "http.flavor": "1.1",
        "http.host": "demo-server:7080",
        "http.method": "GET",
        "http.scheme": "http",
        "http.server_name": "/hello",
        "http.status_code": 200,
        "http.target": "/hello",
        "http.user_agent": "Go-http-client/1.1",
        "http.wrote_bytes": 11,
        "net.host.name": "demo-server",
        "net.host.port": 7080,
        "net.peer.ip": "172.22.0.8",
        "net.peer.port": 40540,
        "net.transport": "ip_tcp",
        "server-attribute": "foo",
      },
      droppedAttributesCount: 0,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
      status: {
        message: "",
        code: 0,
      },
    },
    externalFields: {
      durationNano: 61939765,
    },
  },
];
