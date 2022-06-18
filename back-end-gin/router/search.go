package router

import (
	"fmt"
	"net/http"
	"search/Algorithm"
	"search/model"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

//搜索结果(文字)
func searchResult(c *gin.Context) {
	//连接服务器
	dsn := "root:123456@tcp(35.243.204.112:3306)/histories?charset=utf8mb4&parseTime=True&loc=Local"
	//打开服务器
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	//检测服务器错误
	if err != nil {
		panic("can't connect to database")
	}
	//如果没有服务器，按照models创建服务器
	db.AutoMigrate(&model.History{})
	//query网址来获取搜索关键词
	result := c.Query("result")
	filter := c.Query("filter")

	//确认后端收到没有
	// info := "backend received: result is " + result + " and filter is " + filter

	//运行搜索算法

	a, b, d := Algorithm.Algorithm(result)

	//后端打印出来
	// fmt.Println("Brob")
	// fmt.Println(a)
	// fmt.Println(b)
	var userEmail model.UserEmail
	//接受用户email来添加历史记录
	err2 := c.ShouldBindJSON(&userEmail)
	fmt.Println(userEmail)
	//如果找不到用户email（未登录），不添加历史记录
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}
	//添加历史记录时间
	dt := time.Now()
	fmt.Println("Time is ")
	fmt.Println(dt.String())
	//转换时间
	dtConverted := dt.Format("2006-01-02 15:04:05")
	//存在对象record里
	record := model.History{
		Email:    userEmail.Email,
		Result:   result,
		Filter:   filter,
		CreateAt: dtConverted,
	}

	if len(record.Email) != 0 {
		//如果用户存在，存到数据库里
		db.Create(&record)
	} else {
		//如果用户不存在，什么都不存
		fmt.Println("Not registered!")
	}

	//数据调整
	var resultSorted []string
	var urlSorted []string
	fmt.Println(filter)

	if len(a) != 1 {
		for _, value := range a {

			captionIndex := strings.Index(value, " ")
			caption := value[captionIndex+1:]
			caption2 := value[0:captionIndex]

			if strings.Contains(caption, filter) && filter != "" {

			} else {
				resultSorted = append(resultSorted, caption)
				urlSorted = append(urlSorted, caption2)
			}

		}
	}

	//返回前端
	totalResult := model.SearchResult{
		Result:     resultSorted,
		URL:        urlSorted,
		Keyword:    b,
		SearchTime: d,
	}
	c.JSON(http.StatusOK, gin.H{"data": totalResult})

	// searchResult = result
	// searchFilter = filter
}

//搜索结果(图片)
func searchResultImg(c *gin.Context) {
	//连接服务器
	dsn := "root:123456@tcp(35.243.204.112:3306)/histories?charset=utf8mb4&parseTime=True&loc=Local"
	//打开服务器
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	//检测服务器错误
	if err != nil {
		panic("can't connect to database")
	}
	//如果没有服务器，按照models创建服务器
	db.AutoMigrate(&model.History{})
	//query网址来获取搜索关键词
	result := c.Query("result")
	filter := c.Query("filter")

	//确认后端收到没有
	// info := "backend received: result is " + result + " and filter is " + filter

	//运行搜索算法

	a, b, d := Algorithm.Algorithm(result)

	//后端打印出来
	fmt.Println("Brob")
	fmt.Println(a)
	fmt.Println(b)
	var userEmail model.UserEmail
	//接受用户email来添加历史记录
	err2 := c.ShouldBindJSON(&userEmail)
	fmt.Println(userEmail)
	//如果找不到用户email（未登录），不添加历史记录
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}
	//添加历史记录时间
	dt := time.Now()
	fmt.Println("Time is ")
	fmt.Println(dt.String())
	//转换时间
	dtConverted := dt.Format("2006-01-02 15:04:05")
	//存在对象record里
	record := model.History{
		Email:    userEmail.Email,
		Result:   result,
		Filter:   filter,
		CreateAt: dtConverted,
	}

	if len(record.Email) != 0 {
		//如果用户存在，存到数据库里
		db.Create(&record)
	} else {
		//如果用户不存在，什么都不存
		fmt.Println("Not registered!")
	}

	//数据调整
	var resultSorted []string
	var urlSorted []string
	fmt.Println(filter)

	if len(a) != 1 {
		for _, value := range a {
			captionIndex := strings.Index(value, " ")
			caption := value[captionIndex+1:]
			caption2 := value[0:captionIndex]

			if strings.Contains(caption, filter) && filter != "" {

			} else {
				resultSorted = append(resultSorted, caption)
				urlSorted = append(urlSorted, caption2)
			}

		}

	}

	//返回前端
	totalResult := model.SearchResult{
		Result:     resultSorted,
		URL:        urlSorted,
		Keyword:    b,
		SearchTime: d,
	}
	c.JSON(http.StatusOK, gin.H{"data": totalResult})

	// searchResult = result
	// searchFilter = filter
}
