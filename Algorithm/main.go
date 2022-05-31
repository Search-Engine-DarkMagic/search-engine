package main

import (
	"errors"
	"example/index"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/mozillazg/go-pinyin"
	"github.com/xuri/excelize/v2"
)

func main() {
	// treeOP.TreeOperation()

	if _, err := os.Stat("Book1.xlsx"); errors.Is(err, os.ErrNotExist) {
		index.Index()
	}

	f, err := excelize.OpenFile("Book1.xlsx")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		// Close the spreadsheet.
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	m := make(map[string]string)
	contextClue := make(map[string]string)

	location1 := "A"
	location2 := "B"
	// location3 := "C"
	// location4 := "D"

	count1 := 1
	count2 := 1
	// count3 := 1
	// count4 := 1
	count5 := 1
	count6 := 1
	location5 := "E"
	location6 := "F"

	//M
	for {
		location1 += strconv.Itoa(count1)
		location2 += strconv.Itoa(count2)
		cell1, err := f.GetCellValue("Sheet1", location1)
		cell2, err := f.GetCellValue("Sheet1", location2)
		if cell1 == "" {
			break
		}

		m[cell1] = cell2

		location1 = "A"
		location2 = "B"
		count1++
		count2++

		if err != nil {

			break
		}

	}

	//Context
	for {
		location5 += strconv.Itoa(count5)
		location6 += strconv.Itoa(count6)
		cell5, err := f.GetCellValue("Sheet1", location5)
		cell6, err := f.GetCellValue("Sheet1", location6)
		if cell5 == "" {
			break
		}
		contextClue[cell5] = cell6

		location5 = "E"
		location6 = "F"
		count5++
		count6++
		if err != nil {
			break
		}
	}

	result := "原神"

	match, _ := regexp.MatchString("[\u4e00-\u9fa5]", result)
	if match {
		a := pinyin.NewArgs()
		b := pinyin.Pinyin(result, a)
		value := b[0][0][0:1]

		s := strings.Split(contextClue[value], " ")
		starting, _ := strconv.Atoi(s[0])
		ending, _ := strconv.Atoi(s[1])

		locationLimit := "C"
		locationLimit2 := "D"

		for i := starting; i < ending; i++ {

			locationLimit2 += strconv.Itoa(i)

			locationLimit += strconv.Itoa(i)

			cell1, _ := f.GetCellValue("Sheet1", locationLimit)

			if result == cell1[strings.Index(cell1, " ")+1:] {

				finalResult, _ := f.GetCellValue("Sheet1", locationLimit2)
				s := strings.Split(finalResult, " ")

				for value := range s {

					fmt.Println(m[s[value]])
				}
			}

			locationLimit = "C"
			locationLimit2 = "D"

		}
	} else {
		value := result[0:1]
		fmt.Println(contextClue[value])
	}

	// for {

	// }

	// fmt.Println(n)

	// fmt.Println(n[result])
	// s := strings.Split(n[result], " ")

	// for value := range s {
	// 	fmt.Println(m[s[value]])
	// }

}
