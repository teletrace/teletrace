package api

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"oss-tracing/pkg/config"
	"path"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestLoggerMiddleware(t *testing.T) {
	pingRoute := "/v1/ping"
	fakeLogger, observedLogs := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, pingRoute, nil)
	resRecorder := httptest.NewRecorder()

	api := NewAPI(fakeLogger, cfg)
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

	api := NewAPI(fakeLogger, cfg)
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
	req, _ := http.NewRequest(http.MethodGet, "/v1/ping", nil)
	resRecorder := httptest.NewRecorder()

	api := NewAPI(fakeLogger, cfg)
	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)
	assert.Equal(t, "pong", resRecorder.Body.String())
}

func TestStaticRoute(t *testing.T) {
	testRoot, _ := os.Getwd()
	err := os.MkdirAll(path.Join(testRoot, staticFilesPath), os.ModePerm)
	assert.NoError(t, err)
	f, err := os.Create(fmt.Sprintf("%s%s/index.html", testRoot, staticFilesPath))
	assert.NoError(t, err)
	defer os.RemoveAll(path.Join(testRoot, "/web"))
	_, err = f.WriteString("Body Content")
	assert.NoError(t, err)
	f.Close()

	fakeLogger, _ := getLoggerObserver()
	cfg := config.Config{Debug: false}
	req, _ := http.NewRequest(http.MethodGet, "/", nil)
	resRecorder := httptest.NewRecorder()

	api := NewAPI(fakeLogger, cfg)
	api.router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)
	assert.Equal(t, "Body Content", resRecorder.Body.String())
}

func getLoggerObserver() (*zap.Logger, *observer.ObservedLogs) {
	zapCore, observedLogs := observer.New(zap.InfoLevel)
	fakeLogger := zap.New(zapCore)
	return fakeLogger, observedLogs
}
