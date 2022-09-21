# collector

The `cmd/collector` package is responsible for building the trace collection components as a single executable.\
Traces in OTLP format can be received in both gRPC (default port: 4317) and HTTP (default port: 4318).

## Configuration

This package is using [config options](../../pkg/config/README.md) provided by `pkg/config`.

## Development

```sh
go run .
```

## Usage Example

HTTP request example:

```sh
curl --request POST 'http://localhost:4318/v1/traces' \
--header 'Content-Type: application/json' \
--data-raw '{
    "resource_spans": [
        {
            "resource": {
                "attributes": [
                    {
                        "key": "host.name",
                        "value": {
                            "stringValue": "testHost"
                        }
                    }
                ]
            },
            "scope_spans": [
                {
                    "spans": [
                        {
                            "trace_id": "5B8EFFF798038103D269B633813FC60C",
                            "span_id": "EEE19B7EC3C1B174",
                            "parent_span_id": "EEE19B7EC3C1B173",
                            "name": "testSpan",
                            "start_time_unix_nano": 1544712660300000000,
                            "end_time_unix_nano": 1544712660600000000,
                            "kind": 2,
                            "attributes": [
                                {
                                    "key": "attr1",
                                    "value": {
                                        "intValue": 55
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}'
```
