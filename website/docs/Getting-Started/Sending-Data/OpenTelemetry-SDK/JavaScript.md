Send traces to **Lupa** directly from your code using an OTLP Trace Exporter.

### 1. Insert the following code section into your application:

```javascript
const traceProvider = new NodeTracerProvider({
  resource: Resource(),
});
const collectorOptions = {
  url: "your_endpoint",
};
const httpExporter = new HTTPTraceExporter(collectorOptions);
traceProvider.addSpanProcessor(new BatchSpanProcessor(httpExporter));
```

### 2. Redeploy and run your code

Make sure your updated code is running. Invoke the instrumented code.

### 3. Visit Lupa's spans page

You should be able to find the newly created span in Lupa's spans page. You can use filters to narrow down shown results to find the new spans more easily.
