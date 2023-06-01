# Features

## Native support for OpenTelemetry

Teletrace natively supports the [OpenTelemetry](https://opentelemetry.io/) standard for incoming traces which allows users to instrument their application in an open-source,
community driven and non-vendor locked way, as well as to provide our users a wide range of high-quality instrumentation libraries that should cover most if not all of the tech stack used.

## Easy to install

Teletrace can be easily installed using our [Helm Chart](https://github.com/teletrace/helm-charts)
or by using our [Docker Image](https://hub.docker.com/r/teletrace/teletrace).

## Advanced UI

Teletrace is using an advanced and modern UI to allow for easy querying and visualization of your traces.

## Extensible through Plugins

Teletrace was designed from the ground up to be extensible through the use of plugins,
to avoid coupling our users with a specific storage solution for traces.

From our experience we know that managing and scaling database solutions is an extremely hard task,
and we want to provide an option to use existing knowledge to manage the storage solution for any given installation.

### Supported Storage Backends

Currently the supported backends are:

- Elasticsearch (version 8+)
- SQLite

We are working on adding more storage plugins and would happily accept contributions from the community.
