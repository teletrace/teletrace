Send traces to **Lupa** directly from your code using an OTLP Trace Exporter.

### 1. Download the [latest version](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar).

This package includes the instrumentation agent as well as
instrumentations for all supported libraries and all available data exporters.
The package provides a completely automatic, out-of-the-box experience.

### 2. Run the following code in your Terminal to initiate the SDK

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

### 3. Redeploy and run your code

Make sure your updated code is running. Invoke the instrumented code.

### 4. Visit Lupa's spans page

You should be able to find the newly created span in Lupa's spans page. You can use filters to narrow down shown results to find the new spans more easily.
