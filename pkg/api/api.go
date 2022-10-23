package api

import (
	"context"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/creasty/defaults"
	"github.com/gin-contrib/static"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"go.uber.org/zap"

	"oss-tracing/pkg/config"
	spansquery "oss-tracing/pkg/model/spansquery/v1"
	spanstorage "oss-tracing/pkg/spanstorage"
)

const apiPrefix = "/v1"

var staticFilesPath = filepath.Join("web", "build")

// API holds the config used for running the API as well as
// the endpoint handlers and resources used by them (e.g. logger).
type API struct {
	logger     *zap.Logger
	config     config.Config
	router     *gin.Engine
	spanWriter *spanstorage.SpanWriter
	spanReader *spanstorage.SpanReader
}

// NewAPI creates and returns a new API instance.
func NewAPI(logger *zap.Logger, config config.Config, storage spanstorage.Storage) *API {
	router := newRouter(logger, config)

	spanWriter, err := storage.CreateSpanWriter()

	if err != nil {
		logger.Fatal("Failed to create spanWriter", zap.Error(err))
	}

	spanReader, err := storage.CreateSpanReader()

	if err != nil {
		logger.Fatal("Failed to create spanWriter", zap.Error(err))
	}

	api := &API{
		logger:     logger,
		config:     config,
		router:     router,
		spanWriter: &spanWriter,
		spanReader: &spanReader,
	}
	api.registerMiddlewares()
	api.registerRoutes()
	return api
}

func newRouter(logger *zap.Logger, config config.Config) *gin.Engine {
	setGinMode(config)
	router := gin.New()
	return router
}

func setGinMode(config config.Config) {
	mode := gin.DebugMode
	if !config.Debug {
		mode = gin.ReleaseMode
	}
	gin.SetMode(mode)
}

func (api *API) registerMiddlewares() {
	// zap logger middleware
	api.router.Use(ginzap.GinzapWithConfig(api.logger, &ginzap.Config{
		TimeFormat: time.RFC3339,
		UTC:        true,
	}))

	// zap recovery logger middleware
	api.router.Use(ginzap.RecoveryWithZap(api.logger, false))

	// static files middleware, for serving frontend files
	api.registerStaticFilesMiddleware()
}

func (api *API) registerStaticFilesMiddleware() {
	absStaticFilesPath, err := filepath.Abs(staticFilesPath)
	if err != nil {
		api.logger.Fatal("Failed to determine static files absolute path", zap.Error(err))
	}
	api.router.Use(static.Serve("/", static.LocalFile(absStaticFilesPath, false)))
	api.router.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.RequestURI, apiPrefix) {
			c.File(filepath.Join(absStaticFilesPath, "index.html"))
		}
	})
}

func (api *API) registerRoutes() {
	v1 := api.router.Group(apiPrefix)
	v1.GET("/ping", api.getPing)
	v1.GET("/search", api.searchSpans)
}

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func (api *API) getTraceById(c *gin.Context) {
	var err error

	f := spansquery.SearchFilter{
		KeyValueFilter: &spansquery.KeyValueFilter{
			Key:      "Span.TraceId",
			Operator: "equals",
			Value:    c.Param("id"),
		},
	}

	req := &spansquery.SearchRequest{}

	if err = defaults.Set(req); err != nil {
		c.String(500, "Could not create default searchRequest: %+v", err)
	}

	req.Timeframe = spansquery.Timeframe{
		StartTime: time.Unix(0, 0),
		EndTime:   time.Now(),
	}

	req.SearchFilter = []spansquery.SearchFilter{f}

	res, err := (*api.spanReader).Search(context.Background(), req)

	if err != nil {
		c.String(500, "Could not get trace by id: %+v", err)
	}

	c.JSON(200, res.Spans)
}

func (api *API) searchSpans(c *gin.Context) {
	var err error

	req := spansquery.SearchRequest{}
	err = mapstructure.Decode(c.Request.URL.Query(), &req)

	if err != nil {
		c.String(400, "Could not parse Search request: %+v", err)
	}

	res, err := (*api.spanReader).Search(context.Background(), &req)
	if err != nil {
		c.String(500, "Could not search spans: %+v", err)
	}
	c.JSON(200, res.Spans)
}

// Start runs the configured API instance.
func (api *API) Start() error {
	return api.router.Run(fmt.Sprintf(":%d", api.config.APIPort))
}
