/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 package usageReport

import (
	"context"
	cloudevents "github.com/cloudevents/sdk-go/v2"
	"go.uber.org/zap"
	"log"
	"oss-tracing/pkg/model/usageevents"
)

type UsageReporter struct {
	ctx                context.Context
	logger             *zap.Logger
	systemId           string
	cloudEventEndpoint string
}

func (r *UsageReporter) ReportSystemUp() {
	c, err := cloudevents.NewClientHTTP()
	if err != nil {
		log.Fatalf("failed to create client, %v", err)
	}

	// Create an Event.
	event := usageevents.CreateUpEvent(r.systemId)
	// Set a target.
	ctx := cloudevents.ContextWithTarget(r.ctx, r.cloudEventEndpoint)
	// Send that Event.
	result := c.Send(ctx, event)
	if cloudevents.IsUndelivered(result) || len(result.Error()) != 0 {
		r.logger.Error("failed to send cloudEvent", zap.Error(result))
	}
}

func NewUsageReporter(ctx context.Context, logger *zap.Logger, systemId string, eventsEndpoint string) (*UsageReporter, error) {
	return &UsageReporter{
		logger:             logger,
		ctx:                ctx,
		systemId:           systemId,
		cloudEventEndpoint: eventsEndpoint,
	}, nil
}
