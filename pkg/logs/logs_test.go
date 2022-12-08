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
	"oss-tracing/pkg/config"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func TestNewDevLogger(t *testing.T) {
	logger, err := NewLogger(config.Config{Debug: true})
	assert.NoError(t, err)

	assert.True(t, isLoggerLvlEnabled(logger, zap.DebugLevel))
}

func TestNewProdLogger(t *testing.T) {
	logger, err := NewLogger(config.Config{Debug: false})
	assert.NoError(t, err)

	assert.False(t, isLoggerLvlEnabled(logger, zap.DebugLevel))
	assert.True(t, isLoggerLvlEnabled(logger, zap.InfoLevel))
}

func isLoggerLvlEnabled(logger *zap.Logger, lvl zapcore.Level) bool {
	return logger.Core().Enabled(lvl)
}
