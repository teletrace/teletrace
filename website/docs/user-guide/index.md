# Getting Started

!!! tip
This guide assumes you have a grounding in the concepts that Teletrace is based on. Please read [understanding the basics](understand_the_basics.md) to learn about these concepts.

!!! warning
To send tracing data to Teletrace, it is necessary to instrument your applications. We support the [OpenTelemetry](https://opentelemetry.io/) instrumentation and SDKs for this purpose.

## All in One

Currently Teletrace support All-in-one is an executable designed for quick local testing, launches Teletrace, with an in memory storage component.

The simplest way to start the all-in-one is to use the pre-built image published to DockerHub (a single command line).

```sh title="docker run command"
curl https://raw.githubusercontent.com/epsagon/lupa/main/teletrace-otelcol/config/all-in-one-config.yaml >> all-in-one-config.yaml && \
docker run \
    -v $(pwd)/all-in-one-config.yaml:/etc/config.yaml \
    -p 8080:8080 \
    -p 4317:4317 \
    -p 4318:4318 \
    teletrace:latest \
    --config /etc/config.yaml
```

You can then navigate to http://localhost:8080 to access the Teletrace UI.

The container exposes the following ports:

| Port   | Protocol | Component    | Purpose                                                     |
| ------ | -------- | ------------ | ----------------------------------------------------------- |
| `8080` | `HTTP`   | UI and Query | Serve frontend and query service.                           |
| `4317` | `HTTP`   | Collector    | accept OpenTelemetry Protocol (OTLP) over gRPC, if enabled. |
| `4318` | `HTTP`   | Collector    | accept OpenTelemetry Protocol (OTLP) over HTTP, if enabled. |
