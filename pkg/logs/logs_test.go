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
