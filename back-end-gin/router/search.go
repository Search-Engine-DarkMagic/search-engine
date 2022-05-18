package router

import (
	"github.com/gin-gonic/gin"
	"net/http"

)

// var searchResult string
// var searchFilter string

//receive search result
func searchResult(c *gin.Context) {
	result := c.Query("result")
    filter := c.Query("filter")

	info := "backend received: result is " + result + " and filter is " + filter
	c.JSON(http.StatusOK, gin.H{"data": info})

	// searchResult = result
	// searchFilter = filter
	}

//retrieve search result
func getResult(c *gin.Context) {

}