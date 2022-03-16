/**
 * Check Server time offset
 * @type {number}
 */
var serverTimeOffset = 0;
webMI.addEvent(webMI.data, "servertimeoffsetchanged", function (offset) {
	serverTimeOffset = offset;
});

/**
 * Creates a new renderer for a given chart. The renderer is responsible for data loading, live data rendering, the moving animation, non stop points and creating and controlling the measuring cursors.
 * @param {object} chart A highcharts chart
 * @param {onErrorCallback} onErrorCallback Callback function that is called if an error occurs.
 * @see {@link TrendControl.onErrorCallback}
 * @constructor
 */
function Renderer(chart, onErrorCallback) {
	var historyIsLoading = false; // << changed by trendcontrol

	this.onErrorCallback = onErrorCallback;
	this.chart = chart;
	this.dataHandler = new DataHandler();
	this.nodeMap = {};
	this.cursor1 = new MeasuringCursor({id: "measuringCursor1", dashStyle: "ShortDashDot"}, chart);
	this.cursor2 = new MeasuringCursor({id: "measuringCursor2", dashStyle: "ShortDashDotDot"}, chart);
	if (chart.options.atviseOptions) {
		if (!chart.options.atviseOptions.source || Datasource.getDatasourceTypes().indexOf(chart.options.atviseOptions.source) === -1) {
			this.onErrorCallback(30106, chart.options.atviseOptions.source);
		}

		this.dataSource = new Datasource({
			type: chart.options.atviseOptions.source,
			nodes: {}
		});
	}

	this.boundFunctions = {};
	this.boundFunctions.selectionHandler = this._selectionHandler.bind(this);
	this.chart.renderTo.ownerDocument.defaultView["Highcharts"].addEvent(this.chart, 'selection', this.boundFunctions.selectionHandler);
	this.zoomExtremes = null;
	this.zoomMaxOffset = 0;
	this.zoomMinOffset = 0;

	if (typeof chart._redrawInterval == "undefined")
		chart._redrawInterval = {};
	chart._redrawInterval[chart.index] = null;

	if (!chart._tickInterval)
		chart._tickInterval = {};
	chart._tickInterval[chart.index] = null;

	if (!chart._tick)
		chart._tick = {};
	chart._tick[chart.index] = null;

	if (!chart._interval)
		chart._interval = {};
	chart._interval[chart.index] = null;

	this.maxTimeLimit = 2145916800000; // 2145916800000 = 01/01/2038 or 18 days before a 32bit processor reach the unix timestamp limit!
}

function filterOutAggregateSeries(dataSourceOptions) {

	var newDataSourceOptions = JSON.parse(JSON.stringify(dataSourceOptions));

	for (var property in dataSourceOptions.aggregateOptions) {
		var value = dataSourceOptions.aggregateOptions[property];

		function isAggregate(value) {
			if (typeof value == 'undefined')
				return false;

			if (typeof value.aggregate == 'undefined' || value.aggregate == '' || value.aggregate == 'Sampled')
				return false;

			if (typeof value.interval == 'undefined' || value.interval == '')
				return false;

			var validUnits = ['s', 'm', 'h', 'd', 'M'];
			if (typeof value.unit == 'undefined' || validUnits.indexOf(value.unit) == -1)
				return false;

			return true;
		}

		if (isAggregate(value)) {
			delete newDataSourceOptions.nodes[property];
			delete newDataSourceOptions.aggregateOptions[property];
		}
	}

	return dataSourceOptions;
}

/**
 * Starts the continuous rendering. Subscribes all addresses on *chart.series[i].options.address* and *chart.series[i].options.address2* (address2 = high value for range chart types)
 * and starts a moving animation. Never call runContinuousRendering, if the moving animation is already running. Use [updateContinuousRendering ]{@link Renderer#updateContinuousRendering}
 * to subscribe / unsubscribe new addresses and [stopContinuousRendering]{@link Renderer#stopContinuousRendering} to stop the continuous rendering.
 * @returns {object} Is returned only if the series contains an aggregate. In this case the chart should not display live data.
 */
