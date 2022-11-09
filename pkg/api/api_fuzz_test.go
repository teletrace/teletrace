package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"oss-tracing/pkg/config"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	storage "oss-tracing/pkg/spanstorage/mock"
	"path"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func FuzzSearchRoute(f *testing.F) {
	testCases := [][]byte{
		[]byte(fmt.Sprintf("{\"timeframe\": { \"startTime\": -50, \"endTime\": %v }}", time.Now().UnixNano())),
		[]byte(fmt.Sprintf("{\"timeframe\": { \"startTime\": 0, \"endTime\": %v }}", time.Now().UnixNano())),
	}
	for _, tc := range testCases {
		f.Add(tc)
	}
	f.Fuzz(func(t *testing.T, payload []byte) {
		fakeLogger, _ := getLoggerObserver()
		cfg := config.Config{Debug: false}
		req, _ := http.NewRequest(http.MethodPost, path.Join(apiPrefix, "/search"), bytes.NewReader(payload))
		resRecorder := httptest.NewRecorder()
		storageMock, _ := storage.NewStorageMock()
		srMock, _ := storageMock.CreateSpanReader()
		api := NewAPI(fakeLogger, cfg, &srMock)
		api.router.ServeHTTP(resRecorder, req)

		var resBody *spansquery.SearchResponse
		resDecodeErr := json.NewDecoder(resRecorder.Body).Decode(&resBody)
		assert.Nil(f, resDecodeErr)

		expectedStatusCodes := []int{
			http.StatusOK, http.StatusInternalServerError, http.StatusBadRequest,
		}
		isInExpectedStatusCodes := false
		for _, code := range expectedStatusCodes {
			if resRecorder.Code == code {
				isInExpectedStatusCodes = true
			}
		}
		assert.True(f, isInExpectedStatusCodes)
	})
}
