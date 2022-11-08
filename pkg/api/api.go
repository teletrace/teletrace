package api

import (
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/static"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"oss-tracing/pkg/config"
	storage "oss-tracing/pkg/spanstorage"
)

const apiPrefix = "/v1"

var staticFilesPath = filepath.Join("web", "build")

// API holds the config used for running the API as well as
// the endpoint handlers and resources used by them (e.g. logger).
type API struct {
	logger     *zap.Logger
	config     config.Config
	router     *gin.Engine
	spanReader *storage.SpanReader
}

// NewAPI creates and returns a new API instance.
func NewAPI(logger *zap.Logger, config config.Config, sr *storage.SpanReader) *API {
	router := newRouter(logger, config)
	api := &API{
		logger:     logger,
		config:     config,
		router:     router,
		spanReader: sr,
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

	// error handling middleware
	api.router.Use(errorHandler)

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
	v1.POST("/search", api.search)
}

// Start runs the configured API instance.
// Blocks the goroutine indefinitely unless an error happens.
func (api *API) Start() error {
	return api.router.Run(fmt.Sprintf(":%d", api.config.APIPort))
}
