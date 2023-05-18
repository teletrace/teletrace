# Overview

Welcome to Teletrace's documentation, below you can find information about the how to manage and use Teletrace,
if you can't find what you are looking for, please check out the [issues](https://github.com/teletrace/teletrace/issues) page on GitHub maybe you can find answers over there,
in any case join the Slack workspace to get in touch with the core team and the community!

[Join our Slack](https://join.slack.com/t/teletrace/shared_invite/zt-1qv0kogcn-KlbBB2yS~gUCGszZoSpJfQ){.md-button .md-button--primary}

## What is Teletrace

Teletrace is a distributed tracing based troubleshooting solution designed for modern, cloud-native, distributed systems.

By utilizing [OpenTelemetry](https://opentelemetry.io/) to collect traces from your application Teletrace can help pinpoint issues in your application, and identify performance bottlenecks across the entire dev cycle.

![Teletrace UI](assets/demo.gif)

<!-- prettier-ignore-start -->
!!! tip "See it in action"
    To get a fully functioning demo environment of Teletrace please head over to our [Demo Repo](https://github.com/teletrace/opentelemetry-demo) where you will find instruction on how to quickly setup a demo environment on your local machine.
<!-- prettier-ignore-end -->

## Getting Started

### Quick Start

Download our default config file:

```bash
curl https://raw.githubusercontent.com/teletrace/teletrace/main/teletrace-otelcol/config/all-in-one-config.yaml > all-in-one-config.yaml
```

Run our docker image to start Teletrace:

```bash
docker run \
  -v $(pwd)/all-in-one-config.yaml:/etc/config.yaml \
  -p "8080:8080" \
  -p "4317:4317" \
  -p "4318:4318" \
  teletrace:latest \
  --config /etc/config.yaml
```

This will use Teletrace's `all-in-one` image to setup:

| Port   | Protocol | Component    | Purpose                                                     |
| ------ | -------- | ------------ | ----------------------------------------------------------- |
| `8080` | `HTTP`   | UI and Query | Serve frontend and query service.                           |
| `4317` | `gRPC`   | Collector    | accept OpenTelemetry Protocol (OTLP) over gRPC, if enabled. |
| `4318` | `HTTP`   | Collector    | accept OpenTelemetry Protocol (OTLP) over HTTP, if enabled. |

Open [http://localhost:8080/](http://localhost:8080/) in your browser to start using Teletrace.

For a more in-depth guide on how to setup and manage a Teletrace instance, please head over to our [Operator Guide](./operator-guide/architecture-overview.md).

### Instrument your app to send data

Its necessary to instrument your application using OpenTelemetry to start seeing trace data and using Teletrace.

<!-- prettier-ignore-start -->
!!! warning
    The following instructions are probably too simplistic for production environments, and are meant to give you a quick look into instrumenting your code.

    Please refer to the official OpenTelemetry [instrumentation guide](https://opentelemetry.io/docs/instrumentation/) 
    for your specific language for full tutorials on the different configuration options available.
<!-- prettier-ignore-end -->

=== "TypeScript"

    First, install the necessary components:

    ```bash
    npm install \
      @opentelemetry/api \
      @opentelemetry/auto-instrumentations-node
    ```

    Then simply execute your application with the following environment variables:

    ```bash
    export OTEL_TRACES_EXPORTER="otlp"
    export OTEL_EXPORTER_OTLP_ENDPOINT="your-endpoint"
    export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
    export OTEL_SERVICE_NAME="your-service-name"
    export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
    ```

    Once they are set, run your application as usual:

    ```bash
    ts-node app.ts
    ```

=== "JavaScript"

    First, install the necessary components:

    ```bash
    npm install \
      @opentelemetry/api \
      @opentelemetry/auto-instrumentations-node
    ```

    Then simply execute your application with the following environment variables:

    ```bash
    export OTEL_TRACES_EXPORTER="otlp"
    export OTEL_EXPORTER_OTLP_ENDPOINT="your-endpoint"
    export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
    export OTEL_SERVICE_NAME="your-service-name"
    export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
    ```

    Once they are set, run your application as usual:

    ```bash
    node app.js
    ```

=== "Python"

    First, install the necessary components:

    ```bash
    pip install opentelemetry-distro opentelemetry-exporter-otlp

    # install all instrumentation libraries
    opentelemetry-bootstrap -a install
    ```

    Then, simply execute your application using the `opentelemetry-instrument` tool:

    ```bash
    opentelemetry-instrument \
      --traces_exporter console,otlp \
      --service_name your-service-name \
      --exporter_otlp_endpoint <your-otlp-endpoint> \
      # --exporter_otlp_insecure true \ # in case tls is not enabled
      python myapp.py
    ```

=== "Java"

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

## Features Overview

- Advanced search to pinpoint slow and failing requests.
- Visualize requests to understand their context in your application.
- Track user requests and data across your application.
- Visualize and compare latency and error trends (Coming Soon).
- Advanced latency analysis tools (Coming Soon).

For a more detailed view see [Features](./features.md) page.

## How does it work

Teletrace utilizes [OpenTelemetry](https://opentelemetry.io/) to generate and collect high-quality traces from your application,
traces flow to a centralized collector which stores them in a storage backend.

The Teletrace UI can be used to query, fetch and visualize the stored trace in an easy-to-use modern UI.

<figure markdown>
  ![Teletrace Architecture](assets/teletrace.drawio.svg){width="600"}
  <figcaption>example deployment for an application running in a K8s cluster</figcaption>
</figure>

## Development Status

Teletrace is being actively developed by the community.

Our releases can be found [here](https://github.com/teletrace/teletrace/releases).
