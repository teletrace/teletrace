package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDefaultConfig(t *testing.T) {
	actualConfig, err := createConfig()
	assert.NoError(t, err)

	expectedConfig := ApiConfig{Port: defaultPort, Debug: defaultDebug}

	assert.Equal(t, expectedConfig, actualConfig)
}

func TestEnvFileConfig(t *testing.T) {
	expectedPort := 1234
	expectedDebug := false

	content := []byte(fmt.Sprintf("PORT: %d\nDEBUG: %t", expectedPort, expectedDebug))
	writeEnvFile(t, content)

	actualConfig, err := createConfig()
	assert.NoError(t, err)

	expectedConfig := ApiConfig{Port: expectedPort, Debug: expectedDebug}

	assert.Equal(t, expectedConfig, actualConfig)
}

func TestEnvVarConfig(t *testing.T) {
	expectedPort := 1234
	expectedDebug := false

	t.Setenv("PORT", strconv.Itoa(expectedPort))
	t.Setenv("DEBUG", strconv.FormatBool(expectedDebug))

	actualConfig, err := createConfig()
	assert.NoError(t, err)

	expectedConfig := ApiConfig{Port: expectedPort, Debug: expectedDebug}

	assert.Equal(t, expectedConfig, actualConfig)
}

func TestEnvSourceOverride(t *testing.T) {
	filePort := 1234
	envPort := 5678

	t.Setenv("PORT", strconv.Itoa(envPort))

	content := []byte(fmt.Sprintf("PORT: %d", filePort))
	writeEnvFile(t, content)

	actualConfig, err := createConfig()
	assert.NoError(t, err)

	expectedConfig := ApiConfig{Port: envPort, Debug: defaultDebug}

	assert.Equal(t, expectedConfig, actualConfig)
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
