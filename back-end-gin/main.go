package main

import (
	"search/router"

	"go.uber.org/dig"
)

func main() {
	c := dig.New()
	c.Invoke(router.RunServer)
}
