# Glossary

Terminology you may or may not be familiar with used by the Teletrace project.

### Instrumentation

The process of gathering information about the runtime and execution to enable troubleshooting and investigation.

### Instrumentation Library

A language specific SDK to collect information about a specific part of an application,
an instrumentation library can be arbitrarily general or specific, for example:

- collect information about a generic python function
- collect information about a node.js express server

### OTLP

Short for OpenTelemetry Protocol, this is the transport protocol used by OpenTelemetry instrumentation libraries.

- [Protocol Spec](https://github.com/open-telemetry/opentelemetry-specification)
- [Protobuf Implementation](https://github.com/open-telemetry/opentelemetry-proto)

### OpenTelemetry

A CNCF project that aims to standardize generating, collecting, and exporting telemetry data using instrumentation libraries for a wide variety of languages.

### OpenTelemetry Collector

An application built by the OpenTelemetry community to collect
telemetry data from instrumented applications, or other OpenTelemtry collectors.

The collector supports a wide variety of input formats, possible processors,
and a wide variety of exporters, and can be further extended using plugins.

A custom build of the OpenTelemetry Collector which can change the bundled plugins (add new ones / remove unused ones) is called a _Distro_.

### Resource

Captures information about the entity for which telemetry is recorded.

For example, a process producing telemetry that is running in a container on Kubernetes has a pod name,
it is in a namespace and possibly is part of a deployment which also has a name.
All three of these attributes can be included in the Resource and applied to any data source.

### Span

A span represents a single operation within a trace,
it contains a start and end time, a unique identifier, the name of the operation, and any relevant in its Attributes.

Spans can also have parent-child relationships to represent the hierarchical structure of a distributed system.

### Span Attributes

A key-value collection of metadata captured on a given Span,
Attributes usually follow OpenTelemetry's [Semantic Conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/) for naming, but can have any arbitrary name.

### Trace

A trace is a collection of spans that represent the path of a request through the system.

Each span contains information about a particular operation,
including its start and end time, the service that performed the operation,
and any relevant metadata, such as the request headers and response status code.

### Tracing

The process of tracing the progression of a single request, called a Trace, as it is handled by services that make up an application. 
A Distributed Trace transverses process, network and security boundaries.
