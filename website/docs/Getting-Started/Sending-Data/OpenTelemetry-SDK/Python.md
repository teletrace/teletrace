Send traces to **Lupa** directly from your code using an OTLP Trace Exporter.

### 1. Insert the following code section into your application:
```python
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter as OTLPHTTPExporter,
)

provider = TracerProvider(resource=Resource.create())
trace.set_tracer_provider(provider)

http_exporter = OTLPHTTPExporter(
  endpoint="your_endpoint",
  headers= {
    "authorization": "Bearer <Your Lupa Token>",
  },
)

processor = BatchSpanProcessor(http_exporter)
provider.add_span_processor(processor)
```

### 2. Redeploy and run your code
Make sure your updated code is running. Invoke the instrumented code.

### 3. Visit Lupa's spans page
You should be able to find the newly created span in Lupa's spans page. You can use filters to narrow down shown results to find the new spans more easily.