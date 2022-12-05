<div align="center">
  <a href="https://solid-dollop-44b513ff.pages.github.io/" target="_blank">
  <picture>
    <img src="./website/docs/images/lupa_light.png" width="400" alt="Logo"/>
  </picture>
  </a>
</div>

<h1 align="center">Tracing Troubleshooting Tool.</h1>

<h3 align="center">
  <a href="https://solid-dollop-44b513ff.pages.github.io/"><b>📝 Explore the docs</b></a> &bull;
  <a href="https://join.slack.com/t/lupa-space/shared_invite/zt-1kyuehmaq-Dbut6qMpKak~SHx1DmZTEQ"><b>💬 Join Our Slack</b></a> &bull;
  <a href="https://github.com/epsagon/lupa/issues/new?assignees=&labels=&template=bug_report.md&title="><b>🐛 Report Bug</b></a> &bull;
  <a href="https://github.com/epsagon/lupa/issues/new?assignees=&labels=&template=feature_request.md&title="><b>✨ Request Feature</b></a>
</h3>

## ⭐️ **Why Lupa?**

TODO Placeholder Placeholder

## ✨ **Features**

- Feature number 1
- Feature number 2
- Feature number 3

## 🖼 **Screenshots**

<img src="./website/docs/images/demo.gif" width="900" height="450"/>

Take a look on our [demo](https://app.lupaproject.io/search) environment that uses [Open Telemetry Demo](https://github.com/open-telemetry/opentelemetry-demo)

## 📚 **Table of contents**

- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Contribution](#contribution)
- [Community](#community)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## 🚀 **Getting started**

### Requirements

- [Docker](https://docs.docker.com/compose/install/)

### Using Docker

> Currently, we do not have public image, so all examples assume execution from the root directory

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

Contribution is welcomed!

Start by reviewing the [contribution guidelines](CONTRIBUTING.md). After that, take a look at a [good first issue](https://github.com/epsagon/lupa/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## 💬 **Community**

Join our [Slack](https://join.slack.com/t/lupa-space/shared_invite/zt-1kyuehmaq-Dbut6qMpKak~SHx1DmZTEQ) for questions, support and fun.

## ❗ **Code of conduct**

We take our community seriously and we are dedicated to providing a safe and welcoming environment for everyone.
Please take a few minutes to review our [Code of Conduct](./CODE_OF_CONDUCT.md).

## 🪪 **License**

Copyright (c) Epsagon. [Apache 2.0 License](./LICENSE).