Renderer.prototype.runContinuousRendering = function () {
	if (isNaN(this.chart.xAxis[0].options.timeSpan) || isNaN(this.chart.xAxis[0].options.timeSpanUnit)) {
		this.onErrorCallback(20105);
		return;
	}	
	var self = this;
	var dataSourceOptions = self._getDataSourceOptions(self.chart.series);
	self.dataSource.updateNodes(filterOutAggregateSeries(dataSourceOptions));

	// Init size of viewport
	updateExtremes();

	//Subscribe and add new data
	self.dataSource.subscribe(function subscribeCallback(dataSourceErrors, data) {

		if (dataSourceErrors) {
			for (var key in dataSourceErrors) {
				self.onErrorCallback(20103, dataSourceErrors[key].message);
			}
		}

		for (var dataKey in data) {
			var series = self._getSeries(dataKey);
			if (series) {
				var points = [];
				for (var i = 0; i < data[dataKey].length; i++) {
					var p = self.dataHandler.getPoint(data[dataKey][i], series.options.type, dataKey);
					if (p) {
						points.push(p);
					}
				}

				self.updateInProgress = true;
				if (points.length > 0) {
					//Remove the right non stop point, than add the new point and then add the left non stop point. This order is important,
					//because highcharts needs sorted data. Otherwise the right non stop point would'nt be the last element of the data array.
					self._removeRightNonStopPoint(series);

					var pointArray = null;
					for (var i = 0; i < points.length; i++) {
						pointArray = points[i];
						if (pointArray) {
							// Add values new in timeline -> newer x than last point
							if (series.points.length == 0 || pointArray[0] > series.points[series.points.length - 1].x) {
								series.addLivePoint(pointArray, true, false);
							} else {

								function binarySearchInSeriesPoints(searchValue, bottomIndex, topIndex) {
									var midIndex = Math.floor((topIndex - bottomIndex) / 2 + bottomIndex);
									if (!series.points[midIndex])
										return -1;

									if (series.points[midIndex].x === searchValue) {
										// match
										return midIndex;
									} else if (series.points[midIndex].x < searchValue && topIndex - bottomIndex > 0) {
										// x lower
										return binarySearchInSeriesPoints(searchValue, midIndex + 1, topIndex);
									} else if (series.points[midIndex].x > searchValue && topIndex - bottomIndex > 0) {
										// x higher
										return binarySearchInSeriesPoints(searchValue, 0, midIndex);
									} else {
										return -1;
									}
								}

								var foundPointIndex = -1;
								if(series && !series.isSeriesBoosting && !series.chart.isBoosting) {
									foundPointIndex = binarySearchInSeriesPoints(pointArray[0], 0, series.points.length - 1);
								}

								// If there is old point having same x value as new point -> update
								if (foundPointIndex > -1 && series.chart && !series._historyLoading) {
									series.points[foundPointIndex].update(pointArray);
									if (typeof series._markPointForCleanUpInOriginalData == "function")
										series._markPointForCleanUpInOriginalData(pointArray);
								} else { // else -> add
									series.addLivePoint(pointArray, true, false);
								}
							}
						}
					}

					// Reset pointArray if more than one point available
					if (points.length != 1) {
						pointArray = null;
					}

					function applyNonStopPoints(series, points, pointArray) {
						if (series._historyLoading == true) {
							setTimeout(function waitForHistoryLoading() {
								applyNonStopPoints(series, points, pointArray)
							}, 100)
							return;
						}

						self._addOrRemoveLeftNonStopPoint(series, pointArray);

						var point = {
							x: -1,
							y: points[points.length - 1][1],
							low: points[points.length - 1][1],
							high: points[points.length - 1].length > 2 ? points[points.length - 1][2] : undefined
						};
						self._addRightNonStopPoint(series, point);
					}

					applyNonStopPoints(series, points, pointArray);
				}
			}
		}
	});


	self.chart._isRedrawComplete = true;

	//Start moving animation
	var now = 0;
	var then = Date.now() + serverTimeOffset;
	var delta;
	var framerate = self.chart.options.atviseOptions.liveModeFrameRate;

	if (framerate > 1000) {
		self.onErrorCallback(30006, 1 / framerate * 1000 + " ms");
	}

	var throttleFramerate = framerate !== 60;
	self.chart._interval[self.chart.index] = 1000 / framerate;
	self.chart._tick[self.chart.index] = null;
	currentAnimationFrame = window.requestAnimationFrame(renderAnimation);	
	// housekeeping ... keep memory low
	self.chart._tickInterval[self.chart.index] = setInterval(function refreshTick() {
		if (typeof self.chart._tick != "undefined")
			self.chart._tick[self.chart.index] = null;
	}, 5000);


	//Set min and max of highcharts to move the chart.
	function renderAnimation() {
		now = Date.now() + serverTimeOffset;
		delta = now - then;
		if (throttleFramerate) {
			if (typeof self.chart._interval != "undefined" && delta > self.chart._interval[self.chart.index]) {
				then = now - (delta % self.chart._interval[self.chart.index]);
				updateExtremes();
			}
		} else {
			updateExtremes();
		}
		if (typeof self.chart._tick != "undefined" && self.chart._tick[self.chart.index] != self.chart._downsampleValueSpan) {
			self.chart._tick[self.chart.index] = self.chart._downsampleValueSpan;
			setRenderInterval();
		}
// my correction
		//if (typeof self.chart._redrawInterval != "undefined"){		
		if (typeof self.chart._redrawInterval != "undefined" && self.dataSource.isSubscribed()){
			currentAnimationFrame = window.requestAnimationFrame(renderAnimation);			
		}
// end my correction		
	}

	// rendering interval depending on available draw aerea
	function setRenderInterval() {
		var intervalTimeout = self.chart._downsampleValueSpan < self.chart._interval[self.chart.index] ? self.chart._interval[self.chart.index] : self.chart._downsampleValueSpan;
		if (typeof self.chart._redrawInterval != "undefined" && self.chart._redrawInterval[self.chart.index] != null) {
			clearInterval(self.chart._redrawInterval[self.chart.index]);
			self.chart._redrawInterval[self.chart.index] = null;
		}
		if (typeof self.chart._redrawInterval != "undefined")
			self.chart._redrawInterval[self.chart.index] = setInterval(rendererRedraw, intervalTimeout);
	}

	// redraw function
	function rendererRedraw() {
		if (self.chart._isRedrawComplete) {
			self.chart._isRedrawComplete = false;
			self.chart.redraw(false);
		}
	}

	var lastUpdateExtremes = 0;
	
	function updateExtremes() {
		if (typeof self.chart.xAxis != "undefined") {
			var until = (new Date()).valueOf() + serverTimeOffset;
			var from = until - self.chart.xAxis[0].options.timeSpan * self.chart.xAxis[0].options.timeSpanUnit * 1000;			
			if (self.zoomReset) {
				self.zoomReset = false;
				self.zoomMaxOffset = 0;
				self.zoomMinOffset = 0;
			} else if (self.zoomExtremes !== null && self.zoomExtremes[0].min && self.zoomExtremes[0].max) {
				self.zoomMaxOffset = self.zoomExtremes[0].max - until;
				self.zoomMinOffset = self.zoomExtremes[0].min - from;
				self.zoomExtremes = null;
			}				
			self.chart.xAxis[0].setExtremes(from + self.zoomMinOffset, until + self.zoomMaxOffset, false, false);
// my correction
			self.chart.xAxis[0].options.min = from;
			self.chart.xAxis[0].options.max = until;
// end my correction			
			if (lastUpdateExtremes < from - 2500) {
				lastUpdateExtremes = from;
				for (var i = 0; i < self.chart.series.length; i++) {
					var series = self.chart.series[i];
					self._removeOldPoints(series, series.xAxis.getExtremes());
					if (typeof series._setCacheLimitForOriginalData == "function")
						series._setCacheLimitForOriginalData(series.xAxis.getExtremes());
				}
			}
		}
	}
};


