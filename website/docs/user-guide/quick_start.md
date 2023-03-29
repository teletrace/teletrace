# Getting Started

<!-- prettier-ignore-start -->
!!! tip
    This guide assumes you have a grounding in the concepts that Teletrace is based on. Please read [understanding the basics](understand_the_basics.md) to learn about these concepts.

!!! warning
    To send tracing data to Teletrace, it is necessary to instrument your applications. We support the [OpenTelemetry](https://opentelemetry.io/) instrumentation and SDKs for this purpose.
<!-- prettier-ignore-end -->

## All in One

Currently Teletrace support All-in-one is an executable designed for quick local testing, launches Teletrace, with an in memory storage component.

The simplest way to start the all-in-one is to use the pre-built image published to DockerHub (a single command line).

```sh title="docker run command"
curl https://raw.githubusercontent.com/teletrace/teletrace/main/teletrace-otelcol/config/all-in-one-config.yaml > all-in-one-config.yaml && \
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

## Sending Data To Teletrace

Send traces to **Teletrace** directly from your code using an OTLP Trace Exporter.

!!! example

    === "Java"
        ### Java

        Download `opentelemetry-javaagent` [latest version](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar).

        This package includes the instrumentation agent as well as
        instrumentations for all supported libraries and all available data exporters.
        The package provides a completely automatic, out-of-the-box experience.

        Run the following code in your Terminal to initiate the SDK

        ```bash
        export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
        export OTEL_METRICS_EXPORTER=none
        export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://your-endpoint
        ```

        Optional Configuration for batch processor

        ```bash
        export OTEL_BSP_MAX_QUEUE_SIZE=2048
        export OTEL_BSP_MAX_EXPORT_BATCH_SIZE=512
        export OTEL_BSP_EXPORT_TIMEOUT=30000
        ```

        Enable the instrumentation agent using the `-javaagent` flag to the JVM.

        ```bash
        java -javaagent:./opentelemetry_javaagent.jar \
        -jar <myapp>.jar
        ```

        Redeploy and run your code

        Make sure your updated code is running. Invoke the instrumented code.

        Visit Teletrace's spans page

        You should be able to find the newly created span in Teletrace's spans page. You can use filters to narrow down shown results to find the new spans more easily.

    === "Python"
        ### Python

        Insert the following code section into your application:

        ```python
        from opentelemetry import trace
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor

        from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
            OTLPSpanExporter as OTLPHTTPExporter,
        )

        provider = TracerProvider(resource=Resource.create())
        trace.set_tracer_provider(provider)

        http_exporter = OTLPHTTPExporter(
        endpoint="your_endpoint"
        )

        processor = BatchSpanProcessor(http_exporter)
        provider.add_span_processor(processor)
        ```

        Redeploy and run your code

        Make sure your updated code is running. Invoke the instrumented code.

    === "Javascript"
        ### Javascript

        Insert the following code section into your application:

        ```javascript
        const traceProvider = new NodeTracerProvider({
            resource: Resource(),
        });
        const collectorOptions = {
            url: "your_endpoint",
        };
        const httpExporter = new HTTPTraceExporter(collectorOptions);
        traceProvider.addSpanProcessor(new BatchSpanProcessor(httpExporter));
        ```

        Redeploy and run your code

        Make sure your updated code is running. Invoke the instrumented code.

    === "Open Telemetry Collector"
        ### Open Telemetry Collector

        If you are currently using your own [**OpenTelemetry Collector**](https://opentelemetry.io/docs/collector/getting-started/ "OpenTelemetry Collector") and are interested in leveraging that collector and emitting your spans and traces to Teletrace, all you need to do is add a new otlphttp exporter or otlp exporter to your `collector.yaml` file.

        otlphttp configuration

        ```{ .yaml .annotate }
        exporters:
        otlphttp:
            traces_endpoint: your_endpoint
            compression: gzip


        service:
        pipelines:
            traces:
            exporters: [otlphttp]
        ```

        otlp configuration

        ```{ .yaml .annotate }
        exporters:
        otlp:
            traces_endpoint: your_endpoint


        service:
        pipelines:
            traces:
            exporters: [otlp]
        ```

## Visit Teletrace UI

Navigate to `http://localhost:8080` to access the Teletrace UI.
You should be able to find the newly created spans in Teletrace's spans page. You can use filters to narrow down shown results to find the new spans more easily.
