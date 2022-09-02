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
	pingRoute := "/v1/ping"

	zapCore, observedLogs := observer.New(zap.InfoLevel)
	fakeLogger := zap.New(zapCore)

	req, _ := http.NewRequest(http.MethodGet, pingRoute, nil)
	w := httptest.NewRecorder()

	router := setupRouter(fakeLogger)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "pong", w.Body.String())

	logs := observedLogs.All()
	assert.Equal(t, 1, len(logs))
	logFields := logs[0].ContextMap()
	assert.Equal(t, pingRoute, logFields["path"])
	assert.Equal(t, http.MethodGet, logFields["method"])
}
