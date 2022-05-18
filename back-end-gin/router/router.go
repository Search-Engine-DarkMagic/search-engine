package router

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func RunServer() {
	r := gin.Default()
	r.Use(CORSMiddleware())
	r.GET("/v1/status", statusCheck)
	r.POST("/v1/search", searchResult)
	r.GET("/v1/search",getResult)
	// r.GET("/v1/result",result)
	fmt.Println("Server is running on port 4000...")
	r.Run(":4000")
}

//CORS error fix
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
