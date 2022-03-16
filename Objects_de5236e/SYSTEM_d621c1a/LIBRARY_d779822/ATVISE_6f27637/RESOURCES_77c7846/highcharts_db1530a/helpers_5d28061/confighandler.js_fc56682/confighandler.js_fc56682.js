var configProperties = [
	"atviseOptions",
	"configName",
	"chart",
	"exporting",
	"global",
	"series",
	"title",
	"tooltip",
	"xAxis",
	"yAxis"
];

var seriesConfigProperties = [
	"lineWidth",
	"animation",
	"dataLabels",
	"type",
	"tooltip",
	"index",
	"id",
	"name",
	"address",
	"address2",
	"dataArchive",
	"dataArchive2",
	"aggregate",
	"aggregate2",
	"color",
	"dashStyle",
	"nonStop",
	"xAxis",
	"yAxis",
	"connectNulls",
	"step",
	"borderColor",
	"borderWidth",
	"fillColor",
	"marker",
	"zIndex",
	"visible"
];

/* "global" is used for compression detectiond, so do not unify "global" */
var unifierRemoveQuotes = false;
/* leave false to prevent elimination of users quotes! */
var unifierDB = {
	"animation": "a",
	"duration": "b",
	"lineWidth": "c",
	"color": "d",
	"marker": "e",
	"events": "f",
	"enabled": "g",
	"style": "h",
	"lineColor": "i",
	"states": "j",
	"normal": "k",
	"hover": "l",
	"lineWidthPlus": "m",
	"select": "n",
	"fontSize": "o",
	"align": "p",
	"padding": "q",
	"x": "r",
	"y": "s",
	"fontWeight": "t",
	"verticalAlign": "u",
	"tooltip": "v",
	"dataLabels": "w",
	"textOutline": "x",
	"formatter": "y",
	"allowPointSelect": "z",
	"showCheckbox": "aa",
	"fillColor": "ab",
	"point": "ac",
	"cropThreshold": "ad",
	"pointRange": "ae",
	"softThreshold": "af",
	"halo": "ag",
	"stickyTracking": "ah",
	"turboThreshold": "ai",
	"findNearestPointBy": "aj",
	"borderColor": "ak",
	"enabledThreshold": "al",
	"radius": "am",
	"radiusPlus": "an",
	"borderRadius": "ao",
	"size": "ap",
	"opacity": "aq",
	"threshold": "ar",
	"onclick": "as",
	"textKey": "at",
	"type": "au",
	"boostThreshold": "av",
	"boostData": "aw",
	"brightness": "ax",
	"index": "ay",
	"position": "az",
	"crisp": "ba",
	"groupPadding": "bb",
	"pointPadding": "bc",
	"minPointLength": "bd",
	"startFromThreshold": "be",
	"width": "bf",
	"backgroundColor": "bg",
	"text": "bh",
	"borderWidth": "bi",
	"cursor": "bj",
	"valueDecimals": "bk",
	"id": "bl",
	"address": "bm",
	"address2": "bm2",
	"aggregate": "bn",
	"aggregate2": "bn2",
	"name": "bo",
	"_colorIndex": "bp",
	"_symbolIndex": "bq",
	"data": "br",
	"trackByArea": "bs",
	"shadow": "bt",
	"dateTimeLabelFormats": "bu",
	"zIndex": "bv",
	"height": "bw",
	"title": "bx",
	"fill": "by",
	"xLow": "bz",
	"xHigh": "ca",
	"yLow": "cb",
	"yHigh": "cc",
	"symbol": "cd",
	"millisecond": "ce",
	"second": "cf",
	"minute": "cg",
	"hour": "ch",
	"day": "ci",
	"week": "cj",
	"month": "ck",
	"year": "cl",
	"footerFormat": "cm",
	"snap": "cn",
	"headerFormat": "co",
	"pointFormat": "cp",
	"pointerEvents": "cq",
	"whiteSpace": "cr",
	"followTouchMove": "cs",
	"background": "ct",
	"loading": "cu",
	"decimalPoint": "cv",
	"printChart": "cw",
	"downloadPNG": "cx",
	"downloadJPEG": "cy",
	"downloadPDF": "cz",
	"downloadSVG": "da",
	"downloadCSV": "db",
	"downloadXLS": "dc",
	"openInCloud": "dd",
	"viewData": "de",
	"theme": "df",
	"widthAdjust": "dg",
	"showInLegend": "dh",
	"whiskerLength": "di",
	"medianWidth": "dj",
	"whiskerWidth": "dk",
	"inside": "dl",
	"labels": "dm",
	"navigation": "dn",
	"userOptions": "do",
	"symbolSize": "dp",
	"symbolX": "dq",
	"symbolY": "dr",
	"separator": "ds",
	"min": "dt",
	"max": "du",
	"userMin": "dv",
	"userMax": "dw",
	"colors": "dx",
	"symbols": "dy",
	"lang": "dz",
	"months": "ea",
	"shortMonths": "eb",
	"weekdays": "ec",
	"numericSymbols": "ed",
	"resetZoom": "ee",
	"resetZoomTitle": "ef",
	"thousandsSep": "eg",
	"contextButtonTitle": "eh",
	"*global*": "ei",
	"useUTC": "ej",
	"time": "ek",
	"chart": "el",
	"defaultSeriesType": "em",
	"ignoreHiddenSeries": "en",
	"spacing": "eo",
	"resetZoomButton": "ep",
	"plotBorderColor": "eq",
	"alignTicks": "er",
	"panning": "es",
	"panKey": "et",
	"fontFamily": "eu",
	"zoomType": "ev",
	"margin": "ew",
	"subtitle": "ex",
	"plotOptions": "ey",
	"line": "ez",
	"area": "fa",
	"spline": "fb",
	"areaspline": "fc",
	"column": "fd",
	"bar": "fe",
	"scatter": "ff",
	"pie": "fg",
	"allowOverlap": "fh",
	"distance": "fi",
	"center": "fj",
	"clip": "fk",
	"colorByPoint": "fl",
	"ignoreHiddenPoint": "fm",
	"legendType": "fn",
	"slicedOffset": "fo",
	"arearange": "fp",
	"areasplinerange": "fq",
	"columnrange": "fr",
	"gauge": "fs",
	"defer": "ft",
	"crop": "fu",
	"dial": "fv",
	"pivot": "fw",
	"boxplot": "fx",
	"errorbar": "fy",
	"grouping": "fz",
	"linkedTo": "ga",
	"waterfall": "gb",
	"dashStyle": "gc",
	"polygon": "gd",
	"bubble": "ge",
	"fillOpacity": "gf",
	"animationLimit": "gg",
	"minSize": "gh",
	"maxSize": "gi",
	"zThreshold": "gj",
	"zoneAxis": "gk",
	"legend": "gl",
	"alignColumns": "gm",
	"layout": "gn",
	"labelFormatter": "go",
	"activeColor": "gp",
	"inactiveColor": "gq",
	"itemStyle": "gr",
	"textOverflow": "gs",
	"itemHoverStyle": "gt",
	"itemHiddenStyle": "gu",
	"itemCheckboxStyle": "gv",
	"squareSymbol": "gw",
	"symbolPadding": "gx",
	"labelStyle": "gy",
	"top": "gz",
	"textAlign": "ha",
	"credits": "hb",
	"href": "hc",
	"boost": "hd",
	"allowForce": "he",
	"seriesThreshold": "hf",
	"atviseOptions": "hg",
	"mode": "hh",
	"source": "hi",
	"liveModeFrameRate": "hj",
	"configNode": "hk",
	"configFile": "hl",
	"configName": "hm",
	"saveMethod": "hn",
	"saveCompressed": "ho",
	"enableCursor1": "hp",
	"enableCursor2": "hq",
	"disableDownSampling": "hr",
	"exporting": "hs",
	"url": "ht",
	"printMaxWidth": "hu",
	"scale": "hv",
	"buttons": "hw",
	"contextButton": "hx",
	"className": "hy",
	"menuClassName": "hz",
	"titleKey": "ia",
	"menuItems": "ib",
	"notificationButton": "ic",
	"_titleKey": "id",
	"symbolUrl": "ie",
	"menuItemDefinitions": "if",
	"libURL": "ig",
	"csv": "ih",
	"columnHeaderFormatter": "ii",
	"dateFormat": "ij",
	"itemDelimiter": "ik",
	"lineDelimiter": "il",
	"showTable": "im",
	"useMultiLevelHeaders": "in",
	"useRowspanHeaders": "io",
	"yAxis": "ip",
	"autoscale": "iq",
	"endOnTick": "ir",
	"buttonOptions": "is",
	"stroke": "it",
	"buttonSpacing": "iu",
	"symbolFill": "iv",
	"symbolStroke": "iw",
	"symbolStrokeWidth": "ix",
	"menuStyle": "iy",
	"border": "iz",
	"menuItemStyle": "ja",
	"transition": "jb",
	"menuItemHoverStyle": "jc",
	"xAxis": "jd",
	"timeSpan": "je",
	"timeSpanUnit": "jf",
	"crosshair": "jg",
	"format": "jh",
	"gridLineWidth": "ji",
	"gridLineColor": "jj",
	"minorGridLineWidth": "jk",
	"minorGridLineColor": "jl",
	"opposite": "jm",
	"isX": "jn",
	"series": "jo",
	"tickInterval": "jp",
	"nonStop": "jq",
	"downloadXLSX": "jr",
	"dataArchive": "js",
	"dataArchive2": "jt"
};


