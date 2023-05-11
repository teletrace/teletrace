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

Open [http://localhost:8080/](http://localhost:8080/) in your browser to start using Teletrace.

For a more in-depth guide on how to setup and manage a Teletrace instance, please head over to our [Operator Guide](./operator-guide/architecture-overview.md).

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
