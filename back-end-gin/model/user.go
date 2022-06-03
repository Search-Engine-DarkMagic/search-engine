package model

//定义object对象

//user登录信息+昵称
type User struct {
	Name     string `json:"nickName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

//user email地址
type UserEmail struct {
	Email string `json:"email"`
}

//历史记录
type History struct {
	Email    string `json:"email"`
	Result   string `json:"result"`
	Filter   string `json:"filter"`
	CreateAt string `json:"time"`
}

//个人收藏夹
type Fav struct {
	Email  string `json:"email"`
	Folder string `json:"folder"`
	Result string `json:"result"`
}

//重命名收藏夹
type RenameFolder struct {
	Email     string `json:"email"`
	OldFolder string `json:"oldFolder"`
	NewFolder string `json:"newFolder"`
}

type SearchResult struct {
	Result  []string `json:"result"`
	URL     []string `json:"url"`
	Keyword []string `json:"key"`
}