function ConfigHandler() {
}

ConfigHandler.prototype.createConfigObject = function (key, value, identifier) {
	var ret = {};

	if (key == "undefined" || value == "undefined")
		return;

	ret = this.mapToChartConfig(key, value);

	return ret;
};

ConfigHandler.prototype.mapToChartConfig = function (key, value) {

	// converts e.g. the string "xAxis_label_title" to { xAxis: { label: { title: "my title" }}}
	function createConfObjFromString(key, value) {
		var x = key.split("_");
		var y = key.split("-");
		var obj = {}, o = obj;

		for (var i = 0; i < x.length; i++) {
			if (i < x.length - 1) {
				o = o[x[i]] = {};
			} else {
				if (y.length == 2) { // = radiobutton id
					if (y[1] == "true") y[1] = true;
					else if (y[1] == "false") y[1] = false;
					o = o[x[i].substring(0, x[i].search("-" + y[1]))] = y[1];
				} else {
					o = o[x[i]] = value;
				}
			}
		}
		return obj;
	}

	var confObj = createConfObjFromString(key, value);
	return confObj;
};

// map chart config object to atvise id
ConfigHandler.prototype.mapToAtviseId = function (config) {
	var atviseKeys = {};

	function setAtviseIdObj(srcObj, atviseIdObj) {
		if (typeof srcObj != "object")
			return;

		if (typeof(atviseIdObj.key) == "undefined")
			return;

		for (var prop in srcObj) {
			atviseIdObj.key = atviseIdObj.key == "" ? prop : atviseIdObj.key + "_" + prop;
			atviseIdObj.val = srcObj[prop];

			if (Array.isArray(srcObj[prop])) {
				atviseIdObj.val = JSON.stringify(srcObj[prop]);
			} else if (typeof srcObj[prop] == "function") {
				atviseIdObj.val = "function";
			} else if (typeof srcObj[prop] == "object") {
				setAtviseIdObj(srcObj[prop], atviseIdObj);
			}
		}
	}

	function createAtviseIdObj(configObj, key) {
		var config = configObj[key];

		for (p in config) {
			if (typeof config[p] == 'object' && !Array.isArray(config[p])) {
				var prefixedKey = key + "_" + p;
				var obj = {};
				obj[prefixedKey] = config[p];

				createAtviseIdObj(obj, prefixedKey);
			} else {
				var atviseIdObj = {key: "", val: ""};
				var obj = {};
				obj[key] = {};
				obj[key][p] = config[p];
				setAtviseIdObj(obj, atviseIdObj);

				atviseKeys[atviseIdObj.key] = atviseIdObj.val;
			}
		}
	}

	for (key in config) {
		if (Array.isArray(config[key])) {
			for (var i = 0; i < config[key].length; i++) {
				var prefixedKey = key + i + "_" + key;
				var obj = {};
				obj[prefixedKey] = config[key][i];
				createAtviseIdObj(obj, prefixedKey);
			}
		} else {
			createAtviseIdObj(config, key);
		}
	}

	return atviseKeys;
};

