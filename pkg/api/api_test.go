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

package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path"
	"path/filepath"
	"testing"
	"time"

	"github.com/teletrace/teletrace/pkg/config"
	"github.com/teletrace/teletrace/pkg/model"
	spansquery "github.com/teletrace/teletrace/pkg/model/spansquery/v1"
	"github.com/teletrace/teletrace/pkg/model/tagsquery/v1"
	spanreader "github.com/teletrace/teletrace/pkg/spanreader/mock"

	spanformatutiltests "github.com/teletrace/teletrace/model/internalspan/v1/util"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestLoggerMiddleware(t *testing.T) {
	pingRoute := path.Join(apiPrefix, "/ping")
	fakeLogger, observedLogs := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, pingRoute, nil)
	resRecorder := httptest.NewRecorder()

	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)
	api.router.ServeHTTP(resRecorder, req)

	logs := observedLogs.All()
	assert.Equal(t, 1, len(logs))
	logFields := logs[0].ContextMap()
	assert.Equal(t, pingRoute, logFields["path"])
	assert.Equal(t, http.MethodGet, logFields["method"])
}

func TestRecoveryLoggerMiddleware(t *testing.T) {
	panicRoute := "/panic-test-route"
	panicMsg := "this is a test panic"
	fakeLogger, observedLogs := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, panicRoute, nil)
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)
	api.router.GET(panicRoute, func(c *gin.Context) {
		panic(panicMsg)
	})
	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, 2, observedLogs.Len())

	recoveryLog := observedLogs.FilterMessage("[Recovery from panic]")
	assert.Equal(t, 1, recoveryLog.Len())
	recoveryLogFields := recoveryLog.All()[0].ContextMap()
	assert.Equal(t, panicMsg, recoveryLogFields["error"])

	routeLog := observedLogs.FilterMessage(panicRoute)
	assert.Equal(t, 1, routeLog.Len())
	routeLogFields := routeLog.All()[0].ContextMap()
	assert.Equal(t, panicRoute, routeLogFields["path"])
	assert.Equal(t, int64(500), routeLogFields["status"])
}

func TestPingRoute(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, path.Join(apiPrefix, "/ping"), nil)
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)
	assert.Equal(t, "pong", resRecorder.Body.String())
}

func TestSearchRoute(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	jsonBody := []byte(fmt.Sprintf("{\"timeframe\": { \"startTime\": 0, \"endTime\": %v }}", time.Now().UnixNano()))
	req, _ := http.NewRequest(http.MethodPost, path.Join(apiPrefix, "/search"), bytes.NewReader(jsonBody))
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)

	var resBody *spansquery.SearchResponse
	err := json.NewDecoder(resRecorder.Body).Decode(&resBody)
	assert.Nil(t, err)
	assert.NotNil(t, resBody)
	assert.NotEmpty(t, resBody.Spans)
	expectedSpanId := spanformatutiltests.GenInternalSpan(nil, nil, nil).Span.SpanId
	assert.Equal(t, expectedSpanId, resBody.Spans[0].Span.SpanId)
}

func TestGetTraceById(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	expectedTraceId := spanformatutiltests.GenInternalSpan(nil, nil, nil).Span.TraceId
	req, _ := http.NewRequest(http.MethodGet, path.Join(apiPrefix, fmt.Sprintf("/trace/%v", expectedTraceId)), nil)
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)

	var resBody *spansquery.SearchResponse
	err := json.NewDecoder(resRecorder.Body).Decode(&resBody)
	assert.Nil(t, err)
	assert.NotNil(t, resBody)
	assert.NotEmpty(t, resBody.Spans)
	assert.Equal(t, expectedTraceId, resBody.Spans[0].Span.TraceId)
}

func TestGetAvailableTags(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, path.Join(apiPrefix, "/tags"), nil)
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)

	var resBody *tagsquery.GetAvailableTagsResponse
	err := json.NewDecoder(resRecorder.Body).Decode(&resBody)
	assert.Nil(t, err)
	assert.NotNil(t, resBody)
	assert.NotEmpty(t, resBody)
	const mockTagName = "custom-tag"
	assert.Equal(t, mockTagName, resBody.Tags[0].Name)
}

