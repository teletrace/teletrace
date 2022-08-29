package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	config, err := createConfig()
	if err != nil {
		log.Fatal(err)
	}

	setGinMode(config)
	r := setupRouter()
	log.Fatal(r.Run(fmt.Sprintf(":%d", config.Port)))
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
