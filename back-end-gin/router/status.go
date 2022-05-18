package router

import (
	"github.com/gin-gonic/gin"
)

//status
func statusCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "everything is fine",
	})
}