/**
 * Removes all points from a given series that are not visible in the chart, except the last one that is not visible,
 * because a line from this point to the next point in the chart may be visible.
 * @param {series} series A highcharts series
 * @private
 */
Renderer.prototype._removeOldPoints = function (series, extremes) {
	if (this.zoomed || series.isSeriesBoosting)
		return;

	if (typeof extremes == "undefined")
		extremes = series.xAxis.getExtremes();

	/* clean points */
	var removePointStack = [];
	for (var i in series.points) {
		if (series.points[i] != null) {
			if (series.points[i].x < extremes.min && series.points[i].x > 0) {
				removePointStack.push(i);
			} else if (series.points[i].x >= extremes.min) {
				break;
			}
		}
	}

	// [AT-D-9932] ... leave last point for aggregates
	if(removePointStack.length > 0)
		removePointStack.pop();

	while (removePointStack.length > 0) {
		var i = removePointStack.pop();
		series.removePoint(i);
	}

	/* clean data */
	var removeDataStack = [];
	for (var i in series.data) {
		if (series.data[i] != null) {
			if (series.data[i].x < extremes.min && series.data[i].x > 0) {
				removeDataStack.push(i);
			} else if (series.data[i].x >= extremes.min) {
				break;
			}
		} else {
		}
	}

	// [AT-D-9932] ... leave last point for aggregates
	if(removeDataStack.length > 0)
		removeDataStack.pop();

	while (removeDataStack.length > 0) {
		var i = removeDataStack.pop();
		series.data[i].remove();
	}

};


