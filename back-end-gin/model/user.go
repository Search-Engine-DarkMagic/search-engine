package model

type User struct {
	Name     string `json:"nickName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
