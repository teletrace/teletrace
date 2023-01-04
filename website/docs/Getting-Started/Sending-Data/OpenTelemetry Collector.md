If you are currently using your own [**OpenTelemetry Collector**](https://opentelemetry.io/docs/collector/getting-started/ "OpenTelemetry Collector") and are interested in leveraging that collector and emitting your spans and traces to Lupa, all you need to do is add a new otlphttp exporter or otlp exporter to your `collector.yaml` file.

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
