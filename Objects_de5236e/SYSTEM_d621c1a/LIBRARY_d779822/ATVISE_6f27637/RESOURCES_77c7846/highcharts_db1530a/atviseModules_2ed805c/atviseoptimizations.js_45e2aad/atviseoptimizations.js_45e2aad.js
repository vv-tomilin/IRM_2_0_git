/*Fix for highcharts event-coordinates*/
(function (H) {

	Object.defineProperty(H.Chart.prototype, 'pixelWidth', {
		get: function () {
			if (this._scale) {
				return this.clipBox.width * this._scale;
			}

			if (webMI.gfx.getAbsoluteScaleFactor) {
				this._scale = webMI.gfx.getAbsoluteScaleFactor(true, this.container);
				return this.pixelWidth;
			}

			// Scale polyfill
			var currentElement = this.container;
			var scale = currentElement.getBoundingClientRect().width / currentElement.offsetWidth;

			if (currentElement.style.zoom !== undefined) {
				do {
					if (currentElement.style) {
						var elementZoom = parseFloat(currentElement.style.zoom);

						if (!isNaN(elementZoom)) {
							scale *= elementZoom;
						}
					}

					currentElement = currentElement.parentNode;
				} while (currentElement);
			}

			this._scale = scale;

			return this.pixelWidth;
		},
	});


	H.Chart.prototype._setRedrawComplete = function () {
		this._isRedrawComplete = true;
	}


	H.Chart.prototype._setExtremesComplete = function () {
		this._isExtremesComplete = true;
	}


	H.wrap(H.Pointer.prototype, 'normalize', function (proceed, event, chartPosition) {
		var doc = this.chart.container.ownerDocument;
		var win = doc.defaultView;
		var docElem = doc.documentElement;
		var correctedClientRect = webMI.gfx.getBoundingClientRect(this.chart.container);
		var correctedChartPosition = {
			top: correctedClientRect.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
			left: correctedClientRect.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
		};
		/*Highcharts Pointer.js: check if overriding of the chartPosition is possible (line 125)*/
		var extendedEvent = proceed.call(this, event, correctedChartPosition);
		var scaleFactor = webMI.gfx.getAbsoluteScaleFactor(true, this.chart.container);
		extendedEvent.chartX = Math.round(extendedEvent.chartX / scaleFactor);
		extendedEvent.chartY = Math.round(extendedEvent.chartY / scaleFactor);
		return extendedEvent;
	});


	H.Series.prototype.lockAddPoint = function (lock) {
		this.lockForOtherFunctions = lock;
	}


	H.wrap(H.Series.prototype, 'update', function (proceed, options, redraw, callback, timeout) {
		if(!redraw)
			redraw = false;
		if(!timeout)
			timeout = 500;
		if(callback)
			setTimeout(callback, timeout);
		proceed.apply(this, [options, redraw]);
	});


	H.wrap(H.Series.prototype, 'addPoint', function (proceed, point, redraw, animate) {
		/* ignore points below min or add point */
		if (this.chart._startWithExtremMin > 0 && this.chart._startWithExtremMin > point[0] && point[0] > 0) {
			/* skip point console.warn(this.chart._startWithExtremMin); */
		} else if (this.lastAddPoint && this.lastAddPoint[0] > point[0]) {
			/* allready in */
		} else {
			/* prevent unwanted rendering */
			if(!this.chart._isRedrawComplete)
				redraw = false;
			if(redraw)
				this.chart._isRedrawComplete = false;

			/* proceed */
			if(!(point.id && point.id.indexOf('NonStopPoint') > 0))
				this.lastAddPoint = point;
			proceed.apply(this, [point, redraw ? redraw : false, animate ? animate : false]);
		}
	});


	H.wrap(H.Series.prototype, 'setData', function (proceed, data) {
		/* remove wrong points */
		var cleanArray = [];
		for(var key in data)
			if(Array.isArray(data[key]) || (typeof data[key] == "object" && data[key]["y"]))
				cleanArray.push(data[key]);
		data = cleanArray;

		this.lastAddPoint = undefined;
		if (typeof this.chart.lockForSetData == "undefined") {
			this.chart.lockForSetData = [];
		}
		this.chart.lockForSetData[this.options.id] = true;
		this.watchDataReady();

		if (typeof this.xAxis != "undefined" && this.xAxis.getExtremes().min)
			if (this.xAxis.getExtremes().min)
				this.chart._startWithExtremMin = this.xAxis.getExtremes().min - 5000;
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	});


	H.Series.prototype.watchDataReady = function () {
		var that = this;
		this.setDataSize = -1;

		var checkLockInterval = 100;
		if (!that.forceUnlock)
			that.forceUnlock = 1000;

		if (!this.chart._watchDataReadyStack)
			this.chart._watchDataReadyStack = [];

		if (this.options.id) {
			var watchDataReadyID = setInterval(function () {
				try {
					var currentSize = that.data ? that.data.length : null;
					if (that.setDataSize == currentSize) {
						that.chart.lockForSetData[that.options.id] = false;
					} else if (that.data == 0 && that.forceUnlock <= 0) {
						that.chart.lockForSetData[that.options.id] = false;
					} else if (that.data) {
						that.forceUnlock = that.forceUnlock - checkLockInterval;
					}
					if (currentSize != null)
						that.setDataSize = currentSize;
				} catch (ex) {
					clearInterval(watchDataReadyID);
				}
			}, checkLockInterval);
			this.chart._watchDataReadyStack.push([this.options.id, watchDataReadyID]);
		}
	}


	H.Series.prototype.addLivePoint = function (pointArray, arg2, arg3) {
		var that = this;

		if (typeof this.chart.lockForSetData == "undefined") {
			this.chart.lockForSetData = [];
		}
		if (typeof this.chart.lockForSetData[this.options.id] == "undefined") {
			this.chart.lockForSetData[this.options.id] = true;
		}
		if (typeof this.lockForOtherFunctions == "undefined")
			this.lockForOtherFunctions = false;

		var checkID = pointArray.id;
		if (checkID) {
			if (checkID.indexOf('NonStopPoint') !== -1) {
				this.addPoint(pointArray, arg2, arg3);
				return;
			}
		}

		if (!this.addLivePointStack)
			this.addLivePointStack = [];

		if (!this.chart.lockForSetData[this.options.id] && this.chart._watchDataReadyStack.length) {
			for (var s in this.chart._watchDataReadyStack) {
				var tOut = this.chart._watchDataReadyStack[s];
				if (tOut[0] == this.options.id) {
					clearInterval(tOut[1]);
					delete this.chart._watchDataReadyStack[s];
				}
			}
		}

		this.addLivePointStack.push([pointArray, arg2, arg3]);

		var data;
		while (this.addLivePointStack.length > 0 && ((!this.chart.lockForSetData[this.options.id] && !this.lockForOtherFunctions) || this.chart.options.atviseOptions.mode == "live")) {
			data = this.addLivePointStack.shift();
			var oLastPoint = 0;
			var isCache = typeof this.chart._originalDataCache != "undefined";
			var isEmpty = isCache ? typeof this.chart._originalDataCache[this.options.id] == "undefined" : true;
			var isLength = !isEmpty ? this.chart._originalDataCache[this.options.id].length : false;

			if (isCache && !isEmpty && isLength > 0) {
				oLastPoint = this.chart._originalDataCache[this.options.id][this.chart._originalDataCache[this.options.id].length - 1];
				oLastPoint = oLastPoint ? oLastPoint[0] : 0;
			}

			if (oLastPoint < data[0][0]) {
				this.addPoint(data[0], data[1], data[2]);
			}
		}
		if (this.addLivePointStack.length > 0) {
			// console.log("HCharts: Some data could not be processed!");
		}
	}

	if (!Date.now) {
		Date.now = function () {
			return new Date().getTime();
		}
	}

	var utils = {};
	var lastErrorTimestamp = {};

	H.error = function (code, stop, chart) {

		if (typeof lastErrorTimestamp[code] == "undefined" || Date.now() - lastErrorTimestamp[code] > 2500) {
			lastErrorTimestamp[code] = Date.now();
			reportNotification = function () {
				var chartInstance = chart ? chart : Highcharts.charts[Highcharts.hoverChartIndex];
				if (chartInstance) {
					if (typeof utils[chartInstance] == "undefined") {
						utils[chartInstance] = new Utils(chartInstance);
					}
					utils[chartInstance].reportNotification(code, "", true);
				}
			}
			var msg = H.isNumber(code) ?
				'Highcharts error #' + code + ': www.highcharts.com/errors/' +
				code : code,
				defaultHandler = function () {
					reportNotification();
					if (stop) {
						throw new Error(msg);
					}

				};

			if (chart) {
				H.fireEvent(
					chart, 'displayError', {code: code, message: msg}, defaultHandler
				);
			} else {
				defaultHandler();
			}
		}
	};


	H.getStyle = function (el, prop, toInt) {

		var style;

		// For width and height, return the actual inner pixel size (#4913)
		if (prop === 'width') {

			function checkForTransform(element, hasTransform) {
				if (hasTransform == undefined) hasTransform = false;
				if (!element || element.tagName === 'BODY' || hasTransform === true) return hasTransform;
				if (H.getStyle(element, 'transform', false) !== 'none') hasTransform = true;
				checkForTransform(element.parentNode);
			}

			return Math.max(
				0, // #8377
				(
					Math.min(
						el.offsetWidth,
						el.scrollWidth,
						(
							el.getBoundingClientRect &&
							// #9871, getBoundingClientRect doesn't handle
							// transforms, so avoid that
							checkForTransform(el) === true
						) ?
							Math.floor(el.getBoundingClientRect().width) : // #6427
							Infinity
					) -
					H.getStyle(el, 'padding-left') -
					H.getStyle(el, 'padding-right')
				)
			);
		}

		if (prop === 'height') {
			return Math.max(
				0, // #8377
				Math.min(el.offsetHeight, el.scrollHeight) -
				H.getStyle(el, 'padding-top') -
				H.getStyle(el, 'padding-bottom')
			);
		}

		if (!H.win.getComputedStyle) {
			// SVG not supported, forgot to load oldie.js?
			H.error(27, true);
		}

		// Otherwise, get the computed style
		style = H.win.getComputedStyle(el, undefined);
		if (style) {
			style = style.getPropertyValue(prop);
			if (H.pick(toInt, prop !== 'opacity')) {
				style = H.pInt(style);
			}
		}
		return style;
	};

}(Highcharts));