ConfigHandler.prototype.unifier = function (config, unify) {
	var config = JSON.parse(JSON.stringify(config));

	function getKey(value, obj) {
		for (var prop in obj) {
			if (obj[prop] === value)
				return prop;
		}
		return;
	}

	function loopKeys(obj) {
		for (var key in obj) {
			var newKey = unify ? unifierDB[key] : getKey(key, unifierDB);

			if (typeof obj[key] === "object") {
				if (typeof newKey != "undefined") {
					Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, key));
					delete obj[key];

					loopKeys(obj[newKey]);
					continue;
				}
				loopKeys(obj[key]);
			} else {
				if (typeof newKey != "undefined") {
					obj[newKey] = obj[key];
					delete obj[key];
				}
			}
		}
	}

	loopKeys(config);

	return config;
}

ConfigHandler.prototype.stringify = function (obj) {
	var ret = JSON.stringify(obj);
	ret.replace(/\\"/g, "\uFFFF"); //U+ FFFF
	ret = ret.replace(/\"([^"]+)\":/g, "$1:").replace(/\uFFFF/g, "\\\"");
	return ret;
}

ConfigHandler.prototype.parse = function (strg) {
	strg = strg
	//Replace "\"" with "'"
		.replace(/\\"/g, "'")
		// Replace ":" with "@colon@" if it's between double-quotes
		.replace(/:\s*"([^"]*)"/g, function (match, p1) {
			return ': "' + p1.replace(/:/g, '@colon@') + '"';
		})
		// Add double-quotes around any tokens before the remaining ":"
		.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
		// Turn "@colon@" back into ":"
		.replace(/@colon@/g, ':');

	return JSON.parse(strg);
}

/* DO NOT USE: Internal function to create initial unifier database
ConfigHandler.prototype.createUnifierDB = function (config) {
	var chars = "abcdefghijklmnopqrstuvwxyz";
	var keys = {};
	var db = {};
	var proc = {};
	var rep;
	var j = 0;
	var k = 0;

	function loopKeys(obj) {
		if (typeof obj != "object")
			return;

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				//Fix for cross references, clones and doubles
				//if (typeof proc[key] != "undefined" && proc[key] == obj[key])
				//	continue; 
				//proc[key] = obj[key];
				
				if (!keys[key] && isNaN(parseInt(key)))
					keys[key] = 1;
				else if (keys[key])
					keys[key] = keys[key] + 1;

				loopKeys(obj[key]);
			} else {
				if (!keys[key] && isNaN(parseInt(key)))
					keys[key] = 1;
				else if (keys[key])
					keys[key] = keys[key] + 1;
			}
		}
	}

	loopKeys(config);

	var sortable = [];
	for (var key in keys) {
		sortable.push([key, keys[key]]);
	}
	
	sortable.sort(function(a, b) {
		return b[1] - a[1];
	});

	for (var i = 0; i < sortable.length; i++) {
		if (chars[i]) {
			db[sortable[i][0]] = chars[i];
		} else if (chars[Math.floor(i/chars.length - 1)] && chars[j]) {
			db[sortable[i][0]] = chars[Math.floor(i/chars.length - 1)] + chars[j];
			j++;
			if (j >= chars.length) j = 0;
		} else if (chars[Math.floor(i/chars.length - 26)] && chars[j] && chars[k]) {
			db[sortable[i][0]] = chars[Math.floor(i/chars.length - 26)] + chars[k] + chars[j];
			j++;
			if (j >= chars.length) {
				j = 0;
				k++;
			}
		}

		if (typeof db[sortable[i][0]] == "undefined")
			db[sortable[i][0]] = sortable[i];
	}

	return db;
} /**/

