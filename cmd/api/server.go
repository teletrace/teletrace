package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	logger, err := newLogger()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer func() {
		if err := logger.Sync(); err != nil {
			log.Printf("Error flushing buffered logs: %v", err)
		}
	}()

	config, err := createConfig(logger)
	if err != nil {
		logger.Fatal("Failed to create API config", zap.Error(err))
	}

	setGinMode(config)
	router := setupRouter()

	err = router.Run(fmt.Sprintf(":%d", config.Port))
	logger.Fatal("API server crashed", zap.Error(err))
}

func newLogger() (*zap.Logger, error) {
	debug, err := strconv.ParseBool(os.Getenv(debugEnvName))
	if err != nil {
		debug = defaultDebug
	}
	if debug {
		return zap.NewDevelopment()
	}
	return zap.NewProduction()
}

func setGinMode(config ApiConfig) {
	mode := gin.DebugMode
	if !config.Debug {
		mode = gin.ReleaseMode
	}
	gin.SetMode(mode)
}

func setupRouter() *gin.Engine {
	router := gin.Default()

	v1 := router.Group("/v1")
	v1.GET("/ping", getPing)

	return router
}

func getPing(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}
