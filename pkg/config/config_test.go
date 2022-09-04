package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestDefaultConfig(t *testing.T) {
	actualConfig, logs := runNewConfig(t)
	expectedConfig := Config{Debug: debugDefault, APIPort: apiPortDefault}

	fileNotFoundLog := logs.FilterMessage("Optional config file not found. Skipping")
	assert.Equal(t, 1, fileNotFoundLog.Len())

	assert.Equal(t, expectedConfig, actualConfig)
}

func TestEnvFileConfig(t *testing.T) {
	expectedDebug := false
	expectedAPIPort := 1234

	content := []byte(fmt.Sprintf("DEBUG: %t\nAPI_PORT: %d", expectedDebug, expectedAPIPort))
	writeEnvFile(t, content)

	actualConfig, _ := runNewConfig(t)
	expectedConfig := Config{Debug: expectedDebug, APIPort: expectedAPIPort}

	assert.Equal(t, expectedConfig, actualConfig)
}

func TestEnvVarConfig(t *testing.T) {
	expectedDebug := false
	expectedAPIPort := 1234

	t.Setenv("DEBUG", strconv.FormatBool(expectedDebug))
	t.Setenv("API_PORT", strconv.Itoa(expectedAPIPort))

	actualConfig, _ := runNewConfig(t)
	expectedConfig := Config{Debug: expectedDebug, APIPort: expectedAPIPort}

	assert.Equal(t, expectedConfig, actualConfig)
}

func TestEnvSourceOverride(t *testing.T) {
	envAPIPort := 1234
	fileAPIPort := 5678

	t.Setenv("API_PORT", strconv.Itoa(envAPIPort))

	content := []byte(fmt.Sprintf("API_PORT: %d", fileAPIPort))
	writeEnvFile(t, content)

	actualConfig, _ := runNewConfig(t)
	expectedConfig := Config{APIPort: envAPIPort}

	assert.Equal(t, expectedConfig.APIPort, actualConfig.APIPort)
}

func writeEnvFile(t *testing.T, content []byte) {
	path := filepath.Join(configPath, configFilename+"."+configFileExt)

	err := os.WriteFile(path, content, 0644)
	assert.NoError(t, err)

	t.Cleanup(func() {
		err := os.Remove(path)
		assert.NoError(t, err)
	})
}

func runNewConfig(t *testing.T) (Config, *observer.ObservedLogs) {
	zapCore, observedLogs := observer.New(zap.InfoLevel)
	fakeLogger := zap.New(zapCore)

	actualConfig, err := NewConfig(fakeLogger)
	assert.NoError(t, err)

	return actualConfig, observedLogs
}
