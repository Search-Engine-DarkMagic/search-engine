package treeOP

import (
	"example/gdata"
	"fmt"
)

func TreeOperation() {
	b := gdata.NewBPTree(3)

	b.Set("你", "12 14 16")
	b.Set("s", "12 14 16")
	b.Set("你撒比", "12 14 16")

	// data, _ := json.MarshalIndent(b.GetData(), "", "    ")

	fmt.Println(b.Get("你"))

}
