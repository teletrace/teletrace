/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package api

import (
	"fmt"
	"net/http"
	"oss-tracing/pkg/config"
	"oss-tracing/pkg/model"
	"oss-tracing/pkg/spanreader"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

const apiPrefix = "/v1"

var staticFilesPath = filepath.Join("web", "build")

// API holds the config used for running the API as well as
// the endpoint handlers and resources used by them (e.g. logger).
type API struct {
	logger     *zap.Logger
	config     config.Config
	router     *gin.Engine
	spanReader *spanreader.SpanReader
}

// NewAPI creates and returns a new API instance.
func NewAPI(logger *zap.Logger, config config.Config, sr *spanreader.SpanReader) *API {
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

	// zap recovery logger middleware
	api.router.Use(ginzap.RecoveryWithZap(api.logger, false))

	// static files middleware, for serving frontend files
	api.registerStaticFilesMiddleware()

	// CORS policy config middleware
	api.router.Use(cors.Default())
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
	v1.GET("/system-id", api.getSystemId)
	v1.POST("/search", api.search)
	v1.GET("/trace/:id", api.getTraceById)
	v1.GET("/tags", api.getAvailableTags)
	v1.POST("/tags/:tag", api.tagsValues)
	v1.POST("/tags/:tag/statistics", api.tagsStatistics)
}

// Start runs the configured API instance.
// Blocks the goroutine indefinitely unless an error happens.
func (api *API) Start() error {
	return api.router.Run(fmt.Sprintf(":%d", api.config.APIPort))
}

// Common method to validate an http request's body
func (api *API) validateRequestBody(req model.Request, c *gin.Context) bool {
	parseError := c.BindJSON(req)
	if parseError != nil {
		respondWithError(http.StatusBadRequest, parseError, c)
		return true
	}
	validationError := req.Validate()
	if validationError != nil {
		respondWithError(http.StatusBadRequest, validationError, c)
		return true
	}
	return false
}
