<div align="center">
  <a href="https://solid-dollop-44b513ff.pages.github.io/" target="_blank">
  <picture>
    <img src="./website/docs/images/lupa_light.png" width="350" alt="Logo"/>
  </picture>
  </a>
</div>

<h1 align="center">The Open-Source Platform For Tracing.</h1>

<h3 align="center">
  <a href="https://solid-dollop-44b513ff.pages.github.io/"><b>📝 Explore the docs</b></a> &bull;
  <a href="https://join.slack.com/t/lupa-space/shared_invite/zt-1kyuehmaq-Dbut6qMpKak~SHx1DmZTEQ"><b>💬 Join Our Slack</b></a> &bull;
  <a href="https://github.com/epsagon/lupa/issues/new?assignees=&labels=&template=bug_report.md&title="><b>🐛 Report Bug</b></a> &bull;
  <a href="https://github.com/epsagon/lupa/issues/new?assignees=&labels=&template=feature_request.md&title="><b>✨ Request Feature</b></a>
</h3>

## ⭐️ **Why Lupa?**

Lupa is built from the ground up for modern applications. It is open-source and relies on open standards like OpenTelemetry. It is an easy-to-deploy scalable solution, that supports multiple storage options.

Lupa is developed and maintained by the [Epsagon](https://epsagon.com/) group (acquired by Cisco Systems, Inc).
We believe distributed tracing has an enormous amount of value for modern stacks, and yet presents many challenges like scale and usability.

We are a highly dedicated group of developers, with years of experience in distributed tracing. Open-sourcing knowledge and engaging the community around tracing is our mission.

## ✨ **Features**

- Advanced search to pinpoint slow and failing requests.
- Visualize requests to understand their context in your application.
- Track user requests and data across your application.
- Visualize and compare latency and error trends. (Coming Soon)
- Advanced latency analysis tools. (Coming Soon)

## 🖼 **Live Demo**

<img src="./website/docs/images/demo.gif" min-width="100%" min-height="100%"/>

Take a look at our [demo](https://app.lupaproject.io) environment, with [Open Telemetry Demo](https://github.com/open-telemetry/opentelemetry-demo) data.

## 📚 **Table of contents**

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Getting Started](#-getting-started)
- [Contribution](#-contribution)
- [Community](#-community)
- [Code of Conduct](#-code-of-conduct)
- [License](#-license)

## 🚀 **Getting started**

### Requirements

- [Docker](https://docs.docker.com/compose/install/)

### Using Docker

> Currently, we do not have a public image, so all examples assume execution from the root directory

Clone the project

```sh
git clone https://github.com/epsagon/lupa.git
```

Using docker-compose:

```sh
docker-compose -f deploy/docker-compose/docker-compose.yml up
```

Alternatively, using docker CLI:

```sh
docker build -f cmd/all-in-one/Dockerfile -t oss-tracing:latest .
docker run \
    -v $(pwd)/lupa-otelcol/config/default-config.yaml:/etc/config.yaml \
    -p 8080:8080 \
    -p 4317:4317 \
    -p 4318:4318 \
    oss-tracing:latest \
    --config /etc/config.yaml
```

In case you want to run docker file with environment variables:

```sh
docker run \
    -v $(pwd)/lupa-otelcol/config/default-config.yaml:/etc/config.yaml \
    -p 9090:9090 \
    -p 4317:4317 \
    -p 4318:4318 \
    -e API_PORT=9090 \
    -e DEBUG=false \
    oss-tracing:latest \
    --config /etc/config.yaml
```

## 👨‍💻 **Contribution**

Contributions are welcome!

Start by reviewing the [contribution guidelines](CONTRIBUTING.md). After that, take a look at a [good first issue](https://github.com/epsagon/lupa/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## 💬 **Community**

Join our [Slack](https://join.slack.com/t/lupa-space/shared_invite/zt-1kyuehmaq-Dbut6qMpKak~SHx1DmZTEQ) for questions, support and fun.

Start with our [Documentation](https://solid-dollop-44b513ff.pages.github.io/) for quick tutorials and examples.

If you need direct support you can contact us at support@epsagon.com.

## ❗ **Code of conduct**

We take our community seriously and we are dedicated to providing a safe and welcoming environment for everyone.
Please take a few minutes to review our [Code of Conduct](./CODE_OF_CONDUCT.md).

## 🪪 **License**

Copyright (c) Cisco Systems, Inc. [Apache 2.0 License](./LICENSE).