// merge sub object source into config object target
ConfigHandler.prototype.merger = function (target, source, arrayIdx) {
	var self = this;

	function addAttr(source, srcAttrname) {
		if (typeof arrayIdx == "undefined") {
			if (target[srcAttrname] && typeof target[srcAttrname] == 'object' && typeof source[srcAttrname] == 'object') {
				// merge src into target object
				self.merger(target[srcAttrname], source[srcAttrname]);
			} else {
				// add new attribute to target object
				target[srcAttrname] = source[srcAttrname];
			}
		} else {
			// multiple objects configuration:
			if (Array.isArray(target[srcAttrname]) && arrayIdx <= target[srcAttrname].length - 1) {
				//merge object to existing object
				self.merger(target[srcAttrname][arrayIdx], source[srcAttrname]);
			} else {
				if (Array.isArray(target[srcAttrname])) {
					//add object to array
					target[srcAttrname].push(source[srcAttrname]);
				} else {
					//create array to store objects.
					target[srcAttrname] = [source[srcAttrname]];
				}

			}
		}
	}

	for (var srcAttrname in source) {
		addAttr(source, srcAttrname)
	}

	return target;
};

ConfigHandler.prototype.getConfigsFromNode = function (configNode, configMethode, onGetConfigsFromNodeCallback) {
	var that = this;

	if (saveInProgress) {
		setTimeout(function (e) {
			that.getConfigsFromNode(configNode, configMethode, onGetConfigsFromNodeCallback);
		}, 50);
		return;
	}


	/* dev talks */
	if (typeof onGetConfigsFromNodeCallback == "undefined")
		console.error("onGetConfigsFromNodeCallback not defined");


	function readCallback(e) {
		if (e.error && e.error != "0") {
			if (webMI.getMethodSupport().indexOf("AddNode") > -1) {
				webMI.data.call("AddNode", {
					"address": configNode,
					"typeDefinition": "i=62",
					"dataType": "STRING",
					"value": "{}",
					"nodeClass": "NODECLASS_VARIABLE",
					"writePolicy": 2
				}, function (result) {
					/* console.error(configNode, result); // activate for debugging only */
				});
			}
			onGetConfigsFromNodeCallback({});
		} else {
			var allConfigs = {};
			try {
				if (e.value) {
					var indexConfigs = JSON.parse(e.value);
					/* multiple index */
					if (typeof indexConfigs.highchartsConfigIndex == "object") {
						finalLoadedConfig = {};
						var configList = indexConfigs.highchartsConfigIndex;
						that.buildConfig(configList, configNode, configMethode, onGetConfigsFromNodeCallback);

						/* single or child */
					} else {
						allConfigs = indexConfigs;
						for (var key in allConfigs) {
							var configString = allConfigs[key];
							if (typeof configString["global"] == "undefined") { // check allready compressed
								configString = LZString.decompressFromEncodedURIComponent(configString);
								var configObject;
								if (unifierRemoveQuotes)
									configObject = that.parse(configString);
								else
									configObject = JSON.parse(configString);
								allConfigs[key] = configObject;
							}
						}

						/* unify parameters */
						for (var key in allConfigs) {
							allConfigs[key] = that.unifier(allConfigs[key], false);
							if (typeof allConfigs[key].atviseOptions["saveCompressed"] == "undefined")
								allConfigs[key].atviseOptions["saveCompressed"] = false;
							if (typeof allConfigs[key].atviseOptions["saveMethod"] == "undefined")
								allConfigs[key].atviseOptions["saveMethod"] = "single";
						}

						/* check vaild axis - or set to first found */
						for (var key in allConfigs) {
							var xAxisIndex = Object.keys(allConfigs[key]["xAxis"]);
							var yAxisIndex = Object.keys(allConfigs[key]["yAxis"]);

							for (var seriesKey in allConfigs[key]["series"]) {

								var xAxisAssigned = allConfigs[key]["series"][seriesKey]["xAxis"];
								var yAxisAssigned = allConfigs[key]["series"][seriesKey]["yAxis"];

								if (typeof xAxisAssigned != "undefined") {
									xAxisAssigned = xAxisAssigned.toString();
									if (xAxisIndex.indexOf(xAxisAssigned) < 0) {
										allConfigs[key]["series"][seriesKey]["xAxis"] = parseInt(Object.keys(allConfigs[key]["xAxis"])[0]);
									}
								}

								if (typeof yAxisAssigned != "undefined") {
									yAxisAssigned = yAxisAssigned.toString();
									if (yAxisIndex.indexOf(yAxisAssigned) < 0) {
										allConfigs[key]["series"][seriesKey]["yAxis"] = parseInt(Object.keys(allConfigs[key]["yAxis"])[0]);
									}
								}
							}
						}

						onGetConfigsFromNodeCallback(allConfigs);
					}
				} else {
					allConfigs = {};
					onGetConfigsFromNodeCallback(allConfigs);
				}
			} catch (e) {
				allConfigs = {};
				onGetConfigsFromNodeCallback(allConfigs);
			}
		}
	};

	function fileReadCallback(e) {
		if (e.length < 1 || e.error || !e.result || e.result == "") {
			e.result = "{}";
		}

		var allConfigs = JSON.parse(e.result);

		for (var key in allConfigs) {
			var configString = allConfigs[key];
			if (typeof configString["global"] == "undefined") { // check allready compressed
				configString = LZString.decompressFromEncodedURIComponent(configString);
				var configObject;
				if (unifierRemoveQuotes)
					configObject = that.parse(configString);
				else
					configObject = JSON.parse(configString);
				allConfigs[key] = that.unifier(configObject, false);
			}
		}
		return (allConfigs);
	}

	/* get data from destination */
	var destination = configMethode;
	if (destination == "single" || destination == "multiple") {

		function readConfigNode() {
			if (webMI.getMethodSupport().indexOf("AddNode") < 0) {
				webMI.data.read(configNode, function (e) {
					if (typeof e.error != "undefined") {
						console.warn("The AddNode method is not supported, please add the configuration node manually");
						allConfigs = {};
						onGetConfigsFromNodeCallback(allConfigs);
					} else {
						readCallback(e);
					}
				});
				return;
			} else {
				webMI.data.read(configNode, function (e) {
					readCallback(e)
				});
				return;
			}
		}

		if (webMI.getMethodSupport().indexOf("CheckNodeExists") > -1) {
			webMI.data.call("CheckNodeExists", {"address": configNode}, function (e) {
				if (e.result === true) {
					readConfigNode();
				} else {
					if (webMI.getMethodSupport().indexOf("AddNode") > -1) {
						webMI.data.call("AddNode", {
							"address": configNode,
							"typeDefinition": "i=62",
							"dataType": "STRING",
							"value": "{}",
							"nodeClass": "NODECLASS_VARIABLE",
							"writePolicy": 2
						}, function (result) {
						});
						onGetConfigsFromNodeCallback({});
					} else {
						console.warn("The AddNode method is not supported, please add the configuration node manually");
						onGetConfigsFromNodeCallback({});
						return;
					}
				}
			});
		} else {
			readConfigNode();
		}

	} else if (destination == "filesystem") {
		var filename = "hcconfigs/" + configNode + ".json";
		that.readFile(filename, function (e) {
			onGetConfigsFromNodeCallback(fileReadCallback(e));
		});
	}
};


