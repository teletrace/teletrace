package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := setupRouter()
	log.Fatal(r.Run(":8080"))
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
