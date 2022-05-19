package router

import (
	"fmt"
	"net/http"
	"search/model"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// var searchResult string
// var searchFilter string

//receive search result
func searchResult(c *gin.Context) {
	dsn := "root:888888@tcp(34.66.167.238:3306)/histories?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	db.AutoMigrate(&model.History{})
	result := c.Query("result")
	filter := c.Query("filter")

	info := "backend received: result is " + result + " and filter is " + filter
	var userEmail model.UserEmail
	err2 := c.ShouldBindJSON(&userEmail)
	fmt.Println(userEmail)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}
	dt := time.Now()
	fmt.Println("Time is ")
	fmt.Println(dt.String())
	dtConverted := dt.Format("2006-01-02 15:04:05")
	record := model.History{
		Email:    userEmail.Email,
		Result:   result,
		Filter:   filter,
		CreateAt: dtConverted,
	}

	if len(record.Email) != 0 {
		db.Create(&record)
	} else {
		fmt.Println("Not registered!")
	}
	c.JSON(http.StatusOK, gin.H{"data": info})

	// searchResult = result
	// searchFilter = filter
}

//retrieve search result
func getResult(c *gin.Context) {

}