var finalLoadedConfig;
ConfigHandler.prototype.joinConfig = function (key, configPart) {
	finalLoadedConfig[key] = configPart[key];
}


ConfigHandler.prototype.buildConfig = function (configList, configNode, configMethode, onGetConfigsFromNodeCallback) {
	var that = this;
	if (configList.length > 0) {
		var key = configList.shift();
		var childNode = configNode + "." + key;
		that.getConfigsFromNode(childNode, configMethode, function (allConfigs) {
			that.joinConfig(key, allConfigs);
			that.buildConfig(configList, configNode, configMethode, onGetConfigsFromNodeCallback);
		});
	} else {
		onGetConfigsFromNodeCallback(finalLoadedConfig);
	}
}


ConfigHandler.prototype.saveConfig = function (configNode, configName, chart, onWriteCallback, isDeleted) {
	var configOptions = {"configNode": configNode, "configName": configName};
	this.saveConfigOrImport(configOptions, chart, onWriteCallback, isDeleted);
}


ConfigHandler.prototype.lockWhileSave = function (chart) {
	for (var s in chart.chart.series) {
		chart.chart.series[s].lockAddPoint(true);
	}
	this.unlockAfterSave(chart);
}


ConfigHandler.prototype.unlockAfterSave = function (chart) {
	var that = this;
	if (saveInProgress) {
		setTimeout(function () {
			that.unlockAfterSave(chart);
		}, 50);
	} else {
		for (var s in chart.chart.series) {
			chart.chart.series[s].lockAddPoint(false);
		}
	}
}


