# Copyright The OpenTelemetry Authors
# Modifications copyright (C) 2022 Cisco Systems, Inc.
# Link to external file
# https://github.com/open-telemetry/opentelemetry-go-contrib/blob/v0.14.0/instrumentation/net/http/otelhttp/example/server/server.go
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FROM golang:1.18
COPY . /usr/src/client/
WORKDIR /usr/src/client/
RUN go env -w GOPROXY=direct
RUN go install ./main.go
CMD ["/go/bin/main"]