/**
 * Subscribes, unsubscribes or updates added, deleted or changed addresses on all highcharts series.
 */
Renderer.prototype.updateContinuousRendering = function () {
	var dataSourceOptions = this._getDataSourceOptions(this.chart.series);
	this.dataSource.updateNodes(filterOutAggregateSeries(dataSourceOptions));

	// update housekeeping ...
	setTimeout(function() {
		if (self.chart && typeof self.chart._tick != "undefined")
			self.chart._tick[self.chart.index] = null;
	}, 1000);
};

/**
 * Stops the continuous rendering by unsubscribing all subscribed addresses and stopping the moving animation.
 */
Renderer.prototype.stopContinuousRendering = function () {
	this.dataSource.unsubscribe();
	//Stop moving animation
	window.cancelAnimationFrame(currentAnimationFrame);
};

/**
 * Loads all points for a given series (or all series if *series* not set) between *from* and *until* and draw them
 * on the chart. The chart's minimum and maximum are set to *from* and *until*.
 * @param {number} from Time stamp from which points are loaded.
 * @param {number} until Time stamp to which are all points are loaded.
 * @param {onHistoryLoadedCallback} [onHistoryLoadedCallback] Function that is called after the data has been loaded.
 * @param {series} [series] Draw history for this series. If not set, all series are drawn.
 * @see {@Link TrendControl.onHistoryLoadedCallback}
 */
Renderer.prototype.drawHistory = function (from, until, onHistoryLoadedCallback, series) {
	var self = this;
	clearInterval(self.chart._redrawInterval[self.chart.index]);

	if (isNaN(from)) {
		throw new Error("from must be a number");
		return;
	}
	if (isNaN(until)) {
		throw new Error("unil must be a number");
		return;
	}	
	this.chart.xAxis[0].setExtremes(from, until, false, false); // *** dnu ***

	//if a series is set, only this series is added to the data source options
	var dataSourceOptions;
	if (series) {
		dataSourceOptions = this._getDataSourceOptions([series]);
		series._historyLoading = true;
	} else {
		//otherwise all series are added to the dataSourceOptions
		dataSourceOptions = this._getDataSourceOptions(this.chart.series);
		for (var i = 0; i < this.chart.series.length; i++) {
			this.chart.series[i]._historyLoading = true;
		}
	}

	dataSourceOptions.from = from;
	dataSourceOptions.until = until;
	this.dataSource.loadPoints(dataSourceOptions, function (dataSourceErrors, data) {
		if (dataSourceErrors) {
			for (var key in dataSourceErrors) {
				self.onErrorCallback(20103, dataSourceErrors[key].message);
			}
		}

		/* clean series to remove all artifacts */
		for (var dataKey in data) {
			var series = self._getSeries(dataKey);
			if (series)
				series.setData([], false);
		}

		/* due asyncron processing insert each point individually! */
		for (var dataKey in data) {
			var series = self._getSeries(dataKey);
			if (series)
				series._historyLoading = false;
			if (series && data[dataKey].length > 0) {
				var dataArray = self.dataHandler.getData(data[dataKey], series.options.type, dataKey);
				var lastIndex = dataArray.length - 1;
				for (var da = 0; da < (lastIndex + 1); da++) {
					series.addPoint(dataArray[da], da == lastIndex, false);
				}
			}
		}
		// self.chart.redraw(); *** dnu ***
		self.updateNonStop();
		if (onHistoryLoadedCallback) {
			onHistoryLoadedCallback();
		}
	});
};

