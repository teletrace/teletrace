# Overview

## What Is Teletrace?

Teletrace is an open-source troubleshooting tool based on traces, designed for cloud-native distributed applications.

It helps to pinpoint issues in your application, and identify performance bottlenecks across the entire dev cycle using [OpenTelemetry](https://opentelemetry.io/) traces.

![Teletrace UI](images/demo.gif)

## Why Teletrace?

Teletrace provides a comprehensive view of distributed systems and can help identify root cause of exceptions in real-time,
which can significantly reduce the time and effort required to troubleshoot and resolve issues.
This makes Teletrace a valuable tool for teams looking to improve their application's reliability and minimize downtime.

## Getting Started

### Quick Start

Follow our [getting started guide](getting_started.md).
Further user oriented [documentation](user-guide/) is provided for additional features.
Developer oriented [documentation](developer-guide/) is available for people interested in building third-party integrations.

## How Does It Work?

Teletrace can be deployed on Kubernetes using Helm chart.
We provide a Helm chart that simplifies the deployment of Teletrace on Kubernetes.
The chart deploys the Teletrace as Kubernetes deployment and service, and it supports several storages, including Elasticsearch and in-memory storage.
Once Teletrace is deployed on Kubernetes, it can be used to monitor and troubleshoot microservices-based applications running on Kubernetes. Instrumented applications can send trace data to Teletrace using the Opentelemetry API, and the Jaeger components can store and analyze the trace data to provide insights into the performance and behavior of the application. The Teletrace UI can be accessed through a web browser, allowing users to search for traces, view trace details, and analyze trace data.

## Architecture

![Argo CD Architecture](images/teletrace.drawio.svg)

## Features

- Advanced search to pinpoint slow and failing requests.
- Visualize requests to understand their context in your application.
- Track user requests and data across your application.
- Visualize and compare latency and error trends (Coming Soon).
- Advanced latency analysis tools (Coming Soon).

## Development Status

Teletrace is being actively developed by the community. Our releases can be found [here](https://github.com/epsagon/lupa/releases).
