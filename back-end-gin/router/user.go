package router

import (
	"fmt"
	"log"
	"net/http"
	"search/model"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var i string = "\"\""
var U string

const SecretKey = "secret"

//用户注册
func userSignup(c *gin.Context) {
	//连接google cloud服务器
	dsn := "root:123456@tcp(35.243.204.112:3306)/user?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	//如果没有db，按照models自动生成db
	db.AutoMigrate(&model.User{})
	var user model.User
	//获取前端信息
	err2 := c.ShouldBindJSON(&user)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}
	//hash密码（密码加密）
	var userRetrieve model.User
	//从数据库找，用户是否存在
	db.Where("email = ?", user.Email).Find(&userRetrieve)

	//如果存在，不允许注册，前端收到错误信息
	if len(userRetrieve.Email) != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email already existed!"})
	} else {
		//如果不存在，那么就加密密码
		encryptedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

		//加密密码之后存到encryptedUser
		encryptedUser := model.User{
			Name:     user.Name,
			Password: string(encryptedPassword),
			Email:    user.Email,
		}

		//存到encryptedUser
		db.Create(&encryptedUser)

		//发送给前端
		c.JSON(http.StatusOK, gin.H{"message": "Success!"})
	}

}

//用户登录
func userLogin(c *gin.Context) {
	//连接服务器
	dsn := "root:123456@tcp(35.243.204.112:3306)/user?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	var user model.User
	//读取前端发送数据
	err2 := c.ShouldBindJSON(&user)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	//检测是否能找到email地址
	var userRetrieve model.User
	db.Where("email = ?", user.Email).Find(&userRetrieve)

	//如果检测不到，那么就报错，不存在email
	if len(userRetrieve.Email) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user email or user password incorrect!"})
	} else {
		//如果检测到，那么就测试用户密码combo
		if err := bcrypt.CompareHashAndPassword([]byte(userRetrieve.Password), []byte(user.Password)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong password!"})
			return
		} else {
			//成功登录，用jwt做一个token 连接用户email
			claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
				Issuer: user.Email,
				//设置过期时间
				ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			})

			//创造token
			token, _ := claims.SignedString([]byte(SecretKey))

			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "could not log in!"})
				return
			} else {
				//设置cookie和过期时间
				c.SetCookie("token", token, 3600, "/", "localhost", false, true)
				//发送前端数据
				c.JSON(http.StatusOK, gin.H{"token": token})

			}
		}

	}

}

//获取用户信息
func userInfo(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/user?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	cook, err := c.Cookie("token")
	fmt.Println(cook)
	if err != nil {
		//检测是否有cookie
		if err == http.ErrNoCookie {

			return
		}
		//返回错误
		return
	}
	tknStr := cook

	//用jwt检测token和claim是否一致
	tkn, err := jwt.ParseWithClaims(tknStr, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	//如果错误，那就不能活去用户信息
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "could not log in!"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "could not log in!"})
		return
	}

	//获取用户信息成功
	claims := tkn.Claims.(*jwt.StandardClaims)
	var user model.User

	//找到用户，并打出用户信息
	db.Where("email = ?", claims.Issuer).Take(&user)
	i = claims.Issuer
	fmt.Println(user)
	c.JSON(http.StatusOK, gin.H{"message": user})
}

//用户登出
func logout(c *gin.Context) {
	i = "\"\""

	c.SetCookie("token", "", -1000, "/", "localhost", false, true)
	log.Println(i)
}

//用户历史记录
func history(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/histories?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	var userEmail model.UserEmail
	//找到用户email地址
	err2 := c.ShouldBindJSON(&userEmail)

	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	//数据库找到用户历史记录
	var matchingUser []model.History
	db.Where("email = ?", userEmail.Email).Find(&matchingUser)

	fmt.Println("jb", matchingUser)
	c.JSON(http.StatusOK, gin.H{"data": matchingUser})

}

//用户收藏夹（无效）
func favorite(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	db.AutoMigrate(&model.Fav{})

	var fav model.Fav
	err2 := c.ShouldBindJSON(&fav)

	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	db.Create(&fav)
	c.JSON(http.StatusOK, gin.H{"data": fav})

}