/**
 * Shows measuring cursor 1. If called, and the cursor is already shown, the position of the cursor is set to its default position.
 */
Renderer.prototype.showMeasuringCursor1 = function () {
	var extremes = this.chart.xAxis[0].getExtremes();
	var offset = (extremes.max - extremes.min) / 5;
	if (offset > 0) {
		this.cursor1.show(extremes.min + offset);
	} else {
		this.onErrorCallback(20104);
	}
};

/**
 * Shows measuring cursor 2. If called, and the cursor is already shown, the position of the cursor is set to its default position.
 */
Renderer.prototype.showMeasuringCursor2 = function () {
	var extremes = this.chart.xAxis[0].getExtremes();
	var offset = (extremes.max - extremes.min) / 5;
	if (offset > 0) {
		this.cursor2.show(extremes.max - offset);
	} else {
		this.onErrorCallback(20104);
	}
};

/**
 * Hides measuring cursor 1.
 */
Renderer.prototype.hideMeasuringCursor1 = function () {
	this.cursor1.hide();
};

/**
 * Hides measuring cursor 2.
 */
Renderer.prototype.hideMeasuringCursor2 = function () {
	this.cursor2.hide();
};

/**
 * Adds a new callback to the "OnValueChanged" event of the measuring cursor 1. The callback is fired, if the measured value
 * of the measuring cursor changes. If a new callback is registered and the cursor is visible, the callback is also fired
 * with the current measured values of the cursor.
 * @see {@link MeasuringCursor#registerOnValueChangedCallback}
 * @param {onValueChangedCallback} onValueChangedCallback A callback function
 * @returns {number} The callback ID of the registered callback.
 */
Renderer.prototype.registerMeasuringCursor1Callback = function (onValueChangedCallback) {
	return this.cursor1.registerOnValueChangedCallback(onValueChangedCallback);
};

/**
 * Adds a new callback to the "OnValueChanged" event of the measuring cursor 2. The callback is fired, if the measured value
 * of the measuring cursor changes. If a new callback is registered and the cursor is visible, the callback is also fired
 * with the current measured values of the cursor.
 * @see {@link MeasuringCursor#registerOnValueChangedCallback}
 * @param {onValueChangedCallback} onValueChangedCallback A callback function
 * @returns {number} The callback ID of the registered callback.
 */
Renderer.prototype.registerMeasuringCursor2Callback = function (onValueChangedCallback) {
	return this.cursor2.registerOnValueChangedCallback(onValueChangedCallback);
};

/**
 * Forces the "OnValueChanged" callbacks of both cursors to be fired.
 * @see {@link MeasuringCursor#forceCallbacks}
 */
Renderer.prototype.forceMeasuringCallbacks = function () {
	if (this.cursor1.getIsVisible())
		this.cursor1.forceCallbacks();
	if (this.cursor2.getIsVisible())
		this.cursor2.forceCallbacks();
};

