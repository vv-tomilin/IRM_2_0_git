function upload(el, currentService) {
  var fileUpload = el

    if (typeof (FileReader) != "undefined") {
        var reader = new FileReader()

        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                processExcel(e.target.result, currentService)
            }
            reader.readAsBinaryString(fileUpload.files[0])
        } else {
            //For IE Browser.
            reader.onload = function (e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                
                for (var i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i])
                }
                processExcel(data, currentService);
            }
            //reader.readAsArrayBuffer(fileUpload.files[0]);
        }
    } else {
        alert("This browser does not support HTML5.")
    }
    console.log("serv", currentService)

	el.value = ''    
}
function processExcel(data, service) {
  var workbook = XLSX.read(data, {
      type: 'binary'
  });

  var firstSheet = workbook.SheetNames[0];
  var excelRows = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheet],{FS:';',RS:"|||"})
  var raw_csv = excelRows.split('|||')
	
  var dataToParse = []

  var counter = 0; 
  var isFilled = function(buf) {
	
    return buf.filter(function(item) { return item.replace("0", "") }).length > 0
  }  
  
  for(var i = 0; i < raw_csv.length; i++){
      var buf=raw_csv[i].split(';')
		
      if (buf && isFilled(buf)) {
		    //dataToParse.push(findElems(buf, counter));
        dataToParse.push(buf)
        counter++;
	    } 
	}
  parse(dataToParse, service)
  //turnToTableFormat(dataToParse)
}

function findLongest(arr) {
	return arr.reduce(function(prev, current) {
		return prev.length > current.length ? prev : current
	})
}

function turnToTableFormat(data) {
	var res = {
		columns: [],
		rows: []	
	}
	var filtered = data.filter(function(arr) {
	
		return !arr ? false : arr.some(function(item) { return item })
	})
	
	if (filtered.length > 0) {
		for (var i = 0; i < findLongest(filtered).length; i++) {
			res.columns.push({
				name: '',
				field: i,
				id: i			
			})
		}
		res.rows = filtered.map(function(arr) {
			var resultItem = {};
			
			res.columns.map(function(col, index) {
				resultItem[col.field] = arr[index]
			})
			
			return resultItem
		})
		
		//webMI.trigger.fire("renderDaily", res)
	}
}

/*

function findElems(arr, index) {
  var items = shitMap()[index]
	
  if (items) {
  
    return items.map(function(id) {

      return arr[id]
    })
  } 
}

function shitMap() {
	return {
		0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 22],
		1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 40],
		2: [2],
		3: [18],
		4: [1, 6, 13, 19, 27, 33, 37, 41],
		5: [1, 6, 13, 19, 27, 33, 37],
		6: [1, 6, 13, 19, 27, 33, 37],
		7: [1, 6, 13, 19, 27, 33, 37],
		8: [1, 6, 13, 19, 27, 33, 37],
		9: [1, 10, 19, 20, 27, 28, 29],
		10: [1, 10, 19, 24, 27, 33, 37],
		11: [1, 10, 19, 24, 27, 33, 37],
		12: [1, 10, 19, 24, 27, 33, 37],
		13: [1, 10, 19, 24, 27, 33, 37],
		14: [1, 10, 19, 24, 27, 33, 37],
		15: [1, 10, 19, 24, 27, 33, 37],
		16: [1, 10, 19, 24, 27, 33, 37],
		17: [1, 10, 19, 24, 27, 33, 37],
		18: [1, 2, 3, 4, 19],
		19: [1, 7, 10, 15, 19, 26, 29, 31, 32, 33, 37, 39],
		20: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 36, 37],
		21: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		22: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		23: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		24: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		25: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		26: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		27: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		28: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		29: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		30: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		31: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		32: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		33: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		34: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		35: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		36: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		37: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		38: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		39: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		40: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		41: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		42: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		43: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		44: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		45: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		46: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		47: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		48: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		49: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		50: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		51: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		52: [1, 7, 10, 15, 19, 26, 29, 31, 33, 35, 37, 39],
		// 53: [],
		53: [1, 2, 3],
		54: [1, 7, 13],
		55: [1, 7, 13, 19, 26, 29, 33, 35, 37, 39],
		56: [1],
		57: [1, 8, 16, 24, 32],
		58: [1, 8, 16, 24, 32],
		59: [1, 8, 16, 24, 32],
		60: [1, 8, 16, 24, 32],
		61: [1, 8, 16, 24, 32],
		62: [1, 8, 16, 24, 32],
		63: [1, 7, 9, 15, 21, 27, 29, 35], 
		64: [1, 7, 9, 15, 21, 27, 29, 35],
		65: [1, 7, 9, 15, 21, 27, 29, 35],
		66: [1, 7, 9, 15, 21, 27, 29, 35],
		67: [1, 7, 9, 15, 21, 27, 29, 35],
		68: [1, 7, 9, 15, 21, 27, 29, 35],
		69: [1, 7, 9, 15, 21, 27, 29, 35],
		70: [1, 7, 9, 15, 21, 27, 29, 35],
		71: [1, 7, 9, 15, 21, 27, 29, 35],
		72: [1, 21],
		73: [1, 21],
		74: [1, 21],
		75: [1, 21],
		76: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		77: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		78: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		79: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		80: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		81: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		82: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		83: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		84: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		85: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		86: [1, 8, 10, 15, 17, 19, 21, 28, 31, 37],
		87: [1],
		88: [1, 9, 15, 21, 27, 34],
		89: [1, 9, 15, 21, 27, 34],
		90: [1, 15, 21, 27, 34],
		91: [1, 15, 21, 27, 34],
		92: [1],
		93: [1, 11, 12, 21, 22, 23, 36],
		94: [1, 11, 16, 21, 26, 31, 36],
		95: [1, 11, 16, 21, 26, 31, 36],
		96: [1, 11, 16, 21, 26, 31, 36],
		97: [1, 11, 16, 21, 26, 31, 36],
		98: [1],
		99: [1, 10, 19, 27],
		100: [1, 10, 19, 27],
		101: [1, 10, 19, 27],
		102: [1, 10, 19, 27, 35],
		103: [1, 10, 19, 27, 35],
		104: [1, 10, 19, 27, 35],
	}
}
*/