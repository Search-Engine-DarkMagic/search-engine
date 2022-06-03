package index

//import所需要的包
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

//进行分词处理，并保存excel格式刀本地
func Index() {

	//创建一个slice叫words，把分词结果存入words中
	var words []string
	//jieba分词
	use_hmm := true
	x := gojieba.NewJieba()
	defer x.Free()
	//创建新的excel
	y := excelize.NewFile()

	//defer（当一切结束之后关闭y）
	defer func() {
		// Close the spreadsheet.
		if err := y.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	//数据库路径
	var pathName string = "wukong50k_release.csv"
	//测试打开错误（如果找不到路径，会报错）
	f, err := os.Open(pathName)
	if err != nil {

		log.Fatal(err)
	}

	//defer （当一切结束之后关闭文件）
	defer f.Close()

	//读取excel文件
	csvReader := csv.NewReader(f)
	//读取到data中
	data, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}
	/*
		创建m，n和sorted 三个map
		m为排序: 数字ID对应搜索结果 (ex. ID: 1 -> 搜索结果:美沃可视数码裂隙灯)
		n为分词结果: 分词对应搜索结果的ID （ex. 分词: 数码 -> 搜索结果ID: 1 100 500)
		sorted为拼音目录: 首单词拼音对应排序位置 （ex. 字母: a -> 搜索结果排序: 100-500)
	*/

	m := make(map[int]string)
	n := make(map[string]string)
	sorted := make(map[string]string)

	//找分词在哪篇ID中出现过

	//count是给每个搜索结果编号
	count := 1
	for _, s := range data {
		//excel中，图片地址和搜索结果中有空格隔开，所以只取搜索结果
		str := strings.Join(s, " ")
		captionIndex := strings.Index(str, " ")
		caption := str[captionIndex+1:]

		//jieba取词，存到words里
		words = x.Cut(caption, use_hmm)

		//检测分词是否为中文
		for _, value := range words {

			//regex中文编码
			match, _ := regexp.MatchString("[\u4e00-\u9fa5]", value)
			//把中文分词结果变成拼音，首字母放到前面（方便后期拼音搜索）；英文直接放入就好了
			if match {
				a := pinyin.NewArgs()
				b := pinyin.Pinyin(value, a)
				//把首字母放在中文分词前面
				value = b[0][0] + " " + value
			}

			//检测map中是否有相同的key，如果没有（第一次），那就把页码（count）写上；如果出现1+次，那就加上之前的页码
			if _, ok := n[value]; ok {
				n[value] += " " + strconv.Itoa(count)
			} else {
				n[value] = strconv.Itoa(count)
			}

		}

		//把所有结果都编成页码，后期倒序索引用得到
		m[count] = str
		//页码++
		count++
	}

	//排序 (n)（因为map是混乱的，所以需要排序，从a-z, 1-9）
	keys := make([]string, 0, len(n))

	for k := range n {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	//以下所有的count都是为了写入excel用的（每行每列）
	//count指每行；excelCol指每列
	count3 := 1
	count4 := 1
	count5 := 0
	count6 := 0
	excelCol3 := "C"
	excelCol4 := "D"
	excelCol5 := "E"
	excelCol6 := "F"
	firstChar := "!"
	//difference指每个字母的区间（拼音索引）
	difference := 0
	for _, k := range keys {
		//插入拼音索引
		sorted[k] = n[k]

		excelCol3 += strconv.Itoa(count3)
		excelCol4 += strconv.Itoa(count4)
		//插入数值
		y.SetCellValue("Sheet1", excelCol3, k)
		y.SetCellValue("Sheet1", excelCol4, n[k])

		count3++
		count4++

		excelCol3 = "C"
		excelCol4 = "D"

		//因为已经排序好了，所以找到每个字符之间有多少数字（后期for loop会优化)
		if k[0:1] != firstChar {
			count5++
			count6++
			excelCol5 += strconv.Itoa(count5)
			excelCol6 += strconv.Itoa(count6)
			y.SetCellValue("Sheet1", excelCol5, firstChar)
			//区间
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

	//插入搜索结果ID + 搜索结果 (m)
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