/**
 * Removes an "OnValueChanged" callback from measuring cursor 1.
 * @see {@Link MeasuringCursor#unregisterOnValueChangedCallback}
 * @param {number} callbackId The ID of the callback that should be removed.
 */
Renderer.prototype.unregisterMeasuringCursor1Callback = function (callbackId) {
	this.cursor1.unregisterOnValueChangedCallback(callbackId);
};

/**
 * Removes an "OnValueChanged" callback from measuring cursor 2.
 * @see {@Link MeasuringCursor#unregisterOnValueChangedCallback}
 * @param {number} callbackId The ID of the callback that should be removed.
 */
Renderer.prototype.unregisterMeasuringCursor2Callback = function (callbackId) {
	this.cursor2.unregisterOnValueChangedCallback(callbackId);
};

/**
 * Returns true, if measuring cursor 1 is visible or false, if not.
 * @see {@Link MeasuringCursor#getIsVisible}
 * @returns {boolean} True, if the cursor is visible on the chart. False, if the cursor is hidden or moved to an invisible position of the chart.
 */
Renderer.prototype.isMeasuringCursor1Visible = function () {
	return this.cursor1.getIsVisible();
};

/**
 * Returns true, if measuring cursor 2 is visible or false, if not.
 * @see {@Link MeasuringCursor#getIsVisible}
 * @returns {boolean} True, if the cursor is visible on the chart. False, if the cursor is hidden or moved to an invisible position of the chart.
 */
Renderer.prototype.isMeasuringCursor2Visible = function () {
	return this.cursor2.getIsVisible();
};

/**
 * Deletes all data from a highcharts series.
 * @param {series} series A highcharts series
 */
Renderer.prototype.deleteSeriesData = function (series) {
	series.setData([]);
};

/**
 * Sets the type of the currently used source like "opcua".
 * @param {string} source Type of the source
 */
Renderer.prototype.setSource = function (source) {
	this.chart.options.source = source;
	this.dataSource = new Datasource({
		type: source,
		nodes: {}
	});
};

/**
 * Returns an array of all registered source types.
 * @returns {string[]} Array of all registered source types.
 */
Renderer.prototype.getRegisteredSources = function () {
	return Datasource.getDatasourceTypes();
};

/**
 * Shows or hides the left and right non stop points of all series according to the set option at *series.options.nonStop*.
 */
Renderer.prototype.updateNonStop = function () {
	for (var i = 0; i < this.chart.series.length; i++) {
		var series = this.chart.series[i];
		this._addOrRemoveLeftNonStopPoint(series);
		this._addOrRemoveRightNonStopPoint(series);
	}
	// this.chart.redraw(); *** dnu ***
};

/**
 * Destroys the renderer.
 */
Renderer.prototype.destroy = function () {
	var self = this
	this.cursor1.destroy();
	this.cursor2.destroy();
	this.chart.renderTo.ownerDocument.defaultView["Highcharts"].removeEvent(this.chart, 'selection', this.boundFunctions.selectionHandler);
	this.boundFunctions = null;
	this.zoomExtremes = null;
	clearInterval(this.chart._redrawInterval[this.chart.index]);
	clearInterval(this.chart._tickInterval[this.chart.index]);
	this.chart._redrawInterval[this.chart.index] = null;
	this.chart._tickInterval[this.chart.index] = null;
	self = null;
};


Renderer.prototype._selectionHandler = function (selectionEvent) {
	if (selectionEvent.resetSelection) {	
		this.zoomReset = true;
		this.zoomed = false;
// my correction	
		var from = this.chart.xAxis[0].options.min;//until - this.chart.xAxis[0].options.timeSpan * this.chart.xAxis[0].options.timeSpanUnit * 1000;
		var until = this.chart.xAxis[0].options.min+this.chart.xAxis[0].options.timeSpan * this.chart.xAxis[0].options.timeSpanUnit * 1000;//(new Date()).valueOf() + serverTimeOffset;		
		
		this.chart.xAxis[0].options.min = from;  // it works!!!!
		this.chart.xAxis[0].options.max = until;
		
		this.zoomExtremes = null; 
// end my correction		

	} else {		
		this.zoomExtremes = selectionEvent.xAxis;
		this.zoomed = true;
	}
};