//用户创建收藏夹
func favFolderCreate(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	db.AutoMigrate(&model.Fav{})

	var fav model.Fav
	//前端拿到收藏夹信息
	err2 := c.ShouldBindJSON(&fav)

	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	//创建收藏夹（数据为空）
	favFolder := model.Fav{
		Email:  fav.Email,
		Folder: fav.Folder,
		Result: "empty",
	}

	//寻找email对应收藏夹信息
	var checkDup model.Fav
	db.Where("email = ? AND folder = ?", fav.Email, fav.Folder).Find(&checkDup)

	//检测收藏夹是否存在
	if len(checkDup.Email) != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "folder already existed!"})
	} else {
		//不存在的话，就创建收藏夹
		db.Create(&favFolder)
		c.JSON(http.StatusOK, gin.H{"message": "success!"})
	}

}

//用户快速创建收藏夹并保存
func favFolderCreateNSave(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	db.AutoMigrate(&model.Fav{})

	var fav model.Fav
	//前端拿到收藏夹信息
	err2 := c.ShouldBindJSON(&fav)

	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	//创建收藏夹（数据为空）
	favFolder := model.Fav{
		Email:  fav.Email,
		Folder: fav.Folder,
		Result: fav.Result,
	}

	//寻找email对应收藏夹信息
	var checkDup model.Fav
	db.Where("email = ? AND folder = ?", fav.Email, fav.Folder).Find(&checkDup)

	//检测收藏夹是否存在
	if len(checkDup.Email) != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "folder already existed!"})
	} else {
		//不存在的话，就创建收藏夹
		db.Create(&favFolder)
		c.JSON(http.StatusOK, gin.H{"message": "success!"})
	}

}

//用户收藏夹查看
func favFolderList(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	var userEmail model.UserEmail

	//前端传email地址
	err2 := c.ShouldBindJSON(&userEmail)
	fmt.Println("email is ", userEmail.Email)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	fmt.Println(userEmail.Email)
	var favFolder []model.Fav
	//查找收藏夹信息
	db.Where("email = ?", userEmail.Email).Find(&favFolder)
	c.JSON(http.StatusOK, gin.H{"message": favFolder})

}

//用户添加搜索结果到收藏夹
func addFav(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	var test model.Fav

	//前端数据
	c.BindJSON(&test)

	var findEmptyFav model.Fav
	db.Where("email = ? AND folder = ? AND result = ?", test.Email, test.Folder, "empty").Take(&findEmptyFav)

	var empty model.Fav

	if findEmptyFav != empty {
		db.Where("email = ? AND folder = ? AND result = ?", test.Email, test.Folder, "empty").Delete(&findEmptyFav)
	}
	//创建
	db.Create(&test)

}

//用户删除收藏夹搜索结果
func deleteFav(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	var test model.Fav

	c.BindJSON(&test)

	//找到用户email+文件夹名称+结果
	db.Where("email = ? AND folder = ? AND result = ?", test.Email, test.Folder, test.Result).Delete(&test)

	var checkEmpty model.Fav
	var empty model.Fav
	db.Where("email = ? AND folder = ? AND result = ?", test.Email, test.Folder, test.Result).Take(&checkEmpty)

	if checkEmpty == empty {
		favFolder := model.Fav{
			Email:  test.Email,
			Folder: test.Folder,
			Result: "空",
		}

		db.Create(&favFolder)
	}
}

//用户删除收藏夹
func deleteFavFolder(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	var test model.Fav

	c.BindJSON(&test)

	//找到用户email以及文件夹
	db.Where("email = ? AND folder = ?", test.Email, test.Folder).Delete(&test)
}

//用户重命名收藏夹
func renameFolder(c *gin.Context) {
	dsn := "root:123456@tcp(35.243.204.112:3306)/favorites?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}

	var test model.RenameFolder
	var test2 model.Fav
	c.BindJSON(&test)
	fmt.Println(test.NewFolder)
	//更新文件夹名称
	db.Model(&test2).Where("email = ? AND folder = ?", test.Email, test.OldFolder).Update("folder", test.NewFolder)
}
