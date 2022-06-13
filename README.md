# search-engine


## This is a search-engine project assigned by ByteDance summer camp 2022
## 这是一个搜索引擎项目（2022青训营）

## API文档



r.GET("/v1/status", statusCheck)								检测服务器网页状态 (status)
r.POST("/v1/search", searchResult)							搜索文字结果						
r.POST("/v1/searchImg", searchResultImg)						搜索图片结果
r.POST("/v1/signup", userSignup)								用户注册
r.POST("/v1/login", userLogin)								用户登录
r.GET("/v1/userinfo", userInfo)								用户信息
r.POST("/v1/logout", logout)								用户注销							
r.POST("/v1/history", history)								用户搜索历史记录
r.POST("/v1/favFolder", favFolderCreate)						用户创建收藏夹
r.POST("/v1/favFolderCreateNSave", favFolderCreateNSave)			用户创建收藏夹并保存搜索结果
r.POST("/v1/favFolderRetrieve", favFolderList)						网页获取用户收藏夹
r.POST("/v1/addFav", addFav)								用户保存搜索结果到收藏夹中
r.POST("/v1/deleteFav", deleteFav)							用户删除搜索结果
r.POST("/v1/deleteFavFolder", deleteFavFolder)					用户删除收藏夹
r.POST("/v1/renameFolder", renameFolder)						用户重命名收藏夹

![image](https://user-images.githubusercontent.com/33233147/173287435-3f32cfe8-1bfc-415f-b687-af2fc685e2a1.png)

