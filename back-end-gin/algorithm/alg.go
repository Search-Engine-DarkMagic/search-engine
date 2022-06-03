package Algorithm

import (
	"errors"
	"fmt"
	"os"
	"regexp"
	"search/algorithm/index"
	"sort"
	"strconv"
	"strings"

	gt "github.com/bas24/googletranslatefree"
	"github.com/mozillazg/go-pinyin"
	"github.com/xuri/excelize/v2"
	"github.com/yanyiwu/gojieba"
)

//main包开始
func Algorithm(result string) ([]string, []string) {
	//创建一个slice叫words，把分词结果存入words中
	var words []string
	//jieba分词
	use_hmm := true
	x := gojieba.NewJieba()
	defer x.Free()
	// treeOP.TreeOperation() B树(还在考虑怎么用,请无视)

	//如果此文件夹下存在Book1 excel文件，那么就不用启动分词 (index.go)；如果不存在，自动分词
	if _, err := os.Stat("Book1.xlsx"); errors.Is(err, os.ErrNotExist) {
		fmt.Println("DNE")
		index.Index()
	}

	//打开Book1 excel文件
	f, _ := excelize.OpenFile("Book1.xlsx")

	//延迟关闭
	defer func() {
		// Close the spreadsheet.
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	/*
		创建4个map：
			m为排序: 数字ID对应搜索结果 (ex. ID: 1 -> 搜索结果:美沃可视数码裂隙灯)
			contextClue: 拼音目录: 首单词拼音对应排序位置 （ex. 字母: a -> 搜索结果排序: 100-500)
			searchResultRelated: 关联度搜索: 最相关的会在搜索结果最前面
			otherRelatedKey: 相关搜索: 跟搜索关键词最接近的几个词语

	*/
	m := make(map[string]string)
	contextClue := make(map[string]string)
	searchResultRelated := make(map[string]int)
	otherRelatedKey := make(map[string]int)

	//读取excel行和列的数字
	location1 := "A"
	location2 := "B"

	count1 := 1
	count2 := 1
	count5 := 1
	count6 := 1
	location5 := "E"
	location6 := "F"

	//读取m数据
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

	//读取拼音索引 contextClue
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

	//搜索关键词

	//中英文一起搜索，用count来计数
	searchENandCN := 0
	for {

		//regex检测搜索结果是否是中文
		match, _ := regexp.MatchString("[\u4e00-\u9fa5]", result)
		//如果是：
		if match {
			//变成拼音
			a := pinyin.NewArgs()
			b := pinyin.Pinyin(result, a)
			//找到拼音首字母
			value := b[0][0][0:1]

			s := strings.Split(contextClue[value], " ")
			//找到拼音开始+结束点，节约搜索时间
			starting, _ := strconv.Atoi(s[0])
			ending, _ := strconv.Atoi(s[1])

			locationLimit := "C"
			locationLimit2 := "D"

			//开始+结束点
			for i := starting; i < ending; i++ {

				//每行++
				locationLimit2 += strconv.Itoa(i)

				locationLimit += strconv.Itoa(i)

				//读取搜索结果
				cell1, _ := f.GetCellValue("Sheet1", locationLimit)

				fmt.Println(cell1)
				//检测搜索关键词是否出现在搜索结果中
				if result == cell1[strings.Index(cell1, " ")+1:] {

					finalResult, _ := f.GetCellValue("Sheet1", locationLimit2)
					//因为每个结果前面都有拼音分词，所以去掉拼音，只读分词
					s := strings.Split(finalResult, " ")

					for value := range s {

						//隔离网址与搜索结果
						captionIndex := strings.Index(m[s[value]], " ")
						hello := m[s[value]][captionIndex+1:]

						//把搜索结果放到map里面
						searchResultRelated[m[s[value]]] = strings.Index(hello, result)

						//继续分词，为了相关度搜索
						words = x.Cut(hello, use_hmm)

						//把分好的词放OtherRelatedKey里面
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
			//搜完中文，用翻译包翻译成英文继续搜索
			result, _ = gt.Translate(result, "zh-Hans", "en")

			searchENandCN++

		} else {

			//检测结果如果是英文：（大致流程同上）

			value := result[0:1]
			value = strings.ToLower(value)
			fmt.Println("value is ", value)
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

		//如果搜完两遍，跳出loop
		if searchENandCN == 2 {
			break
		}

	}

	//返回结果放在slice里
	var returnResult []string
	var returnKeyWord []string

	//关联度排序排序（关键词出现在搜索结果的位置，数字越小越提前）

	keys := make([]string, 0, len(searchResultRelated))

	for key := range searchResultRelated {
		keys = append(keys, key)
	}
	sort.SliceStable(keys, func(i, j int) bool {
		return searchResultRelated[keys[i]] < searchResultRelated[keys[j]]
	})

	for _, k := range keys {
		fmt.Println(k, searchResultRelated[k])
		returnResult = append(returnResult, k)
	}

	//相关搜索（词出现频率最高）
	keys2 := make([]string, 0, len(otherRelatedKey))

	for keyy := range otherRelatedKey {
		keys2 = append(keys2, keyy)
	}

	sort.SliceStable(keys2, func(i, j int) bool {
		return otherRelatedKey[keys2[i]] > otherRelatedKey[keys2[j]]
	})

	for _, k := range keys2 {
		fmt.Println(k, otherRelatedKey[k])
		returnKeyWord = append(returnKeyWord, k)
	}

	return returnResult, returnKeyWord
}