var saveInProgress = false;
ConfigHandler.prototype.saveConfigOrImport = function (configOptions, chart, onWriteCallback, isDeleted) {
	var that = this;

	/* need object copy */
	configOptions = JSON.parse(JSON.stringify(configOptions));

	var configNode = configOptions.configNode;
	var configName = configOptions.configName;
	var configImport = typeof configOptions["configImport"] == "undefined" ? false : configOptions["configImport"];

	/* prevent double action of autosave! */
	if (saveInProgress && configOptions.configName == "autosave") {
		return;
	}
	this.lockWhileSave(chart);

	var loadConfiguration = {
		"saveName": chart.chart.options.atviseOptions.saveMethod == "filesystem" ? chart.chart.options.atviseOptions.configFile : chart.chart.options.atviseOptions.configNode,
		"saveMethod": chart.chart.options.atviseOptions.saveMethod,
	}

	this.getConfigsFromNode(loadConfiguration.saveName, loadConfiguration.saveMethod, function (allConfigs) {
		function removeConfigProperties(configCopy) {
			for (var p in configCopy) {
				if (configProperties.indexOf(p) > -1) {
					if (p == "series" && configCopy["series"] !== "undefined") {
						for (var i = 0; i < configCopy.series.length; i++) {
							for (var seriesProp in configCopy.series[i]) {
								if (seriesConfigProperties.indexOf(seriesProp) == -1) {
									delete configCopy.series[i][seriesProp];
								}
							}
						}

					}
				} else {
					delete configCopy[p];
				}
			}
		}
		
		if (!chart || !chart.chart)
			return;

		/* get save configuration from options */
		var saveConfig = chart.chart.options.atviseOptions;

		/* check regular save or import */
		var config = !configImport ? JSON.parse(JSON.stringify(chart.chart.options)) : configImport;

		/* only cleanup regular save */
		if (configImport == false) {

			/*Workaround for measurement marker errors*/
			if (config.xAxis[0] && config.xAxis[0].plotLines) {
				for (var i = 0; i < config.xAxis[0].plotLines.length; i++) {
					var id = config.xAxis[0].plotLines[i].id;
					if (id == "measuringCursor1" || id == "measuringCursor2")
						config.xAxis[0].plotLines.splice(i--, 1);
				}
			}

			config.atviseOptions.configNode = configNode;
			config.atviseOptions.configName = configName;

			config.series = [];
			for (var i = 0; i < chart.chart.series.length; i++) {
				var series = chart.chart.series[i];
				var seriesConfig = JSON.parse(JSON.stringify(series.options));
				config.series.push(seriesConfig);
			}

			for (var i = 0; i < chart.chart.xAxis.length; i++) {
				if (config.xAxis[i]) {
					config.xAxis[i].min = chart.chart.xAxis[i].min;
					config.xAxis[i].max = chart.chart.xAxis[i].max;
					if (typeof chart.chart.xAxis[i].userMin != "undefined")
						config.xAxis[i].userMin = chart.chart.xAxis[i].userMin;
					if (typeof chart.chart.xAxis[i].userMax != "undefined")
						config.xAxis[i].userMax = chart.chart.xAxis[i].userMax;
				}
			}

			for (var i = 0; i < chart.chart.yAxis.length; i++) {
				if (config.yAxis[i]) {
					config.yAxis[i].min = chart.chart.yAxis[i].min;
					config.yAxis[i].max = chart.chart.yAxis[i].max;
					if (typeof chart.chart.yAxis[i].userMin != "undefined")
						config.yAxis[i].userMin = chart.chart.yAxis[i].userMin;
					if (typeof chart.chart.yAxis[i].userMax != "undefined")
						config.yAxis[i].userMax = chart.chart.yAxis[i].userMax;
					if (config.yAxis[i].autoscale || chart.chart.yAxis[i].options.autoscale) {
						config.yAxis[i].min = null;
						config.yAxis[i].max = null;
						config.yAxis[i].userMin = null;
						config.yAxis[i].userMax = null;
						config.yAxis[i].autoscale = true;
					}
				}
			}

			/* some last checks for requiered values */
			for (everySeries in config.series) {
				/* leave marker undefined or null is not a good idea */
				if (typeof config.series[everySeries].marker === 'undefined') {
					config.series[everySeries].marker = [];
				}
				if (typeof config.series[everySeries].marker.enabled === 'undefined' || config.series[everySeries].marker.enabled === null) {
					config.series[everySeries].marker.enabled = false;
				}
			}

			removeConfigProperties(config);

		}

		/* always save config with right save parameter! */
		config.atviseOptions.configFile = chart.chart.options.atviseOptions.configFile;
		config.atviseOptions.configNode = chart.chart.options.atviseOptions.configNode;
		config.atviseOptions.saveCompressed = chart.chart.options.atviseOptions.saveCompressed;
		config.atviseOptions.saveMethod = chart.chart.options.atviseOptions.saveMethod;

		/* add to allConfigs */
		allConfigs[configName] = config;

		/* fix userOptions.userOptions.userOptions....  */
		/* todo: perhaps a better solution is found later Issue-ID [AT-D-8763] */
		if (true) for (configToCheck in allConfigs) {
			try {
				if (typeof allConfigs[configToCheck].tooltip.userOptions.userOptions != 'undefined') {
					delete allConfigs[configToCheck].tooltip.userOptions.userOptions
				}
			} catch (ex) {
				// in case of new configs, there could be troubles finding this data.node
				// todo: fix this another day (see comment above)
			}
		}

		/* prevent read while write */
		saveInProgress = true;

		/* compression */
		var compression = false;
		if (typeof saveConfig.saveCompressed != "undefined")
			compression = saveConfig.saveCompressed;
		if (compression) {
			for (var key in allConfigs) {
				var unified = false;
				if (allConfigs[key])
					unified = that.unifier(allConfigs[key], true);
				var configString = JSON.stringify(unified);
				if (unifierRemoveQuotes)
					configString = that.stringify(unified);
				if (typeof configString != "undefined" && configString.indexOf("global") > -1) {
					allConfigs[key] = LZString.compressToEncodedURIComponent(configString);
				}
			}
		}

		/* save multiple or single */
		var destination = false;
		if (typeof loadConfiguration.saveMethod != "undefined")
			destination = loadConfiguration.saveMethod;

		var HCI = {};
		if (destination == "multiple") {
			webMI.data.read(configNode, function (e) {
				HCI = JSON.parse(e.value);
				if(!HCI.highchartsConfigIndex)
					HCI.highchartsConfigIndex = [];
				
				if (isDeleted) {
					HCI.index = HCI.highchartsConfigIndex.indexOf(configName);
					if (index > -1) {
						delete(HCI.highchartsConfigIndex);
						webMI.data.write(configNode, JSON.stringify(HCI), function (e) {
							webMI.data.write(configNode + "." + key, "{}", function () {
								delete(allConfigs[configName]);
								saveInProgress = false;
							});
						});
					}
				} else {
					if (HCI.highchartsConfigIndex.indexOf(configName) < 0) {
						HCI.highchartsConfigIndex.push(key);
					}
					webMI.data.write(configNode, JSON.stringify(HCI), function (e) {
						that.writeConfig([configName], configNode, allConfigs, onWriteCallback);
					});
				}
			});
		} else if (destination == "single") {
			if (isDeleted) {
				delete allConfigs[configName];
			}
			webMI.data.write(configNode, JSON.stringify(allConfigs),
				function (e) {
					saveInProgress = false;
					onWriteCallback(allConfigs);
				});

		} else if (destination == "filesystem") {
			if (isDeleted) {
				delete allConfigs[configName];
			}
			var filename = "hcconfigs/" + loadConfiguration.saveName + ".json"
			that.readFile(filename,
				function (e) {
					if (e != "") {
						that.safeFile(filename, allConfigs, function (e) {
							saveInProgress = false;
							onWriteCallback(e);
						});
					} else {
						that.createFile(filename, function (e) {
							that.safeFile(filename, allConfigs, function (e) {
								saveInProgress = false;
								onWriteCallback(e);
							});
						});
					}
				}
			);
		}
	});
};


