# Instrumentation

Instrumentation is the practice of adding additional code to an application to generate runtime information, 
like execution time and other metrics, to be used for troubleshooting, performance optimizations and to track execution flow.

We can instrument our code in a various or ways, and the output format can change from implementation to implementation, 
fortunately though, by utilizing OpenTelemetry, which is a community driven specification for instrumentation data, 
we gain access to a vast collection of instrumentation libraries, written for a variety of languages 
and in a format that is accepted by most vendors in the industry.

## Manual Instrumentation

Manual instrumentation is the most basic form of instrumentation, you can think of it like upgraded debug prints,
we manually include instrumentation points to the application code to gather information we think would be necessary in the future.

Manual instrumentation is usually done using an SDK of some sort, and OpenTelemetry has SDKs for all supported languages.

## Automatic Instrumentation

The major benefit of using a tool like OpenTelemetry is that we can leverage _automatic instrumentation_ 
that will give us lots information out of the box, without the need for any code changes.

Automatic Instrumentation is usually done by injecting instrumentation libraries at runtime and modifying the executed code on the fly.

## Further Reading

The topic of instrumentation is a major topic and probably too deep to fully explain here, please refer to the OpenTelemetry guides:

- <https://opentelemetry.io/docs/concepts/instrumenting/>
- <https://opentelemetry.io/docs/instrumentation/>
