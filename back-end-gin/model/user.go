package model

type User struct {
	Name     string `json:"nickName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserEmail struct {
	Email string `json:"email"`
}

type History struct {
	Email    string `json:"email"`
	Result   string `json:"result"`
	Filter   string `json:"filter"`
	CreateAt string `json:"time"`
}

type Fav struct {
	Email  string `json:"email"`
	Folder string `json:"folder"`
	Result string `json:"result"`
}