ConfigHandler.prototype.createFile = function (filename, callback, format) {
	if (typeof format == "undefined")
		format = "utf8";
	webMI.data.call("FilesystemCreate", {
			file: filename,
			overwrite: true
		},
		function (e) {
			callback(e);
		});

}


ConfigHandler.prototype.readFile = function (filename, callback, format) {
	if (typeof format == "undefined")
		format = "utf8";
	webMI.data.call("FilesystemRead", {
			file: filename,
			format: "utf8",
		},
		function (e) {
			callback(e);
		}
	);
}


ConfigHandler.prototype.safeFile = function (filename, content, callback, format) {
	if (typeof format == "undefined")
		format = "utf8";
	webMI.data.call("FilesystemWrite", {
			file: filename,
			format: format,
			mode: "output",
			content: JSON.stringify(content)
		},
		function (e) {
			console.log("saved config in " + filename);
			saveInProgress = false;
			callback(content);
		}
	);
}


ConfigHandler.prototype.writeConfig = function (configList, configNode, allConfigs, onWriteCallback) {
	var that = this;
	if (configList.length > 0) {
		var key = configList.shift();
		var node = configNode + "." + key;

		if (webMI.getMethodSupport().indexOf("CheckNodeExists") > -1) {
			webMI.data.call("CheckNodeExists", {"address": node}, function (e) {
				if (e.result === true) {
					webMI.data.read(node, function (e) {
						var save = {};
						save[key] = allConfigs[key];
						webMI.data.write(node, JSON.stringify(save), function (e) {
							that.writeConfig(configList, configNode, allConfigs, onWriteCallback);
						});
					});
				} else {
					if (webMI.getMethodSupport().indexOf("AddNode") > -1) {
						var save = {};
						save[key] = allConfigs[key];
						webMI.data.call("AddNode", {
							"address": node,
							"typeDefinition": "i=62",
							"dataType": "STRING",
							"value": JSON.stringify(save),
							"nodeClass": "NODECLASS_VARIABLE",
							"writePolicy": 2
						}, function (result) {
							that.writeConfig(configList, configNode, allConfigs, onWriteCallback);
						});
					} else {
						console.warn("The AddNode method is not supported, please add the configuration node manually");
					}
				}
			});
		} else {
			webMI.data.read(node, function (e) {
				if (e.error && e.error != "0") {
					if (webMI.getMethodSupport().indexOf("AddNode") > -1) {
						var save = {};
						save[key] = allConfigs[key];
						webMI.data.call("AddNode", {
							"address": node,
							"typeDefinition": "i=62",
							"dataType": "STRING",
							"value": JSON.stringify(save),
							"nodeClass": "NODECLASS_VARIABLE",
							"writePolicy": 2
						}, function (result) {
							that.writeConfig(configList, configNode, allConfigs, onWriteCallback);
						});
					}
				} else {
					var save = {};
					save[key] = allConfigs[key];
					webMI.data.write(node, JSON.stringify(save), function (e) {
						that.writeConfig(configList, configNode, allConfigs, onWriteCallback);
					});
				}
			});
		}

	} else {
		/* delay for portal */
		setTimeout(function () {
			saveInProgress = false;
			onWriteCallback(allConfigs);
		}, 125);
	}
	return
}