/**
 * Adds or removes the left point on a given series for the "non stop" line according to the options set at series.options.nonStop.
 * @param {series} series A highcharts series
 * @private
 */
Renderer.prototype._addOrRemoveLeftNonStopPoint = function (series, pointValue) {
	if(typeof series.options == "undefined")
		return;
	var pointId = "leftNonStopPoint-" + series.options.id;
	if (series.options.nonStop && !this.chart.get(pointId) && series.xAxis.getExtremes()) {
		var min = 0; // series.xAxis.getExtremes().min;

		// values are available after complete initialization
		// so if y can read it in the browser - y probably cant access it at first run of this function
		// in that case the pointValue is needed
		// Happy JS - Scopes!
		var firstPoint = {x: series.xData[0], y: series.yData[0]};

		//if(typeof pointValue !== "undefined" && pointValue !== null ) {
		if (typeof firstPoint.x == "undefined" || typeof firstPoint.y == "undefined") {
			if (typeof pointValue !== "undefined" && pointValue !== null) {
				// starting the chart - firstPoint is not reachable - so use the realValues
				series.addLivePoint({id: pointId, x: min, y: pointValue[1]}, true);
			}
		} else if (firstPoint && firstPoint.x > min) {
			//Check if the most left point of the series is visible at the chart (and not too far on the left)
			// series.addPoint({id: pointId, x: min, y: firstPoint.y, low: firstPoint.low, high: firstPoint.high}, true);
			series.addLivePoint({id: pointId, x: min, y: firstPoint.y, low: firstPoint.low, high: firstPoint.high}, true);
		}
	} else if (!series.options.nonStop && this.chart.get(pointId)) {
		this.chart.get(pointId).remove();
	}
};

/**
 * Adds or removes the right point on a given series for the "non stop" line according to the options set at series.options.nonStop.
 * @param {series} series A highcharts series
 * @private
 */
Renderer.prototype._addOrRemoveRightNonStopPoint = function (series) {
	if (series.options.nonStop && series.yData.length > 0) {
		var lastPoint = {x: series.xData[series.xData.length - 1], y: series.yData[series.yData.length - 1]};
		if (lastPoint) {
			this._removeRightNonStopPoint(series);
			this._addRightNonStopPoint(series, lastPoint);
		}
	} else if (!series.options.nonStop) {
		this._removeRightNonStopPoint(series);
	}
};

/**
 * Adds the point for the right "non stop" line.
 * Move right point to x: this.maxTimeLimit
 * @param {series} series A highcharts series
 * @param {object} point A point object with x, y, low and high set. The point for the non stop line is set at this point's y, low and high values,
 * but x is overwritten with max from the series's x axis.
 * @private
 */
Renderer.prototype._addRightNonStopPoint = function (series, point) {
	if(typeof series.options == "undefined")
		return;
	var pointId = "rightNonStopPoint-" + series.options.id;
	if (series.visible) {
		if (series.options.nonStop) {
			if (!this.chart.get(pointId) && series.xAxis.getExtremes()) {
				series.addLivePoint({
					id: pointId,
					x: this.maxTimeLimit,
					y: point.y,
					low: point.low,
					high: point.high
				}, true);
			}
		}
	}
};

/**
 * Removes the right non stop point from a given series.
 * @param {series} series A highcharts series
 * @private
 */
Renderer.prototype._removeRightNonStopPoint = function (series) {
	var pointId = "rightNonStopPoint-" + series.options.id;
	var point = false;
	try {
		point = this.chart.get(pointId);
	} catch (ex) {
	}
	;

	if (point) {
		point.remove(false);
	} else {
		if (series.options.nonStop && series.xData[series.xData.length - 1] == this.maxTimeLimit) {
			series.yData.splice(series.yData.length - 1, 1);
			series.xData.splice(series.xData.length - 1, 1);
		}
	}
};

/**
 * Updates all right non stop points with the given x value.
 * @param {number} x An x value
 * @private
 */
