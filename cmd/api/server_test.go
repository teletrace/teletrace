package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

func TestPingRoute(t *testing.T) {
	fakeLogger, _ := getLoggerObserver()
	req, _ := http.NewRequest(http.MethodGet, "/v1/ping", nil)
	resRecorder := httptest.NewRecorder()

	router := setupRouter(fakeLogger)
	router.ServeHTTP(resRecorder, req)

	assert.Equal(t, http.StatusOK, resRecorder.Code)
	assert.Equal(t, "pong", resRecorder.Body.String())
}

func TestLoggerMiddleware(t *testing.T) {
	pingRoute := "/v1/ping"
	fakeLogger, observedLogs := getLoggerObserver()
	req, _ := http.NewRequest(http.MethodGet, pingRoute, nil)
	resRecorder := httptest.NewRecorder()

	router := setupRouter(fakeLogger)
	router.ServeHTTP(resRecorder, req)

	logs := observedLogs.All()
	assert.Equal(t, 1, len(logs))
	logFields := logs[0].ContextMap()
	assert.Equal(t, pingRoute, logFields["path"])
	assert.Equal(t, http.MethodGet, logFields["method"])
}

func getLoggerObserver() (*zap.Logger, *observer.ObservedLogs) {
	zapCore, observedLogs := observer.New(zap.InfoLevel)
	fakeLogger := zap.New(zapCore)
	return fakeLogger, observedLogs
}