ConfigHandler.prototype.deleteConfig = function (configNode, configName, chart, onDeleteCallback) {
	if (configName == "autosave")
		return;

	var that = this;
	var loadConfiguration = {
		"saveName": chart.chart.options.atviseOptions.saveMethod == "filesystem" ? chart.chart.options.atviseOptions.configFile : chart.chart.options.atviseOptions.configNode,
		"saveMethod": chart.chart.options.atviseOptions.saveMethod,
	}
	this.getConfigsFromNode(loadConfiguration.saveName, loadConfiguration.saveMethod, function (allConfigs) {
		/* multiple or single */
		var destination = false;
		if (typeof loadConfiguration.saveMethod != "undefined")
			destination = loadConfiguration.saveMethod;

		var HCI = {};
		if (destination == "multiple") {
			HCI.highchartsConfigIndex = [];
			for (var key in allConfigs) {
				if (key == configName) {
					console.log("Remove config: " + key);
					delete allConfigs[configName];
					webMI.data.call("DeleteNode", {address: configNode + "." + key}, function () {
					});
				} else {
					HCI.highchartsConfigIndex.push(key);
				}
			}
			webMI.data.write(configNode, JSON.stringify(HCI), function (e) {
				onDeleteCallback(allConfigs);
			});
		} else {
			that.saveConfigOrImport({"configNode": configNode, "configName": configName},
				chart,
				function () {
					onDeleteCallback(allConfigs)
				},
				true);
		}
	});
};

ConfigHandler.prototype.loadConfig = function (configNode, configMethode, configName, onLoadConfigCallback) {
	this.getConfigsFromNode(configNode, configMethode, function (allConfigs) {

		// check if config exists - otherwise try to load another config
		var foundConfig = false;
		if (typeof allConfigs[configName] == "undefined" && Object.keys(allConfigs).length > 0) {
			console.log("The parameterized configuration was not found! Try to load next configuration.");
			var configKeys = Object.keys(allConfigs);
			for (config in allConfigs) {
				if (config != configName && config != "autosave") {
					if (typeof allConfigs[config] != "undefined") {
						configName = config;
						foundConfig = true;
						break;
					}
				}
			}
		} else {
			foundConfig = true;
		}

		if (!foundConfig) {
			console.warn("Could not load " + configName + " configurations!");
		}

		/* check on config errors */
		for (config in allConfigs) {
			try {
				if (typeof allConfigs[config].xAxis[0].timeSpanUnit == "undefined" || typeof allConfigs[config].xAxis[0].timeSpanUnit == "") {
					allConfigs[config].xAxis[0].timeSpanUnit = 1;
				}
			} catch (exept) {
				console.log("Mismatch found in configuration " + config + " could not be fixed automatically")
			}
		}

		var chartConfig = allConfigs[configName];

		/* fix autoscale on load for old configs */
		if (typeof chartConfig != "undefined") {
			for (var i = 0; i < chartConfig.yAxis.length; i++) {
				if (chartConfig.yAxis[i]) {
					if (chartConfig.yAxis[i].autoscale) {
						chartConfig.yAxis[i].min = null;
						chartConfig.yAxis[i].max = null;
						chartConfig.yAxis[i].userMin = null;
						chartConfig.yAxis[i].userMax = null;
					}

					if (chartConfig.yAxis[i].type == "logarithmic") {
						if (typeof chartConfig.yAxis[i].userMin != "undefined" && chartConfig.yAxis[i].userMin != null) {
							if (chartConfig.yAxis[i].userMin <= 0) chartConfig.yAxis[i].userMin = 0.1;
							chartConfig.yAxis[i].min = chartConfig.yAxis[i].userMin;
						}
						if (typeof chartConfig.yAxis[i].userMax != "undefined" && chartConfig.yAxis[i].userMin != null) {
							if (chartConfig.yAxis[i].userMax <= 0) chartConfig.yAxis[i].userMax = 1;
							chartConfig.yAxis[i].max = chartConfig.yAxis[i].userMax;
						}
					}
				}
			}
		}


		/* fix menu height for mobile devices */
		try {
			var navigation = {};
			navigation.menuStyle = {};
			navigation.menuStyle.height = "200px";
			navigation.menuStyle.overflow = "auto";

			if (!webMI.getClientInfo().isDesktop) {
				chartConfig.navigation = navigation;
			}
		} catch (ex) {
			// config not ready ignore it
		}

		onLoadConfigCallback(chartConfig);
	});
};

ConfigHandler.prototype.updateChartConfig = function (chartID, cfg) {
	// todo call highcharts update function
};

ConfigHandler.prototype.getChartConfig = function (chartID, cfg) {
	// todo read highcharts config
};