func TestTagsValues(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	expectedTag := "span.attributes.custom-tag"
	jsonBody := []byte(fmt.Sprintf("{\"timeframe\": { \"startTime\": 0, \"endTime\": %v }}", time.Now().UnixNano()))
	req, _ := http.NewRequest(http.MethodPost, path.Join(apiPrefix, fmt.Sprintf("/tags/%v", expectedTag)), bytes.NewReader(jsonBody))
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)

	var resBody *tagsquery.TagValuesResponse
	err := json.NewDecoder(resRecorder.Body).Decode(&resBody)
	assert.Nil(t, err)
	assert.NotNil(t, resBody)
	assert.NotEmpty(t, resBody.Values)

	expectedValue := "custom-value"
	expectedValueCount := 3
	assert.Equal(t, expectedValue, resBody.Values[0].Value)
	assert.Equal(t, expectedValueCount, resBody.Values[0].Count)
}

func TestSearchRouteWithMalformedRequestBody(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	malformedBody := []byte("{\"timeframe\": { startTime\": 0, \"endTime\": }}")
	req, _ := http.NewRequest(http.MethodPost, path.Join(apiPrefix, "/search"), bytes.NewReader(malformedBody))
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusBadRequest, resRecorder.Code)

	var resBody *errorResponse
	err := json.NewDecoder(resRecorder.Body).Decode(&resBody)
	assert.Nil(t, err)
	assert.NotNil(t, resBody.ErrorMessage)
}

func TestTagsValuesWithMalformedRequestBody(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	mockTag := "span.attributes.custom-tag"
	mockTag2 := "span.attributes.custom-tag2"
	malformedBody := []byte("{\"timeframe\": { startTime\": 0, \"endTime\": }}")
	req, _ := http.NewRequest(http.MethodPost, path.Join(apiPrefix, fmt.Sprintf("/tags/%v,%v", mockTag, mockTag2)), bytes.NewReader(malformedBody))
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusBadRequest, resRecorder.Code)
}

func TestTagsStatistics(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	body := tagsquery.TagStatisticsRequest{
		DesiredStatistics: []tagsquery.TagStatistic{"min", "max", "avg", "p99"},
		Timeframe: &model.Timeframe{
			StartTime: 0,
			EndTime:   0,
		},
	}
	jsonBody, _ := json.Marshal(&body)
	req, _ := http.NewRequest(http.MethodPost, path.Join(apiPrefix, "/tags/someNumber/statistics"), bytes.NewReader(jsonBody))
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)

	var resBody *tagsquery.TagStatisticsResponse
	err := json.NewDecoder(resRecorder.Body).Decode(&resBody)
	assert.Nil(t, err)
	assert.NotNil(t, resBody)
	assert.NotEmpty(t, resBody.Statistics)

	expectedMin := 0.0
	expectedMax := 10.0
	expectedAverage := 5.0
	expectedP99 := 9.0
	assert.Equal(t, expectedMin, resBody.Statistics[tagsquery.MIN])
	assert.Equal(t, expectedMax, resBody.Statistics[tagsquery.MAX])
	assert.Equal(t, expectedAverage, resBody.Statistics[tagsquery.AVG])
	assert.Equal(t, expectedP99, resBody.Statistics[tagsquery.P99])
}

func TestRootStaticRoute(t *testing.T) {
	runStaticFilesRouteTest(t, "/")
}

func TestNonAPIRouteStaticResponse(t *testing.T) {
	runStaticFilesRouteTest(t, "/non-existing-path")
}

func runStaticFilesRouteTest(t *testing.T, testedRoute string) {
	expectedContent := "Some content"
	createStaticFile(t, expectedContent)

	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, testedRoute, nil)
	resRecorder := httptest.NewRecorder()
	srMock, _ := spanreader.NewSpanReaderMock()

	api := NewAPI(fakeLogger, cfg, &srMock)
	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)
	assert.Equal(t, expectedContent, resRecorder.Body.String())
}

func createStaticFile(t *testing.T, content string) {
	absStaticFilesPath, err := filepath.Abs(staticFilesPath)
	assert.NoError(t, err)
	err = os.MkdirAll(absStaticFilesPath, os.ModePerm)
	assert.NoError(t, err)
	t.Cleanup(func() {
		err := os.RemoveAll(filepath.Dir(absStaticFilesPath))
		assert.NoError(t, err)
	})
	err = os.WriteFile(filepath.Join(absStaticFilesPath, "index.html"), []byte(content), os.ModePerm)
	assert.NoError(t, err)
}

func getLoggerObserver() (*zap.Logger, *observer.ObservedLogs) {
	zapCore, observedLogs := observer.New(zap.InfoLevel)
	fakeLogger := zap.New(zapCore)
	return fakeLogger, observedLogs
}
