package router

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

//服务器api路径 （具体请参考github readme）
func RunServer() {
	r := gin.Default()
	r.Use(CORSMiddleware())
	r.GET("/v1/status", statusCheck)
	r.POST("/v1/search", searchResult)
	r.GET("/v1/search", getResult)
	r.POST("/v1/signup", userSignup)
	r.POST("/v1/login", userLogin)
	r.GET("/v1/userinfo", userInfo)
	r.POST("/v1/logout", logout)
	r.POST("/v1/history", history)
	r.POST("/v1/favFolder", favFolderCreate)
	r.POST("/v1/favFolderCreateNSave", favFolderCreateNSave)
	r.POST("/v1/favFolderRetrieve", favFolderList)
	r.POST("/v1/addFav", addFav)
	r.POST("/v1/deleteFav", deleteFav)
	r.POST("/v1/deleteFavFolder", deleteFavFolder)
	r.POST("/v1/renameFolder", renameFolder)

	fmt.Println("Server is running on port 4000...")
	r.Run(":4000")
}

//修复CORS错误（CORS当本地同时运行服务器+客户端会报错）
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
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
