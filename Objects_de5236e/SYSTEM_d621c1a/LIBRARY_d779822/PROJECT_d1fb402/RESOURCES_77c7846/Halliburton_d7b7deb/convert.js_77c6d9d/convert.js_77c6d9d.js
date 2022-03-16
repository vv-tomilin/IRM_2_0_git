var paths = [
	"AGENT.OBJECTS.Halliburton.API.HookLoad",
	"AGENT.OBJECTS.Halliburton.API.ECDVersusRunDepth",
	"AGENT.OBJECTS.Halliburton.API.CirculatingPressureVersusRunDepth",
	"AGENT.OBJECTS.Halliburton.API.PorePressureDepth",
	"AGENT.OBJECTS.Halliburton.API.FracGradientDepth"
];

var namesMap = {
	"г/см3": "load",
	"атм": "pressure",
	"кН*м": "torque",
	"м": "depth",
	"кН": "BigHotLoad",
	"тс": "tonForce"
};

var valueMap = {
	"м": [],
	"г/см3": [],
	"атм": [],
	"кН*м": [],
	"кН": [],
	"тс": []
};

var payload = {
	pressure: {},
	load: {},
	//density: {},
	torque: {},
	BigHotLoad: {},
	//depth: {}
	tonForce: {},
	transcription: {}
};

function elemDepth(e) {

	return e.run_depth || e.MD || e.Annulus_Depth || e.PoreDepth || e.FracDepth || 0
}

function getHalliburtonData() {
	return new Promise(function(resolve, reject) {
		webMI.data.read(paths, function(res) {
			var calcedRes;
			var rawRes = {};
			//console.log(123, res)
			
			res = res.map(function(item, index) {
				var result = JSON.parse(item.value);
				
				rawRes[paths[index].replace("AGENT.OBJECTS.Halliburton.API.", "")] = result;
				//console.log(Object.entries(result.units))
				Object.entries(result.units).map(function(item) {
					valueMap[item[1]].push(item[0]);
					
				})
				
				return result
			})
			
			var valuesArray = Object.keys(valueMap);
			res.map(function(item) {
				//console.log(123, item)
				Object.assign(payload.transcription, item.transcription)
				item.drag_chart_results.map(function(elem) {
					Object.keys(elem).map(function(value) {
						//console.log(valuesArray)
						valuesArray.map(function(name, index) {
							//console.log(valueMap[valuesArray[index]])
							//console.log(valueMap[valuesArray[index]]);
							if (valueMap[valuesArray[index]].includes(value) && valuesArray[index] != "м") {
								if (!payload[namesMap[name]][value]) payload[namesMap[name]][value] = [];
								//console.log(11, elem, value);
								payload[namesMap[name]][value].push({ y: elemDepth(elem), x: Math.floor(elem[value] * 100) / 100, name: payload.transcription[value] });
							}
						})
					}) 
				})
			})
			//console.log(res, payload)
			webMI.trigger.fire("setHallData", { converted: payload, raw: rawRes });
		})
	}) 
}
getHalliburtonData();