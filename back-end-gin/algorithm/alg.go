package Algorithm

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"search/algorithm/index"
	"sort"
	"strings"
	"time"

	gt "github.com/bas24/googletranslatefree"
	"github.com/xuri/excelize/v2"
	"github.com/yanyiwu/gojieba"
)

//main包开始
func Algorithm(result string) ([]string, []string, time.Duration) {
	//创建一个slice叫words，把分词结果存入words中
	var words []string
	//jieba分词
	use_hmm := true
	x := gojieba.NewJieba()
	defer x.Free()
	// treeOP.TreeOperation() B树(还在考虑怎么用,请无视)

	//如果此文件夹下存在Book1 excel文件，那么就不用启动分词 (index.go)；如果不存在，自动分词
	if _, err := os.Stat("Book1.xlsx"); errors.Is(err, os.ErrNotExist) {

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

	searchResult := make(map[string]string)
	//读取excel行和列的数字

	// count5 := 1
	// count6 := 1
	// location5 := "E"
	// location6 := "F"

	//读取m数据
	//读取搜索结果+图片
	jsonFile, err := os.Open("test.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened users.json")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	json.Unmarshal(byteValue, &m)

	//读取n数据
	//读取搜索结果+图片
	jsonFile2, err := os.Open("test3.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened users.json")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile2.Close()

	byteValue2, _ := ioutil.ReadAll(jsonFile2)

	json.Unmarshal(byteValue2, &contextClue)

	//搜索关键词

	start := time.Now()

	//中英文一起搜索，用count来计数
	searchENandCN := 0
	for {

		jsonFile3, err := os.Open("test2.json")
		// if we os.Open returns an error then handle it
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("Successfully Opened searchKey.json")
		// defer the closing of our jsonFile so that we can parse it later on
		defer jsonFile3.Close()

		byteValue, _ := ioutil.ReadAll(jsonFile3)

		json.Unmarshal(byteValue, &searchResult)

		//regex检测搜索结果是否是中文
		match, _ := regexp.MatchString("[\u4e00-\u9fa5]", result)
		//如果是：
		if match {

			finalResult := searchResult[result]

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

			//搜完中文，用翻译包翻译成英文继续搜索
			result, _ = gt.Translate(result, "zh-Hans", "en")

			searchENandCN++

		} else {

			//检测结果如果是英文：（大致流程同上）

			// value := result[0:1]
			// value = strings.ToLower(value)
			// // fmt.Println("value is ", value)
			// s := strings.Split(contextClue[value], " ")

			// starting, _ := strconv.Atoi(s[0])
			// ending, _ := strconv.Atoi(s[1])

			// locationLimit := "C"
			// locationLimit2 := "D"

			// for i := starting; i < ending; i++ {

			// 	locationLimit2 += strconv.Itoa(i)

			// 	locationLimit += strconv.Itoa(i)

			// 	cell1, _ := f.GetCellValue("Sheet1", locationLimit)

			// 	if result == cell1[strings.Index(cell1, " ")+1:] {

			// 		finalResult, _ := f.GetCellValue("Sheet1", locationLimit2)
			// 		s := strings.Split(finalResult, " ")

			// 		for value := range s {

			// 			searchResultRelated[m[s[value]]] = strings.Index(m[s[value]], result)

			// 			words = x.Cut(m[s[value]], use_hmm)

			// 			for _, value := range words {

			// 				match, _ := regexp.MatchString("[\u4e00-\u9fa5a-zA-Z]{2,10}", value)
			// 				if match && value != result {
			// 					otherRelatedKey[value]++
			// 				}

			// 			}

			// 		}
			// 	}

			// 	locationLimit = "C"
			// 	locationLimit2 = "D"

			// }

			//分割线===================================

			if _, ok := searchResult[result]; ok {
				finalResult := searchResult[result]

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

			result, _ = gt.Translate(result, "en", "zh-Hans")

			searchENandCN++
		}

		//如果搜完两遍，跳出loop
		if searchENandCN == 2 {
			break
		}

	}

	duration := time.Since(start)

	fmt.Println("the time it takes to run is: ", duration)

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
		// fmt.Println(k, searchResultRelated[k])
		returnResult = append(returnResult, k)
	}

	var stopWords = []string{"$", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "?", "_", "“", "”", "、", "。", "《", "》", "一", "一些", "一何", "一切", "一则", "一方面", "一旦", "一来", "一样", "一般", "一转眼", "万一", "上", "上下", "下", "不", "不仅", "不但", "不光", "不单", "不只", "不外乎", "不如", "不妨", "不尽", "不尽然", "不得", "不怕", "不惟", "不成", "不拘", "不料", "不是", "不比", "不然", "不特", "不独", "不管", "不至于", "不若", "不论", "不过", "不问", "与", "与其", "与其说", "与否", "与此同时", "且", "且不说", "且说", "两者", "个", "个别", "临", "为", "为了", "为什么", "为何", "为止", "为此", "为着", "乃", "乃至", "乃至于", "么", "之", "之一", "之所以", "之类", "乌乎", "乎", "乘", "也", "也好", "也罢", "了", "二来", "于", "于是", "于是乎", "云云", "云尔", "些", "亦", "人", "人们", "人家", "什么", "什么样", "今", "介于", "仍", "仍旧", "从", "从此", "从而", "他", "他人", "他们", "以", "以上", "以为", "以便", "以免", "以及", "以故", "以期", "以来", "以至", "以至于", "以致", "们", "任", "任何", "任凭", "似的", "但", "但凡", "但是", "何", "何以", "何况", "何处", "何时", "余外", "作为", "你", "你们", "使", "使得", "例如", "依", "依据", "依照", "便于", "俺", "俺们", "倘", "倘使", "倘或", "倘然", "倘若", "借", "假使", "假如", "假若", "傥然", "像", "儿", "先不先", "光是", "全体", "全部", "兮", "关于", "其", "其一", "其中", "其二", "其他", "其余", "其它", "其次", "具体地说", "具体说来", "兼之", "内", "再", "再其次", "再则", "再有", "再者", "再者说", "再说", "冒", "冲", "况且", "几", "几时", "凡", "凡是", "凭", "凭借", "出于", "出来", "分别", "则", "则甚", "别", "别人", "别处", "别是", "别的", "别管", "别说", "到", "前后", "前此", "前者", "加之", "加以", "即", "即令", "即使", "即便", "即如", "即或", "即若", "却", "去", "又", "又及", "及", "及其", "及至", "反之", "反而", "反过来", "反过来说", "受到", "另", "另一方面", "另外", "另悉", "只", "只当", "只怕", "只是", "只有", "只消", "只要", "只限", "叫", "叮咚", "可", "可以", "可是", "可见", "各", "各个", "各位", "各种", "各自", "同", "同时", "后", "后者", "向", "向使", "向着", "吓", "吗", "否则", "吧", "吧哒", "吱", "呀", "呃", "呕", "呗", "呜", "呜呼", "呢", "呵", "呵呵", "呸", "呼哧", "咋", "和", "咚", "咦", "咧", "咱", "咱们", "咳", "哇", "哈", "哈哈", "哉", "哎", "哎呀", "哎哟", "哗", "哟", "哦", "哩", "哪", "哪个", "哪些", "哪儿", "哪天", "哪年", "哪怕", "哪样", "哪边", "哪里", "哼", "哼唷", "唉", "唯有", "啊", "啐", "啥", "啦", "啪达", "啷当", "喂", "喏", "喔唷", "喽", "嗡", "嗡嗡", "嗬", "嗯", "嗳", "嘎", "嘎登", "嘘", "嘛", "嘻", "嘿", "嘿嘿", "因", "因为", "因了", "因此", "因着", "因而", "固然", "在", "在下", "在于", "地", "基于", "处在", "多", "多么", "多少", "大", "大家", "她", "她们", "好", "如", "如上", "如上所述", "如下", "如何", "如其", "如同", "如是", "如果", "如此", "如若", "始而", "孰料", "孰知", "宁", "宁可", "宁愿", "宁肯", "它", "它们", "对", "对于", "对待", "对方", "对比", "将", "小", "尔", "尔后", "尔尔", "尚且", "就", "就是", "就是了", "就是说", "就算", "就要", "尽", "尽管", "尽管如此", "岂但", "己", "已", "已矣", "巴", "巴巴", "并", "并且", "并非", "庶乎", "庶几", "开外", "开始", "归", "归齐", "当", "当地", "当然", "当着", "彼", "彼时", "彼此", "往", "待", "很", "得", "得了", "怎", "怎么", "怎么办", "怎么样", "怎奈", "怎样", "总之", "总的来看", "总的来说", "总的说来", "总而言之", "恰恰相反", "您", "惟其", "慢说", "我", "我们", "或", "或则", "或是", "或曰", "或者", "截至", "所", "所以", "所在", "所幸", "所有", "才", "才能", "打", "打从", "把", "抑或", "拿", "按", "按照", "换句话说", "换言之", "据", "据此", "接着", "故", "故此", "故而", "旁人", "无", "无宁", "无论", "既", "既往", "既是", "既然", "时候", "是", "是以", "是的", "曾", "替", "替代", "最", "有", "有些", "有关", "有及", "有时", "有的", "望", "朝", "朝着", "本", "本人", "本地", "本着", "本身", "来", "来着", "来自", "来说", "极了", "果然", "果真", "某", "某个", "某些", "某某", "根据", "欤", "正值", "正如", "正巧", "正是", "此", "此地", "此处", "此外", "此时", "此次", "此间", "毋宁", "每", "每当", "比", "比及", "比如", "比方", "没奈何", "沿", "沿着", "漫说", "焉", "然则", "然后", "然而", "照", "照着", "犹且", "犹自", "甚且", "甚么", "甚或", "甚而", "甚至", "甚至于", "用", "用来", "由", "由于", "由是", "由此", "由此可见", "的", "的确", "的话", "直到", "相对而言", "省得", "看", "眨眼", "着", "着呢", "矣", "矣乎", "矣哉", "离", "竟而", "第", "等", "等到", "等等", "简言之", "管", "类如", "紧接着", "纵", "纵令", "纵使", "纵然", "经", "经过", "结果", "给", "继之", "继后", "继而", "综上所述", "罢了", "者", "而", "而且", "而况", "而后", "而外", "而已", "而是", "而言", "能", "能否", "腾", "自", "自个儿", "自从", "自各儿", "自后", "自家", "自己", "自打", "自身", "至", "至于", "至今", "至若", "致", "般的", "若", "若夫", "若是", "若果", "若非", "莫不然", "莫如", "莫若", "虽", "虽则", "虽然", "虽说", "被", "要", "要不", "要不是", "要不然", "要么", "要是", "譬喻", "譬如", "让", "许多", "论", "设使", "设或", "设若", "诚如", "诚然", "该", "说来", "诸", "诸位", "诸如", "谁", "谁人", "谁料", "谁知", "贼死", "赖以", "赶", "起", "起见", "趁", "趁着", "越是", "距", "跟", "较", "较之", "边", "过", "还", "还是", "还有", "还要", "这", "这一来", "这个", "这么", "这么些", "这么样", "这么点儿", "这些", "这会儿", "这儿", "这就是说", "这时", "这样", "这次", "这般", "这边", "这里", "进而", "连", "连同", "逐步", "通过", "遵循", "遵照", "那", "那个", "那么", "那么些", "那么样", "那些", "那会儿", "那儿", "那时", "那样", "那般", "那边", "那里", "都", "鄙人", "鉴于", "针对", "阿", "除", "除了", "除外", "除开", "除此之外", "除非", "随", "随后", "随时", "随着", "难道说", "非但", "非徒", "非特", "非独", "靠", "顺", "顺着", "首先", "！", "，", "：", "；", "？"}
	//相关搜索（词出现频率最高）
	keys2 := make([]string, 0, len(otherRelatedKey))

	for keyy := range otherRelatedKey {
		keys2 = append(keys2, keyy)
	}

	sort.SliceStable(keys2, func(i, j int) bool {
		return otherRelatedKey[keys2[i]] > otherRelatedKey[keys2[j]]
	})

	keyCount := 0
	option := 0
	for _, k := range keys2 {
		if keyCount == 6 {
			break
		}

		// fmt.Println(k, otherRelatedKey[k])
		for _, v := range stopWords {
			if v == k {
				// fmt.Println(v)
				option = 1
				break
			}
		}

		if option == 1 {
			option = 0
			continue
		}
		returnKeyWord = append(returnKeyWord, k)
		keyCount++
	}

	return returnResult, returnKeyWord, duration
}

func fmtDuration(d time.Duration) string {
	d = d.Round(time.Minute)
	h := d / time.Hour
	d -= h * time.Hour
	m := d / time.Minute
	return fmt.Sprintf("%02d:%02d", h, m)
}