Renderer.prototype._updateRightNonStopPoints = function (x) {

	var self = this;
	// block updates the next 250ms after a new point is set
	// >>> block calculation depends on frame rate
	var blockValue = Math.ceil(40 / (1000 / this.chart.options.atviseOptions.liveModeFrameRate));

	// block update wen a new right point was set (at incoming data)
	// otherwise highchart will be faster than the point is processed and an error is thrown
	if (typeof self.updateInProgress == "undefined" || typeof self.blockUpdate == "undefined") {
		self.blockUpdate = blockValue;
		self.updateInProgress = false;
	}

	if (self.updateInProgress == true && self.blockUpdate < 0) {
		self.updateInProgress = false;
	} else if (self.updateInProgress != true) {
		for (var i = 0; i < this.chart.series.length; i++) {
			var pointId = "rightNonStopPoint-" + this.chart.series[i].options.id;
			var point = this.chart.get(pointId);
			if (point && point.update) {
				point.update({x: x}, false);
			}
		}
		self.blockUpdate = blockValue * 2;
	} else {
		self.blockUpdate--;
	}
};

/**
 * Returns an dataSourceOptions object with nodes and aggregateOptions set for all series from the given series array.
 * @param {series[]} seriesArray An array of series.
 * @returns {object}
 * @private
 */

Renderer.prototype._getDataSourceOptions = function (seriesArray) {
	var dataSourceOptions = {};
	dataSourceOptions.nodes = {};
	dataSourceOptions.aggregateOptions = {};
	dataSourceOptions.dataArchives = {};
	var self = this;
	seriesArray.forEach(function (seriesElement) {
		self._addSeriesToDataSourceOptions(seriesElement, dataSourceOptions);
	});
	return dataSourceOptions;
};

/**
 * Adds the address and the aggregate options to the dataSourceOptions object. If the series is a range series and address2 is set,
 * an entry with the ending "--high-value" will be added to nodes map of the dataSourceOptions and the aggregate map.
 * @param {series} series A highcharts series
 * @param {object} dataSourceOptions A dataSourceOptions object
 * @private
 */
Renderer.prototype._addSeriesToDataSourceOptions = function (series, dataSourceOptions) {
	if (series.options.address) {
		if (this.dataHandler.hasSupportedSeriesType(series.options.type)) {
			dataSourceOptions.nodes[series.options.id] = series.options.address;
			dataSourceOptions.aggregateOptions[series.options.id] = series.options.aggregate;
			dataSourceOptions.dataArchives[series.options.id] = series.options.dataArchive;
		} else {
			this.onErrorCallback(20100, series.options.type);
		}
	}
	if (this._isRangeSeries(series.options.type) && series.options.address && series.options.address2) {
		dataSourceOptions.nodes[series.options.id + "--high-value"] = series.options.address2;
		dataSourceOptions.aggregateOptions[series.options.id + "--high-value"] = series.options.aggregate2;
		dataSourceOptions.dataArchives[series.options.id + "--high-value"] = series.options.dataArchive2;
	}
};

/** Returns true if the given series type is "arearange", "areasplinerange" or "columnrange", and false, if not.
 * @param {string} seriesType A highcharts series type.
 * @returns {boolean} True, if range type, false if not.
 * @private
 */
Renderer.prototype._isRangeSeries = function (seriesType) {
	return seriesType == "arearange" || seriesType == "areasplinerange" || seriesType == "columnrange";
};

/**
 * Gets the series according to a data key. Usually the data key is equal to the series id, except for range series,
 * because range series have two data source subscriptions: One equal to the series id, and one ending with "--high-value".
 * Returns undefined, if not series is found for the given key.
 * @param {string} key A data key.
 * @returns {series} A highcharts series or undefined.
 * @private
 */
Renderer.prototype._getSeries = function (key) {
	if (key) {
		if (key.indexOf("--high-value") > -1) {
			key = key.replace("--high-value", "");
		}
		return this.chart.get(key);
	}
	return undefined;
};