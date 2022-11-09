package model

import "github.com/gin-gonic/gin"

type Request interface {
	Validate(c *gin.Context) error
}
