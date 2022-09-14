package api

import (
	"fmt"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"github.com/gin-contrib/static"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"oss-tracing/pkg/config"
)

const staticFilesPath = "/web/build"

// API holds the config used for running the API as well as
// the endpoint handlers and resources used by them (e.g. logger).
type API struct {
	logger *zap.Logger
	config config.Config
	router *gin.Engine
}

// NewAPI creates and returns a new API instance.
func NewAPI(logger *zap.Logger, config config.Config) *API {
	router := newRouter(logger, config)
	api := &API{
		logger: logger,
		config: config,
		router: router,
	}
	api.registerRoutes()

	return api
}

func newRouter(logger *zap.Logger, config config.Config) *gin.Engine {
	setGinMode(config)
	router := gin.New()

	// zap logger middleware
	router.Use(ginzap.GinzapWithConfig(logger, &ginzap.Config{
		TimeFormat: time.RFC3339,
		UTC:        true,
	}))

	// zap recovery logger middleware
	router.Use(ginzap.RecoveryWithZap(logger, false))

	return router
}

func setGinMode(config config.Config) {
	mode := gin.DebugMode
	if !config.Debug {
		mode = gin.ReleaseMode
	}
	gin.SetMode(mode)
}

func (api *API) registerRoutes() {
	currentRootPath, err := os.Getwd()
	if err != nil {
		api.logger.Fatal("Failed to find current root path", zap.Error(err))
	}
	absoluteStaticFilesPath := path.Join(currentRootPath, staticFilesPath)
	api.router.Use(static.Serve("/", static.LocalFile(absoluteStaticFilesPath, false)))
	api.router.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.RequestURI, "/v1") {
			c.File(path.Join(absoluteStaticFilesPath, "index.html"))
		}
	})
	v1 := api.router.Group("/v1")
	v1.GET("/ping", api.getPing)
}

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

// Start runs the configured API instance.
func (api *API) Start() error {
	return api.router.Run(fmt.Sprintf(":%d", api.config.APIPort))
}
