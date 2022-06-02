package main

import (
	"search/router"

	"go.uber.org/dig"
)

//main方法入口
func main() {

	c := dig.New()
	//打开服务器
	c.Invoke(router.RunServer)
}
