# FAQ

## What is Teletrace and what does it do?

Teletrace is an open-source, end-to-end distributed tracing system used for monitoring and troubleshooting complex distributed systems. It allows developers and operations teams to trace the flow of requests through their distributed systems, identify performance bottlenecks, and diagnose issues in near real-time.

## How to create traces and send them to Teletrace?

You can create traces and send them to Teletrace by using [OpenTelemetry](https://opentelemetry.io/). OpenTelemetry is a popular open-source observability framework that provides APIs, libraries, and agents to instrument, generate, collect, and export telemetry data.

To create traces using OpenTelemetry, you need to add the [OpenTelemetry SDK](https://opentelemetry.io/docs/instrumentation/) to your application and use it to instrument your code. The SDK provides a range of libraries and instrumentations for various programming languages and frameworks. Once you've instrumented your code, OpenTelemetry will automatically generate traces and send them to the configured backend.

To send traces to Teletrace, you need to configure your OpenTelemetry exporter to use the otlp or otlphttp endpoint. This can be done by setting the exporter's configuration [options](https://opentelemetry.io/docs/collector/configuration/#exporters). Once configured, OpenTelemetry will send the generated traces to Teletrace's backend, where you can visualize and analyze them using the Teletrace UI.

Overall, using OpenTelemetry with Teletrace can provide a powerful observability solution for distributed systems, allowing you to gain insights into the performance and behavior of your applications.

## What are deployment types available for Teletrace?

Teletrace can be deployed using [Helm](https://helm.sh/) which is a popular package manager for Kubernetes. The Teletrace [Helm chart](https://github.com/teletrace/helm-charts) provides a set of preconfigured templates for deploying Teletrace. Using Helm can simplify the deployment process and make it easier to manage and scale Teletrace.
In addition, Teletrace can be deployed using [Docker Compose](https://docs.docker.com/compose/), which is a tool for defining and running multi-container Docker applications. The Teletrace Docker Compose file provides a set of preconfigured services for deploying Teletrace, including the Teletrace API, and storage backend. Using Docker Compose can simplify the deployment process and make it easier to test and develop Teletrace locally.

## How and where does Teletrace store data?

Teletrace stores its tracing data in a backend storage, which can be one of the following: Elasticsearch or SQLite. The choice of storage system depends on the specific use case and requirements.

## How does Teletrace handle high traffic?

Currently, Teletrace's backend does not designed to handle high traffic.
