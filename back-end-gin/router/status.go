package router

import (
	"github.com/gin-gonic/gin"
)

//测试服务器的状态
func statusCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "everything is fine",
	})
}
