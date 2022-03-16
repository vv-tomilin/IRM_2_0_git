var ex = Object.keys(mudRowCreator().rows[0])
//no comment

function snatch(obj, col, service) {
	//console.log("got: ", obj, col)
	if (service == "NNB") {
		snatchNNB(obj, col, service)
		
		return	
	}
	//var tempo = res.rows[0]
	var mudParams = obj["ПАРАМЕТРЫРАСТВОРА"].value	
	var	vParam1 = obj["ОБЪЕМЫРАСТВОРА(м3)"].value[1][0]
	var vParam2 = obj["ОБЪЕМЫРАСТВОРА(м3)"].value[1][4]
	var vParam3 = obj["ОБЪЕМЫРАСТВОРА(м3)"].value[1][5]
	
	var results = [mudRowCreator(), mudRowCreator()]	
	
	results.map(function(item, index) {
		var tempo = results[index].rows[0]
		
		tempo["Дата"] = beautifyDate2(new Date(obj.timestamp)) || ""
		tempo["Тип раствора"] = obj["Типраствора:"].value[0][0] || ""
		tempo[ex[15]] = vParam1
		tempo[ex[17]] = vParam2
		tempo[ex[16]] = vParam3
	})
	
	mudParams[0].map(function(item, index) {
		if (item) {
			var preres = paramSwitcher(item)
			
			if (preres) {
				results[0].rows[0][preres] = mudParams[2][index]
				results[1].rows[0][preres] = mudParams[3][index]
			}
		}
	})
	
	redrop(results, service, col)
}

function snatchNNB(obj, col, service) {
//console.log(obj)
	var params = deleteEmpty(obj["№п/п"].value)
	var rows = []
	var sumWeight = 0
	
	for (var i = 0; i < params[0].length; i++) {
		if (params[0][i]) {
			rows.push(nnbRowCreator())
		}
	}
	
	params.map(function(item, itemId) {
		var rowNum = 0
		
		item.map(function(val, rowId) {
			var param
			//console.log(params[0])
			if (params[0][rowId]) {
				// main row
				param = nnbParamSwitcher(itemId, "main")
				//console.log(rowNum, rows[rowNum])
				if (rows[rowNum] && param && rows[rowNum]) rows[rowNum].rows[0][param] = val
				
				if (itemId == 10 && rows[rowNum]) {
					sumWeight+= Math.floor(parseInt(val.replace(",", ".")) * 100) / 100 || 0
					rows[rowNum].rows[0].sumWeight = sumWeight + ""
				} 
			}
			else {
				// invalid or sub row
				param = nnbParamSwitcher(itemId, "sub")
				if (rows[rowNum] && param) itemId != 4  ? rows[rowNum].rows[0][param] += " / " + val : rows[rowNum].rows[0][param] = val
				rowNum++
			}
		})
	})

	redrop(rows, service, col, function(item, arg) {
		console.log(item)
	 })
}

function redrop(data, service, col, middleware, arg) {
	var prev = localStorage.getItem("tableFact_" + service + "_" + col)
	var res
	
	if (prev && prev.length > -1) {
		res = JSON.parse(prev)
	}
	else {
		res = []
	}
	data.map(function(result) {
		res.push(result.rows[0])
	})
	
	localStorage.setItem("tableFact_" + service + "_" + col, JSON.stringify(res))
	if (middleware) middleware(res, arg)
}

function deleteEmpty(arrOfArrs) {
	
	return arrOfArrs.map(function(arr) {
		//arr.shift()
		
		return arr
	})
}

function nnbRowCreator() {

	return {"rows":[{"number":"","element":"","affiliation":"","serialNumber":"","DiamOut":"","DiamIn":"","DiamMax":"","connectingThread":"","connectingType":"","length":"","sumLength":"","weightTotalweight":"","sumWeight":""}]}
}

function nnbParamSwitcher(id, type) {
	var map = {
		0: "number",
		1: "element",
		2: "affiliation",
		3: "serialNumber",
		4: "DiamOut",
		5: "DiamMax",
		6: "connectingThread",
		7: "connectingType",
		8: "length",
		9: "sumLength",
		10: "weightTotalweight"
	}
	
	var subMap = {
		4: "DiamIn",
		6: "connectingThread",
		7: "connectingType",
	}
	
	if (type == "main") {
		return map[id]
	}
	if (type == "sub") {
		return subMap[id]
	}
}

function paramSwitcher(item, data) {
	item = item.toLowerCase()
	if (inc(item, ["плотность"])) {
		return 	ex[2]
	}
	if (inc(item, ["условная вязкость"])) {
		return 	ex[3]
	}
	/*
	if (inc(item, ["условная вязкость"])) {
		return 	'"Условная вязкость↵(сек)"'
	}
	*/
	if (inc(item, ["водоотдача"])) {
		return 	ex[4]
	}
	if (inc(item, ["пв", "пластическая вязкость", "пласт. вязкость"])) {
		return 	ex[5]
	}
	if (inc(item, ["фильтр. корка", "фильтрационная корка"])) {
		return 	ex[6]
	}
	if (inc(item, ["твердая фаза", "твёрдая фаза", "тверд. фаза"])) {
		return 	ex[7]
	}
	if (inc(item, ["днс"])) {
		return 	ex[8]
	}
	if (inc(item, ["мвт", "mbt"])) {
		return 	ex[9]
	}
	if (inc(item, ["снс"])) {
		return 	ex[10]
	}
	if (inc(item, ["смазка"])) {
		return 	ex[11]
	}
	if (inc(item, ["песок"])) {
		return 	ex[12]
	}
	if (inc(item, ["хлориды"])) {
		return 	ex[13]
	}
	if (inc(item, ["ph"])) {
		return 	ex[14]
	}
	
	return null
}

function inc(item, values) {
	return values.some(function(value) { return item.includes(value.toLowerCase()) } )
}
		
function mudRowCreator () {

	return {"rows":[{"Дата":"0","Тип раствора":"","\"Плотность\n (гр/см3)\"":"","\"Условная вязкость\n(сек)\"":"","\"Водоотдача по ФП\n(мл/30 мин)\"":"","\"Пласт. вязкость\n (мПа*с)\"":"","\"Глинистая корка \n(мм)\"":"","\"Тверд. Фаза \n(%)\"":"","\"ДНС\n(Па)\"":"","\"МВТ\n (кг/м3)\"":"","\"СНС\n (Па)\"":"","\"Смазка\n(%)\"":"","\"Песок\n(%)\"":"","\"Хлориды\n(мг/л)\"":"","pH":"","V в скв.":"","V приг.":"","V общ.":""}]}
}
	
function beautifyDate2(date) {
	var str = ""
	var buf
	
	buf = date.getDate()
	if (buf < 10) {
		buf= "0" + buf
	}
	
	str += buf + "."
	
	buf = date.getMonth()+1
	if (buf < 10) {
		buf = "0" + buf
	}
	str += buf + ".";
	
	
	buf = date.getFullYear()
	if (buf < 10){
		buf = "0" + buf
	}
	str += buf
		/*
	buf = date.getHours()
	if (buf < 10){
		buf = "0" + buf
	}
	str += buf + ":";
	
	buf = date.getMinutes()
	if (buf < 10){
		buf = "0" + buf
	}
	str += buf;
	*/
		
		
	return str
}
