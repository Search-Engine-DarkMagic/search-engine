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

const SecretKey = "secret"

//user signup
func userSignup(c *gin.Context) {
	dsn := "root:888888@tcp(34.66.167.238:3306)/user?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	db.AutoMigrate(&model.User{})
	var user model.User
	err2 := c.ShouldBindJSON(&user)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	var userRetrieve model.User
	db.Where("email = ?", user.Email).Find(&userRetrieve)

	if len(userRetrieve.Email) != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email already existed!"})
	} else {
		encryptedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

		encryptedUser := model.User{
			Name:     user.Name,
			Password: string(encryptedPassword),
			Email:    user.Email,
		}

		db.Create(&encryptedUser)

		c.JSON(http.StatusOK, gin.H{"message": "Success!"})
	}

}

//user login
func userLogin(c *gin.Context) {
	dsn := "root:888888@tcp(34.66.167.238:3306)/user?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	var user model.User
	err2 := c.ShouldBindJSON(&user)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not found!"})
		return
	}

	var userRetrieve model.User
	db.Where("email = ?", user.Email).Find(&userRetrieve)

	if len(userRetrieve.Email) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user email or user password incorrect!"})
	} else {

		if err := bcrypt.CompareHashAndPassword([]byte(userRetrieve.Password), []byte(user.Password)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong password!"})
			return
		} else {
			claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
				Issuer:    user.Email,
				ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			})

			token, _ := claims.SignedString([]byte(SecretKey))

			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "could not log in!"})
				return
			} else {

				c.SetCookie("token", token, 3600, "/", "localhost", false, true)
				c.JSON(http.StatusOK, gin.H{"token": token})

			}
		}

	}

}

//get user info
func userInfo(c *gin.Context) {
	dsn := "root:888888@tcp(34.66.167.238:3306)/user?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("can't connect to database")
	}
	cook, err := c.Cookie("token")
	fmt.Println(cook)
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			// app.errorJSON(w, err)
			// w.WriteHeader(http.StatusUnauthorized)

			return
		}
		// w.WriteHeader(http.StatusBadRequest)
		return
	}
	tknStr := cook

	tkn, err := jwt.ParseWithClaims(tknStr, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "could not log in!"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "could not log in!"})
		return
	}

	claims := tkn.Claims.(*jwt.StandardClaims)
	var user model.User

	db.Where("email = ?", claims.Issuer).Take(&user)
	i = claims.Issuer
	fmt.Println(user)
	c.JSON(http.StatusOK, gin.H{"message": user})
}

//user logout
func logout(c *gin.Context) {
	i = "\"\""

	c.SetCookie("token", "", -1000, "/", "localhost", false, true)
	log.Println(i)
}
