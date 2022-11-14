package api

import (
	"fmt"
	"math/rand"
	"net/http"
	"oss-tracing/pkg/model"
	v1 "oss-tracing/pkg/model/internalspan/v1"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	"oss-tracing/pkg/model/tagsquery/v1"
	"time"

	"github.com/gin-gonic/gin"
)

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func (api *API) search(c *gin.Context) {
	var req spansquery.SearchRequest
	isValidationError := api.validateRequestBody(&req, c)
	if isValidationError {
		return
	}

	res := spansquery.SearchResponse{
		Metadata: &spansquery.Metadata{NextToken: ""},
		Spans:    GetSpans(),
	}

	c.JSON(http.StatusOK, res)
}

func GetSpans() []*v1.InternalSpan {
	var spans []*v1.InternalSpan
	for i := 0; i <= 50; i++ {
		spans = append(spans, generateInternalSpan())
	}
	return spans
}

func generateSpan() *v1.Span {
	statusCodes := []uint32{0, 2}

	return &v1.Span{
		TraceId: fmt.Sprintf("trace-%v", rand.Int()),
		SpanId:  fmt.Sprintf("span-%v", rand.Int()),
		Name:    "test",
		Status: &v1.SpanStatus{
			Message: "test message",
			Code:    statusCodes[rand.Intn(2)],
		},
		StartTimeUnixNano: uint64(time.Now().UnixMilli()),
		EndTimeUnixNano:   uint64(time.Now().UnixMilli() + int64(rand.Intn(200))),
	}
}

func generateInternalSpan() *v1.InternalSpan {
	serviceNames := []string{"card-operations-service", "payment-service", "api-gateway"}
	return &v1.InternalSpan{
		Resource: &v1.Resource{
			Attributes: v1.Attributes{"service.name": serviceNames[rand.Intn(3)]},
		},
		ExternalFields: &v1.ExternalFields{
			DurationNano: uint64(rand.Intn(10000)),
		},
		Span: generateSpan(),
	}
}

func (api *API) getTraceById(c *gin.Context) {
	traceId := c.Param("id")
	sr := &spansquery.SearchRequest{
		Timeframe: model.Timeframe{
			StartTime: 0,
			EndTime:   uint64(time.Now().UnixNano()),
		},
		SearchFilters: []spansquery.SearchFilter{
			{
				KeyValueFilter: &spansquery.KeyValueFilter{
					Key:      "span.traceId",
					Operator: spansquery.OPERATOR_EQUALS,
					Value:    traceId,
				},
			},
		},
	}

	res, err := (*api.spanReader).Search(c, sr)
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, res)
}

func (api *API) getAvailableTags(c *gin.Context) {
	res, err := (*api.spanReader).GetAvailableTags(c, model.GetAvailableTagsRequest{})
	if err != nil {
		respondWithError(http.StatusInternalServerError, err, c)
		return
	}

	c.JSON(http.StatusOK, res)
}

func (api *API) tagsValues(c *gin.Context) {
	var req tagsquery.TagValuesRequest
	isValidationError := api.validateRequestBody(&req, c)
	if isValidationError {
		return
	}
	tag := c.Request.URL.Query().Get("tag")

	res := tagsquery.TagValuesResponse{}

	switch tag {
	case "service.name":
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "api-gateway",
				Count: rand.Intn(200),
			},
			{
				Value: "card-operations-service",
				Count: rand.Intn(200),
			},
			{
				Value: "payment-service",
				Count: rand.Intn(200),
			},
		}
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "api-gateway",
				Count: rand.Intn(200),
			},
			{
				Value: "card-operations-service",
				Count: rand.Intn(200),
			},
			{
				Value: "payment-service",
				Count: rand.Intn(200),
			},
		}
	case "http.route":
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "/v2/cards",
				Count: rand.Intn(200),
			},
			{
				Value: "/v3/payments",
				Count: rand.Intn(200),
			},
		}
	case "http.status_code":
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "200",
				Count: rand.Intn(200),
			},
			{
				Value: "404",
				Count: rand.Intn(50),
			},
			{
				Value: "500",
				Count: rand.Intn(50),
			},
		}
	case "http.method":
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "GET",
				Count: rand.Intn(1000),
			},
			{
				Value: "POST",
				Count: rand.Intn(1000),
			},
			{
				Value: "PUT",
				Count: rand.Intn(1000),
			},
			{
				Value: "DELETE",
				Count: rand.Intn(1000),
			},
			{
				Value: "PATCH",
				Count: rand.Intn(1000),
			},
		}

	case "instrumentation.library":
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "OpenTelemetry Java 1.20.0",
				Count: rand.Intn(200),
			},
			{
				Value: "OpenTelemetry Go 1.11.1",
				Count: rand.Intn(200),
			},
			{
				Value: "OpenTelemetry Python 1.14.0",
				Count: rand.Intn(50),
			},
		}

	default:
		res.Values = []tagsquery.TagValueInfo{
			{
				Value: "val1",
				Count: rand.Intn(1000),
			},
			{
				Value: "val2",
				Count: rand.Intn(1000),
			},
		}

	}

	c.JSON(http.StatusOK, res)
}
