package main

import (
	"errors"
	"example/index"
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"

	gt "github.com/bas24/googletranslatefree"
	"github.com/mozillazg/go-pinyin"
	"github.com/xuri/excelize/v2"
	"github.com/yanyiwu/gojieba"
)

func main() {
	var words []string
	use_hmm := true
	x := gojieba.NewJieba()
	defer x.Free()
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
	searchResultRelated := make(map[string]int)
	otherRelatedKey := make(map[string]int)
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

	result := "amazon"
	searchENandCN := 0
	for {

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
						searchResultRelated[m[s[value]]] = strings.Index(m[s[value]], result)

						words = x.Cut(m[s[value]], use_hmm)

						for _, value := range words {
							match, _ := regexp.MatchString("[\u4e00-\u9fa5a-zA-Z]", value)
							if match && value != result {
								otherRelatedKey[value]++
							}

						}

					}
				}

				locationLimit = "C"
				locationLimit2 = "D"
			}
			result, _ = gt.Translate(result, "zh-Hans", "en")
			searchENandCN++

		} else {
			value := result[0:1]
			// fmt.Println(contextClue[value])

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

						searchResultRelated[m[s[value]]] = strings.Index(m[s[value]], result)

						words = x.Cut(m[s[value]], use_hmm)

						for _, value := range words {

							match, _ := regexp.MatchString("[\u4e00-\u9fa5a-zA-Z]{2,10}", value)
							if match && value != result {
								otherRelatedKey[value]++
							}

						}

					}
				}

				locationLimit = "C"
				locationLimit2 = "D"

			}
			result, _ = gt.Translate(result, "en", "zh-Hans")

			searchENandCN++
		}

		if searchENandCN == 2 {
			break
		}

	}

	fmt.Println(searchResultRelated)
	//关联度排序
	keys := make([]string, 0, len(searchResultRelated))

	for key := range searchResultRelated {
		keys = append(keys, key)
	}
	sort.SliceStable(keys, func(i, j int) bool {
		return searchResultRelated[keys[i]] < searchResultRelated[keys[j]]
	})

	for _, k := range keys {
		fmt.Println(k, searchResultRelated[k])
	}

	//相关搜索
	keys2 := make([]string, 0, len(otherRelatedKey))

	for keyy := range otherRelatedKey {
		keys2 = append(keys2, keyy)
	}

	sort.SliceStable(keys2, func(i, j int) bool {
		return otherRelatedKey[keys2[i]] > otherRelatedKey[keys2[j]]
	})

	for _, k := range keys2 {
		fmt.Println(k, otherRelatedKey[k])

	}

}
