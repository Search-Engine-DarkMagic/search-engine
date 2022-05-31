package index

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/mozillazg/go-pinyin"
	"github.com/xuri/excelize/v2"
	"github.com/yanyiwu/gojieba"
)

func Index() {
	var words []string
	use_hmm := true
	x := gojieba.NewJieba()
	defer x.Free()
	y := excelize.NewFile()

	defer func() {
		// Close the spreadsheet.
		if err := y.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	var pathName string = "wukong50k_release.csv"
	f, err := os.Open(pathName)
	if err != nil {
		log.Fatal(err)
	}

	// remember to close the file at the end of the program
	defer f.Close()

	// read csv values using csv.Reader
	csvReader := csv.NewReader(f)
	data, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	m := make(map[int]string)
	n := make(map[string]string)
	sorted := make(map[string]string)

	count := 1
	for _, s := range data {
		str := strings.Join(s, " ")
		captionIndex := strings.Index(str, " ")
		caption := str[captionIndex+1:]

		words = x.Cut(caption, use_hmm)

		for _, value := range words {

			match, _ := regexp.MatchString("[\u4e00-\u9fa5]", value)
			if match {
				a := pinyin.NewArgs()
				b := pinyin.Pinyin(value, a)
				value = b[0][0] + " " + value
			}

			if _, ok := n[value]; ok {
				n[value] += " " + strconv.Itoa(count)
			} else {
				n[value] = strconv.Itoa(count)
			}

		}

		m[count] = caption
		count++
	}

	keys := make([]string, 0, len(n))

	for k := range n {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	count3 := 1
	count4 := 1
	count5 := 0
	count6 := 0
	excelCol3 := "C"
	excelCol4 := "D"
	excelCol5 := "E"
	excelCol6 := "F"
	firstChar := "!"
	difference := 0
	for _, k := range keys {
		sorted[k] = n[k]

		excelCol3 += strconv.Itoa(count3)
		excelCol4 += strconv.Itoa(count4)

		y.SetCellValue("Sheet1", excelCol3, k)
		y.SetCellValue("Sheet1", excelCol4, n[k])

		count3++
		count4++

		excelCol3 = "C"
		excelCol4 = "D"

		if k[0:1] != firstChar {
			count5++
			count6++
			excelCol5 += strconv.Itoa(count5)
			excelCol6 += strconv.Itoa(count6)
			y.SetCellValue("Sheet1", excelCol5, firstChar)
			ranger := strconv.Itoa(count3-1-difference) + " " + strconv.Itoa(count3-1)
			fmt.Println(difference)
			y.SetCellValue("Sheet1", excelCol6, ranger)

			firstChar = k[0:1]
			difference = 0
		}
		difference++
		excelCol5 = "E"
		excelCol6 = "F"

	}

	// index := y.NewSheet("Sheet2")
	// Set value of a cell.

	count2 := 0

	excelCol1 := "A"
	excelCol2 := "B"

	for key := range m {
		excelCol1 += strconv.Itoa(count2)
		excelCol2 += strconv.Itoa(count2)

		y.SetCellValue("Sheet1", excelCol1, key)
		y.SetCellValue("Sheet1", excelCol2, m[key])

		count2++
		excelCol1 = "A"
		excelCol2 = "B"
	}

	if err := y.SaveAs("Book1.xlsx"); err != nil {
		fmt.Println(err)
	}

	// // Save spreadsheet by the given path.
	if err := y.SaveAs("Book1.xlsx"); err != nil {
		fmt.Println(err)
	}

}
