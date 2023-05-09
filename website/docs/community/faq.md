# FAQ

## What is Teletrace and what does it do?

Teletrace is an open-source, end-to-end distributed tracing system used for monitoring and troubleshooting complex distributed systems.
It allows developers and operations teams to trace the flow of requests through their distributed systems,
identify performance bottlenecks, and diagnose issues in near real-time.

## How to create traces and send them to Teletrace?

You can create traces and send them to Teletrace by using [OpenTelemetry](https://opentelemetry.io/).
OpenTelemetry is a popular open-source observability framework that provides APIs, libraries, and agents to instrument, generate, collect, and export telemetry data.

To create traces using OpenTelemetry, you need to add the [OpenTelemetry SDK](https://opentelemetry.io/docs/instrumentation/) to your application and use it to instrument your code.
The SDK provides a range of libraries and instrumentations for various programming languages and frameworks.
Once you've instrumented your code, OpenTelemetry will automatically generate traces and send them to the configured backend.

To send traces to Teletrace, you need to configure your OpenTelemetry exporter to use the otlp or otlphttp endpoint.
This can be done by setting the exporter's configuration [options](https://opentelemetry.io/docs/collector/configuration/#exporters).
Once configured, OpenTelemetry will send the generated traces to Teletrace's backend, where you can visualize and analyze them using the Teletrace UI.

Overall, using OpenTelemetry with Teletrace can provide a powerful observability solution for distributed systems, allowing you to gain insights into the performance and behavior of your applications.

## What are deployment types available for Teletrace?

The recommended way to deploy Teletrace is to deploy our [Helm chart](https://github.com/teletrace/helm-charts) to a Kubernetes cluster.

Additinally Teletrace is packaged as a standard [OCI image](https://hub.docker.com/r/teletrace/teletrace) that can run locally or be deployed to any cloud service that can handle container images (e.g. AWS ECS)
or as a [standalone binary](https://github.com/teletrace/teletrace/releases) that can be executed on any compute service (e.g. AWS EC2) or locally.

Check out our detailed [deployment guides](../operator-guide/deployment/standalone.md).

## How and where does Teletrace store data?

Teletrace is using plugins to store data in different storage backends, 
this allows the platform to be extended to the users' use-case with ease.

currently supported plugins:

- ElasticSearch (version 8+)
- SQLite

The choice of storage system depends on the specific use case and requirements.
