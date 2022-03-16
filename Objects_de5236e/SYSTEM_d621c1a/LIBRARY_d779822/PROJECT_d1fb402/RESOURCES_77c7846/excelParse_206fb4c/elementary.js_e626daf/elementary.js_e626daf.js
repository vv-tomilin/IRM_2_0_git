function toElement(elems, container, service) {
  // var len = 74
  // var container = document.getElementById("container")
  for (elem in elems) {
    
    var target = parent.document.getElementById(elem)
    //console.log(target, elem)
    if (target && elem in elems) {
      var div = parent.document.createElement("div")

      div.style.width = "100%"
      // console.log(elems["Заказчик:"])
      if (elems[elem].key.type == "linear") {
        div.textContent = elems[elem].value[0]
      }
      
      if (elems[elem].key.type == "column") {
        var cols = elems[elem].key.cols
        var rows = elems[elem].key.cells

        var subdiv = parent.document.createElement("div")
        var iterable = elems[elem].key.cells ? elems[elem].key.cells : elems[elem].value[0]

        subdiv.style.display = "grid"
        subdiv.style.gridTemplateColumns = "repeat(" + 1 + ", 1fr)"
        subdiv.style.gridTemplateRows = "repeat(" + (rows ? rows.length : "auto") + ", 1fr)"
        subdiv.style.width = "100%"
          
        // subdiv.style.display = "grid"
        // subdiv.style.gridTemplateColumns = "repeat(" + cols.length + ", 1fr)"
        // subdiv.style.gridTemplateRows = "repeat(" + (rows.length || "auto") + ", 1fr)"
        // console.log(elems[elem], elem)
        iterable.map(function(_, rowId) {
          var row = parent.document.createElement("div")

          row.style.display = "grid"
          row.style.gridTemplateColumns = "repeat(" + cols.length + ", 1fr)"
          row.style.minHeight = "1rem"
          // row.style.gridTemplateRows = "repeat(" + (rows.length || "auto") + ", 1fr)"
          row.style.width = "100%"
          row.style.borderBottom = "1px solid #FFF"

          elems[elem].key.cols.map(function(_, colId) {
            var cell = parent.document.createElement("div")

            cell.style.display = "flex"
            cell.style.justifyContent = "center"
            cell.style.alignItems = "center"
            cell.style.width = "100%"
            cell.style.borderRight = "1px solid #FFF"
            cell.style.minHeight = "2.3rem"
            cell.style.textAlign = "center"
            cell.textContent = elems[elem].value[colId][rowId]
            
            row.appendChild(cell)
          })
          subdiv.appendChild(row)
        })
        div.appendChild(subdiv)
      }
      target.appendChild(div)
      // console.log(target)
    } 
    // var width = elem.key.cols ? elem.key.cols[elem.key.cols.length - 1] : 1
  }

  //console.log(elems)
}
/*
function renderNNB(elems, container, service) {
	var arr = []
	var data = Object.assign(currentData, { timestamp: currentTimestamp }, { signature: currentSig })
	
	webMI.data.read("AGENT.OBJECTS.ServiceParams." + currentService + ".reports", function(rep) {
		if (rep.value.length > 0 && rep.timestamp > startDate) {
			arr = JSON.parse(rep.value)
		}
		var id = arr.findIndex(function(item) {
		
			return new Date(item.timestamp).setHours(0, 0, 0, 0) == new Date(currentTimestamp).setHours(0, 0, 0, 0)
		})
		
		if (id) arr.splice(id, 1, data)
		else arr.push(data)
		
		webMI.data.write("AGENT.OBJECTS.ServiceParams." + currentService + ".reports", JSON.stringify(arr))
	})

		//webMI.trigger.fire("setReports", item)
}
*/