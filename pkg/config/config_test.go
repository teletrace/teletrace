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

package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDefaultValuesSource(t *testing.T) {
	actualConfig, err := NewConfig()
	assert.NoError(t, err)
	expectedConfig := Config{Debug: debugDefault, APIPort: apiPortDefault, SpansStoragePlugin: spansStoragePluginDefault}

	assert.Equal(t, expectedConfig.Debug, actualConfig.Debug)
	assert.Equal(t, expectedConfig.APIPort, actualConfig.APIPort)
	assert.Equal(t, expectedConfig.SpansStoragePlugin, actualConfig.SpansStoragePlugin)
}

func TestConfigFileSource(t *testing.T) {
	expectedDebug := false
	expectedAPIPort := 1234
	expectedSpansStoragePlugin := "sqlite"

	content := []byte(fmt.Sprintf("DEBUG: %t\nAPI_PORT: %d\nSPANS_STORAGE_PLUGIN: %s", expectedDebug, expectedAPIPort, expectedSpansStoragePlugin))
	writeEnvFile(t, content)

	actualConfig, err := NewConfig()
	assert.NoError(t, err)
	expectedConfig := Config{Debug: expectedDebug, APIPort: expectedAPIPort, SpansStoragePlugin: expectedSpansStoragePlugin}

	assert.Equal(t, expectedConfig.Debug, actualConfig.Debug)
	assert.Equal(t, expectedConfig.APIPort, actualConfig.APIPort)
	assert.Equal(t, expectedConfig.SpansStoragePlugin, actualConfig.SpansStoragePlugin)
}

func TestEnvVarSource(t *testing.T) {
	expectedDebug := false
	expectedAPIPort := 1234
	expectedSpansStoragePlugin := "sqlite"

	t.Setenv("DEBUG", strconv.FormatBool(expectedDebug))
	t.Setenv("API_PORT", strconv.Itoa(expectedAPIPort))
	t.Setenv("SPANS_STORAGE_PLUGIN", expectedSpansStoragePlugin)

	actualConfig, err := NewConfig()
	assert.NoError(t, err)
	expectedConfig := Config{Debug: expectedDebug, APIPort: expectedAPIPort, SpansStoragePlugin: expectedSpansStoragePlugin}

	assert.Equal(t, expectedConfig.Debug, actualConfig.Debug)
	assert.Equal(t, expectedConfig.APIPort, actualConfig.APIPort)
	assert.Equal(t, expectedConfig.SpansStoragePlugin, actualConfig.SpansStoragePlugin)
}

func TestSourceOverrides(t *testing.T) {
	envAPIPort := 1234
	fileAPIPort := 5678

	t.Setenv("API_PORT", strconv.Itoa(envAPIPort))

	content := []byte(fmt.Sprintf("API_PORT: %d", fileAPIPort))
	writeEnvFile(t, content)

	actualConfig, err := NewConfig()
	assert.NoError(t, err)
	expectedConfig := Config{APIPort: envAPIPort}

	assert.Equal(t, expectedConfig.APIPort, actualConfig.APIPort)
}

func writeEnvFile(t *testing.T, content []byte) {
	path := filepath.Join(configPath, configFilename+"."+configFileExt)

	err := os.WriteFile(path, content, 0o644)
	assert.NoError(t, err)

	t.Cleanup(func() {
		err := os.Remove(path)
		assert.NoError(t, err)
	})
}
