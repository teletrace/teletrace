package api

import (
	"fmt"
	"net/http"
	"time"

	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"oss-tracing/pkg/config"
)

type API struct {
	logger *zap.Logger
	config config.Config
	router *gin.Engine
}

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

	// Zap logger middleware
	router.Use(ginzap.GinzapWithConfig(logger, &ginzap.Config{
		TimeFormat: time.RFC3339,
		UTC:        true,
	}))

	// Zap recovery logger middleware
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
	v1 := api.router.Group("/v1")
	v1.GET("/ping", api.getPing)
}

func (api *API) getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func (api *API) Start() error {
	return api.router.Run(fmt.Sprintf(":%d", api.config.APIPort))
}
