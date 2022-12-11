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

package logs

import (
	"log"
	"oss-tracing/pkg/config"

	"go.uber.org/zap"
)

// NewLogger returns a new zap logger with custom config based on the debug mode.
func NewLogger(cfg config.Config) (*zap.Logger, error) {
	if cfg.Debug {
		return zap.NewDevelopment()
	}
	return zap.NewProduction()
}

// FlushBufferedLogs attempts to flush any buffered log entries of a zap logger.
// It is recommended to call it before the process exists.
func FlushBufferedLogs(logger *zap.Logger) {
	if err := logger.Sync(); err != nil {
		log.Printf("Error flushing buffered logs: %v", err)
	}
}
