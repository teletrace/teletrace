package api

import (
	"net/http"
	"net/http/httptest"
	"os"
	"oss-tracing/pkg/config"
	storage "oss-tracing/pkg/spanstorage/mock"
	"path"
	"path/filepath"
	"testing"

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

	storageMock, _ := storage.NewStorageMock()
	srMock, _ := storageMock.CreateSpanReader()

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
	storageMock, _ := storage.NewStorageMock()
	srMock, _ := storageMock.CreateSpanReader()

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
	storageMock, _ := storage.NewStorageMock()
	srMock, _ := storageMock.CreateSpanReader()

	api := NewAPI(fakeLogger, cfg, &srMock)

	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)
	assert.Equal(t, "pong", resRecorder.Body.String())
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
	storageMock, _ := storage.NewStorageMock()
	srMock, _ := storageMock.CreateSpanReader()

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
