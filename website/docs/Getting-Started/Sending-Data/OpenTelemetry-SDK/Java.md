Send traces to **Lupa** directly from your code using an OTLP Trace Exporter.

### 1. Run the following code in your Terminal to initiate the SDK
```bash
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
export OTEL_METRICS_EXPORTER=none
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://your-endpoint
export OTEL_EXPORTER_OTLP_HEADERS="authorization=Bearer <Your Lupa Token>"

java -javaagent:./opentelemetry_javaagent.jar \
  -jar <myapp>.jar
```

### 2. Redeploy and run your code
Make sure your updated code is running. Invoke the instrumented code.

### 3. Visit Lupa's spans page
You should be able to find the newly created span in Lupa's spans page. You can use filters to narrow down shown results to find the new spans more easily.