/**
 * The TrendControl is a decorator that decorators a control object with functions to control atvise specific behavior of a chart.
 * <br>The TrendControl is responsible for handling the different modes, for starting and stopping the live mode, and for handling "updated" calls.
 * <br>You don't need do call this constructor, because [decorate]{@Link TrendControl.decorate} is a static function.
 * @See {@Link TrendControl.decorate}
 * @constructor
 */
function TrendControl() {
}

/**
 * Decorators a control object with functions to control atvise specific behavior of a chart.
 * @param {object} control This object will be decorated.
 * @param {object} chart A highcharts instance.
 */
TrendControl.decorate = function (control, chart) {
	var utils = new Utils(chart);
	var renderer = new Renderer(chart, onErrorCallback);
	var isLiveModeRunning = false;
	var isLiveModePaused = false;
	var seriesCounter = 0;
	var updateEnabled = true;
	var updateCallbacks = [];
	var _internal = {};

	//Set series ids for all series that are initially on the chart.
	_setSeriesIds();

	//Copy current config to detect later changes.
	var oldConfig = _copyConfig();

	//Show cursors on first call of showOrHideMeasuringCursors();
	if (oldConfig.options.atviseOptions) {
		oldConfig.options.atviseOptions.enableCursor1 = undefined;
		oldConfig.options.atviseOptions.enableCursor2 = undefined;
	}

	//Start and stop live mode depending on document.hidden.
	document.addEventListener("visibilitychange", _handleVisibilityChange);

	/**
	 * Starts the live rendering by subscribing all series addresses and starting the moving animation.
	 * There are two modes: "mixed" and "live". In "mixed" mode, historized data will be loaded before the live subscription starts.
	 * @param {string=} mode Can be "live" or "mixed". If set, the rendering will be started in the given mode. If not set,
	 * the current set mode of *chart.options.atviseOptions.mode* is used. If the set mode is not "live" or "mixed", the onErrorCallback is called.
	 * @memberof TrendControl
	 */
	control.startLiveMode = function (mode, suppressLoading) {		
		if (typeof suppressLoading == "undefined")
			suppressLoading = false;
		if (!isLiveModeRunning) {
// my correction	
//			chart.xAxis[0].zoomEnabled = false;	
			if(renderer.zoomed){
				chart.zoomOut();
			}
// end my correction			
			if (mode == "mixed" || mode == "live") {
				control.setMode(mode);
			}
			if (control.getMode() == 'live' || control.getMode() == 'mixed') {
				if (control.getMode() == 'mixed' && !suppressLoading) {
					_loadHistoryForMixedMode(null, true);
				}
				renderer.runContinuousRendering();
				_showOrHideMeasuringCursors();
				isLiveModeRunning = true;
				_triggerOnUpdatedCallback();
			} else {
				onErrorCallback(10002, control.getMode());
			}
		} else {
			onErrorCallback(10000, "");
		}
	};

	/** Stops the live mode.
	 * @memberof TrendControl
	 */
	control.stopLiveMode = function (stopLiveModeCallback) {
		if (isLiveModeRunning) {
			renderer.stopContinuousRendering();
			isLiveModeRunning = false;
// my correction
		
//			chart.xAxis[0].zoomEnabled = true;	
// end my correction			
			_triggerOnUpdatedCallback();
		} else {
			onErrorCallback(10001, "");
		}
		if (typeof stopLiveModeCallback == "function") {
			stopLiveModeCallback();
		}
	};
	/**
	 * Loads data for all series between *chart.xAxis[0].options.min* and *chart.xAxis[0].options.max*.
	 * @memberof TrendControl
	 */
	control.loadHistory = function () {
		if (isLiveModeRunning) {
			control.stopLiveMode();
		}
		control.setMode("history");
		if (isNaN(chart.xAxis[0].options.min)) {
			onErrorCallback(30101, chart.xAxis[0].options.min);
			return;
		} else if (isNaN(chart.xAxis[0].options.max)) {
			onErrorCallback(30102, chart.xAxis[0].options.max);
			return;
		}

		utils.resetErrors();

		_setLoadingState(true);
		utils.showLoading(utils.getOptions().loadingMessage);
		renderer.drawHistory(chart.xAxis[0].options.min, chart.xAxis[0].options.max, onHistoryLoadedCallback);
	};

	/**
	 * This function need to be called after options of the chart, the series or the axis has been changed. Depending on the
	 * changed options, the data will be reloaded, new series subscribed, or the mode will be changed or the measuring cursor will be shown / not show.
	 * <br>Additionally, all registered "onUpdated" callbacks are called.
	 * @memberof TrendControl
	 */
	control.updated = function (exec, callback) {
		if (typeof exec !== "boolean") {
			callback = (typeof exec === "function") ? exec : "";
			exec = false;
		} else {
			callback = (typeof callback === "function") ? callback : "";
		}
		if (updateEnabled) {
			updateEnabled = false;
			updateCallbacks = [];
			if (typeof callback === "function")
				updateCallbacks.push(callback);
			setTimeout(function () {
				try {
					control.updated(true);
				} catch (ex) {
				}
			}, 50)
			return;
		} else {
			if (typeof callback === "function")
				updateCallbacks.push(callback);
		}

		if (!exec)
			return;

		updateEnabled = true;

		_setSeriesIds();
		_handleSeriesTypeChangedToArea();

		if (oldConfig.options.atviseOptions.source != chart.options.atviseOptions.source) {
			control.setSource(chart.options.atviseOptions.source);
		}

		if (oldConfig.options.atviseOptions.disableDownSampling != chart.options.atviseOptions.disableDownSampling) {
			chart.setDownsamplingEnabled(!chart.options.atviseOptions.disableDownSampling);
		}

		if (control.getMode() == 'live' || control.getMode() == 'mixed') {
			if (control.getMode() == 'mixed') {
				//If xAxis changed load history for all series new (e.g. if the time span has been changed to a larger time span)
				if (_xAxisChanged()) {				
					_loadHistoryForMixedMode(null, true);
				} else {
					//Reload only changed series:					
					for (var i = 0; i < chart.series.length; i++) {
						if (_seriesChanged(chart.series[i])) {
							_loadHistoryForMixedMode(chart.series[i]);
						}
					}
				}
			}
			if (isLiveModeRunning) {
				renderer.updateContinuousRendering();
			}
		} else if (control.getMode() == 'history') {
			if (_xAxisChanged()) {
				control.loadHistory();
			} else {
				if (control.isLiveModeRunning()) {
					control.stopLiveMode();
				}
				//Reload only changed series:
				for (var i = 0; i < chart.series.length; i++) {
					if (_seriesChanged(chart.series[i]) && chart.xAxis[0].getExtremes()) {
						_setLoadingState(true);
						utils.showLoading(utils.getOptions().loadingMessage);
						
						
						renderer.drawHistory(chart.xAxis[0].getExtremes().min, chart.xAxis[0].getExtremes().max, onHistoryLoadedCallback, chart.series[i]);
					}
				}
			}
		}
		_showOrHideMeasuringCursors();
		renderer.updateNonStop();

		oldConfig = _copyConfig();

		_triggerOnUpdatedCallback();

		setTimeout(function() {
			for (var i in updateCallbacks)
				updateCallbacks[i]();
		}, 500);
	};

	/**
	 * Removes all event listener and callbacks and destroys the utils and the renderer.
	 * @memberof TrendControl
	 */
	control.destroy = function () {
		var self = this;
		document.removeEventListener("visibilitychange", _handleVisibilityChange);
		if (isLiveModeRunning) {
			renderer.stopContinuousRendering()
		}
		delete this.registeredOnValueChangedCallbacks;
		utils.destroy();
		renderer.destroy();
		chart.destroy();
		utils = null;
		renderer = null;
		chart = null;
		self = null;
	};

	/**
	 * Registers a new callback for the onUpdated event.
	 * @param {onUpdatedCallback} onUpdatedCallback A callback function.
	 * @returns {number} The callback id of the registered callback.
	 * @memberof TrendControl
	 */
	control.registerOnUpdatedCallback = function (onUpdatedCallback) {
		if (typeof onUpdatedCallback === "function") {
			var arrayLength = TrendControl._registeredOnUpdatedCallbacks.push(onUpdatedCallback);
			return arrayLength - 1;
		} else {
			onErrorCallback(30002, "");
		}
	};

	/**
	 * Removes an "OnUpdated" callback.
	 * @param {number} callbackId The id of the callback that should be removed.
	 * @memberof TrendControl
	 */
	control.unregisterOnUpdatedCallback = function (callbackId) {
		if (typeof callbackId === "number") {
			//Use delete, because we don't want the array to reindex.
			delete TrendControl._registeredOnUpdatedCallbacks[callbackId];
		} else {
			onErrorCallback(30003, "");
		}
	};

	/**
	 * Shows measuring cursor 1. If called, and the cursor is already shown, the position of the cursor is set to its default position.
	 * @memberof TrendControl
	 */
	control.showMeasuringCursor1 = function () {
		chart.options.atviseOptions.enableCursor1 = true;
		renderer.showMeasuringCursor1();
		_triggerOnUpdatedCallback();
	};

	/**
	 * Shows measuring cursor 2. If called, and the cursor is already shown, the position of the cursor is set to its default position.
	 * @memberof TrendControl
	 */
	control.showMeasuringCursor2 = function () {
		chart.options.atviseOptions.enableCursor2 = true;
		renderer.showMeasuringCursor2();
		_triggerOnUpdatedCallback();
	};

	/**
	 * Hides measuring cursor 1.
	 * @memberof TrendControl
	 */
	control.hideMeasuringCursor1 = function () {
		chart.options.atviseOptions.enableCursor1 = false;
		renderer.hideMeasuringCursor1();
		_triggerOnUpdatedCallback();
	};

	/**
	 * Hides measuring cursor 2.
	 * @memberof TrendControl
	 */
	control.hideMeasuringCursor2 = function () {
		chart.options.atviseOptions.enableCursor2 = false;
		renderer.hideMeasuringCursor2();
		_triggerOnUpdatedCallback();
	};

	/**
	 * Adds a new callback to the "OnValueChanged" event of the measuring cursor 1. The callback is fired, if the measured value
	 * of the measuring cursor changes. If a new callback is registered and the cursor is visible, the callback is also fired
	 * with the current measured values of the cursor.
	 * @param {onValueChangedCallback} onValueChangedCallback A callback function
	 * @returns {number} The callback ID of the registered callback.
	 * @memberof TrendControl
	 */
	control.registerMeasuringCursor1Callback = function (onValueChangedCallback) {
		return renderer.registerMeasuringCursor1Callback(onValueChangedCallback);
	};

	/**
	 * Adds a new callback to the "OnValueChanged" event of the measuring cursor 2. The callback is fired, if the measured value
	 * of the measuring cursor changes. If a new callback is registered and the cursor is visible, the callback is also fired
	 * with the current measured values of the cursor.
	 * @param {onValueChangedCallback} onValueChangedCallback A callback function
	 * @returns {number} The callback ID of the registered callback.
	 * @memberof TrendControl
	 */
	control.registerMeasuringCursor2Callback = function (onValueChangedCallback) {
		return renderer.registerMeasuringCursor2Callback(onValueChangedCallback);
	};

	/**
	 * Removes an "OnValueChanged" callback from measuring cursor 1.
	 * @param {number} callbackId The ID of the callback that should be removed.
	 * @memberof TrendControl
	 */
	control.unregisterMeasuringCursor1Callback = function (callbackId) {
		renderer.unregisterMeasuringCursor1Callback(callbackId);
	};

	/**
	 * Removes an "OnValueChanged" callback from measuring cursor 2.
	 * @param {number} callbackId The ID of the callback that should be removed.
	 * @memberof TrendControl
	 */
	control.unregisterMeasuringCursor2Callback = function (callbackId) {
		renderer.unregisterMeasuringCursor2Callback(callbackId);
	};

	/**
	 * Returns true, if measuring cursor 1 is visible or false, if not.
	 * @returns {boolean} True, if the cursor is visible on the chart. False, if the cursor is hidden or moved to an invisible position of the chart.
	 * @memberof TrendControl
	 */
	control.isMeasuringCursor1Visible = function () {
		return renderer.isMeasuringCursor1Visible();
	};

	/**
	 * Returns true, if measuring cursor 2 is visible or false, if not.
	 * @returns {boolean} True, if the cursor is visible on the chart. False, if the cursor is hidden or moved to an invisible position of the chart.
	 * @memberof TrendControl
	 */
	control.isMeasuringCursor2Visible = function () {
		return renderer.isMeasuringCursor2Visible();
	};

	/**
	 * Returns true, if the live mode is currently running.
	 * @returns {boolean} True, if the live mode is currently running, and false, if not.
	 * @memberof TrendControl
	 */
	control.isLiveModeRunning = function () {
		return isLiveModeRunning;
	};

	/**
	 * Sets the type of the currently used source like "opcua".
	 * @param {string} source Type of the source
	 * @memberof TrendControl
	 */
	control.setSource = function (source) {
		var wasLive = isLiveModeRunning;
		if (isLiveModeRunning) {
			control.stopLiveMode();
		}
		renderer.setSource(source);
		if (wasLive) {
			control.startLiveMode();
		}
	};

	/**
	 * Returns an array of all registered source types.
	 * @returns {string[]} Array of all registered source types.
	 * @memberof TrendControl
	 */
	control.getRegisteredSources = function () {
		return renderer.getRegisteredSources();
	};

	/**
	 * Sets the given mode at *chart.options.atviseOptions.mode*.
	 * OnError is called, if the mode is not "live", "mixed" or "history".
	 * @param {string} mode "live", "mixed" or "history".
	 * @memberof TrendControl
	 */
	control.setMode = function (mode) {
		if (_isValidMode(mode)) {
			chart.options.atviseOptions.mode = mode;
		} else {
			onErrorCallback(30005, mode);
		}
	};

	/**
	 * Returns the current set mode.
	 * @returns {string} The current set mode.
	 * @memberof TrendControl
	 */
	control.getMode = function () {
		if (_isValidMode(chart.options.atviseOptions.mode)) {
			return chart.options.atviseOptions.mode;
		} else {
			onErrorCallback(30004, chart.options.atviseOptions.mode);
			return undefined;
		}
	};


	/**
	 * set parameter for exports
	 * @param options
	 */
	control.setExportOptions = function (options) {
		/* disable downsample */
		_internal.disableDownSampling = options.atviseOptions.disableDownSampling;
		options.atviseOptions.disableDownSampling = true;

		/* check if plot option for series exists */
		if (typeof options.plotOptions["series"] == "undefined")
			options.plotOptions["series"] = {};

		/* set boostThreshold for series  */
		if (typeof options.plotOptions["series"]["boostThreshold"] != "undefined")
			_internal.boostThreshold = options.plotOptions["series"]["boostThreshold"];
		options.plotOptions["series"]["boostThreshold"] = 100000;

		/* set turboThreshold for series  */
		if (typeof options.plotOptions["series"]["turboThreshold"] != "undefined")
			_internal.turboThreshold = options.plotOptions["series"]["turboThreshold"];
		options.plotOptions["series"]["turboThreshold"] = 100000;
	}


	/**
	 * restore parameter after export
	 * @param options
	 */
	control.unsetExportOptions = function (options) {
		/* restore downsample */
		options.atviseOptions.disableDownSampling = _internal.disableDownSampling;

		/* restore boostThreshold for series  */
		options.plotOptions["series"]["boostThreshold"] = 5000;
		if (typeof _internal.boostThreshold != "undefined")
			options.plotOptions["series"]["boostThreshold"] = _internal.boostThreshold;

		/* restore boostThreshold for series  */
		options.plotOptions["series"]["turboThreshold"] = 5000;
		if (typeof _internal.turboThreshold != "undefined")
			options.plotOptions["series"]["turboThreshold"] = _internal.turboThreshold;
	}


	/**
	 * return history loading state
	 */
	control.getLoadingState = function () {
		return _getLoadingState();
	}

	/**
	 * return history loading state
	 */
	function _getLoadingState() {
		return historyIsLoading;
	}

	/**
	 * set history loading state
	 */
	function _setLoadingState(active) {
		renderer.historyIsLoading = active;
		historyIsLoading = active;
	}



	/**
	 * Triggers the "OnUpdated" callback for all registered callbacks.
	 * @memberof TrendControl
	 * @private
	 */
	function _triggerOnUpdatedCallback() {
		for (var key in TrendControl._registeredOnUpdatedCallbacks) {
			if (TrendControl._registeredOnUpdatedCallbacks[key]) {
				TrendControl._registeredOnUpdatedCallbacks[key](chart);
			}
		}
	}

	/**
	 * Set *series.id* for every series, if not set.
	 * @memberof TrendControl
	 * @private
	 */
	function _setSeriesIds() {
		for (var i = 0; i < chart.series.length; i++) {
			var series = chart.series[i];
			if (!series.options.id) {
				// update series with redraw, or last series will not be displayed!
				series.update({id: "series-" + Date.now()}, true);
			}
		}
	}

	/**
	 * Helper function to load the history used in mixed mode for a given *series*, or all series, if *series* not set.
	 * @param {series} [series] Draw history for this series. If not set, data for all series is loaded and drawn.
	 * @param {bool} loadTimeSpan If set to *true*, the data between now minus time span and now will be loaded.
	 * If set to *false*, the data between min and max of the x axis will be loaded.
	 * @memberof TrendControl
	 * @private
	 */
	function _loadHistoryForMixedMode(series, loadTimeSpan) {
		//if live mode is running or loadTimeSpan is set, load data between now minus time span and now.
		//Can't use extremes.min and extremes.max here, because they may be not set (e.g. on first start of the mixed mode)
		//or be set wrong. (e.g. on restart of the mixed mode they are set to the stopped highchart)
		if (isLiveModeRunning || loadTimeSpan) {
			if (isNaN(chart.xAxis[0].options.timeSpan) || isNaN(chart.xAxis[0].options.timeSpanUnit)) {
				onErrorCallback(20105);
				return;
			}
			var until = (new Date()).valueOf();
			var from = until - chart.xAxis[0].options.timeSpan * chart.xAxis[0].options.timeSpanUnit * 1000;
			_setLoadingState(true);
			utils.showLoading(utils.getOptions().loadingMessage);
			renderer.drawHistory(from, until, onHistoryLoadedCallback, series);
			//Mixed mode: live mode is stopped, therefore load data between highchart's x axis min and max.
		} else if (chart.xAxis[0].getExtremes()) {
			var extremes = chart.xAxis[0].getExtremes();
			_setLoadingState(true);
			utils.showLoading(utils.getOptions().loadingMessage);
			renderer.drawHistory(extremes.min, extremes.max, onHistoryLoadedCallback, series);
		}
	}

	/**
	 * Copies the current config from *chart.options.atviseOptions*, *series.options* and *xAxis[0].options* to a new object and return it.
	 * @returns {object} Object with relevant settings from the highcharts object deep copied.
	 * @memberof TrendControl
	 * @private
	 */
	function _copyConfig() {
		var newConfig = {};
		newConfig.options = {};
		if (chart.options.atviseOptions) {
			newConfig.options.atviseOptions = {};
			newConfig.options.atviseOptions.source = chart.options.atviseOptions.source;
			newConfig.options.atviseOptions.mode = chart.options.atviseOptions.mode;
			newConfig.options.atviseOptions.enableCursor1 = chart.options.atviseOptions.enableCursor1;
			newConfig.options.atviseOptions.enableCursor2 = chart.options.atviseOptions.enableCursor2;
			newConfig.options.atviseOptions.disableDownSampling = chart.options.atviseOptions.disableDownSampling;
		}
		newConfig.xAxis = {};
		newConfig.xAxis.options = {};
		newConfig.xAxis.options.min = chart.xAxis[0].options.min;
		newConfig.xAxis.options.max = chart.xAxis[0].options.max;
		newConfig.xAxis.options.timeSpan = chart.xAxis[0].options.timeSpan;
		newConfig.xAxis.options.timeSpanUnit = chart.xAxis[0].options.timeSpanUnit;
		newConfig.series = {};
		for (var i = 0; i < chart.series.length; i++) {
			var series = chart.series[i];
			var key = series.options.id;
			newConfig.series[key] = {};
			newConfig.series[key].options = {};
			newConfig.series[key].options.type = chart.series[i].options.type;
			newConfig.series[key].options.address = chart.series[i].options.address;
			newConfig.series[key].options.address2 = chart.series[i].options.address2;
			newConfig.series[key].options.visible = chart.series[i].options.visible;
		}
		return newConfig;
	}

	/**
	 * Returns true, if *xAxis.options.min*, *xAxis.options.max* or *xAxis.options.timeSpan* is different between
	 * the saved copy of the config and the current config.
	 * @returns {boolean} True, if the xAxis has been changed since the last call of updated, and false if not.
	 * @memberof TrendControl
	 * @private
	 */
	function _xAxisChanged() {				
		return oldConfig.xAxis.options.min !== chart.xAxis[0].options.min ||
			oldConfig.xAxis.options.max !== chart.xAxis[0].options.max ||
			oldConfig.xAxis.options.timeSpan !== chart.xAxis[0].options.timeSpan ||
			oldConfig.xAxis.options.timeSpanUnit !== chart.xAxis[0].options.timeSpanUnit;
	}

	/**
	 * Returns true, if the given series's *address*, *address2*, *aggregate* or *aggregate2* is different between
	 * the saved copy of the config and the current config.
	 * @returns {boolean} True, if the series has been changed since the last call of updated, and false if not.
	 * @memberof TrendControl
	 * @private
	 */
	function _seriesChanged(series) {
		var key = series.options.id;
		//if this series is not in old config, series is new -> series has changed
		if (!oldConfig.series[key])
			return true;

		var addressesChanged = oldConfig.series[key].options.address !== series.options.address ||
			oldConfig.series[key].options.address2 !== series.options.address2;

		var aggregateOptionsChanged = !_aggregateOptionsEqual(oldConfig.series[key].options.aggregate, series.options.aggregate) ||
			!_aggregateOptionsEqual(oldConfig.series[key].options.aggregate2, series.options.aggregate2);

		var visibleOptionsChanged = series.options.visible && oldConfig.series[key].options.visible !== series.options.visible;

		
		return addressesChanged || aggregateOptionsChanged || visibleOptionsChanged;
	}

	/**
	 * Compares two given objects of aggregateOptions and returns true, if they are equal.
	 * @param {object} aggregateOptions1 An aggregate objects object with aggregate, interval and unit.
	 * @param {object} aggregateOptions2 An aggregate objects object with aggregate, interval and unit.
	 * @returns {boolean} True, if both aggregateOptions objects are equal and false, if not.
	 * @memberof TrendControl
	 * @private
	 */
	function _aggregateOptionsEqual(aggregateOptions1, aggregateOptions2) {
		if (!aggregateOptions1 && !aggregateOptions2) return true;   //if both empty
		if (!aggregateOptions1 || !aggregateOptions2) return false;	//if one empty
		return aggregateOptions1.aggregate === aggregateOptions2.aggregate || //if both set
			aggregateOptions1.interval === aggregateOptions2.interval ||
			aggregateOptions1.unit === aggregateOptions2.unit;
	}

	/**If you switch from a line series type like line or area (their points look like this: [x, y]) to a range type
	 * like "arearange" or "areasplinerange" (their points look like this: [x, low, high]), highcharts raise an error
	 * because of the missing high value. Therefore, clear the series data before switching from a line type to a range type.
	 * Changes from range type to line type or line to line or range to range are possible without data clearing.
	 * @memberof TrendControl
	 * @private
	 */
	function _handleSeriesTypeChangedToArea() {
		for (var i = 0; i < chart.series.length; i++) {
			var key = chart.series[i].options.id;
			var oldType = oldConfig.series[key] ? oldConfig.series[key].options.type : "line";
			var newType = chart.series[i].options.type;
			if ((newType == "arearange" || newType == "areasplinerange" || newType == "columnrange") &&
				(oldType == "area" || oldType == "spline" || oldType == "line" || oldType == "splinearea" || oldType == "column")) {
				renderer.deleteSeriesData(chart.series[i]);
			}
		}
	}

	/**
	 * Show or hide measuring cursor 1 and measuring cursor 2, depending on *chart.options.atviseOptions.enableCursor1* and *chart.options.atviseOptions.enableCursor2*.
	 * @memberof TrendControl
	 * @private
	 */
	function _showOrHideMeasuringCursors() {
		var config_changed = false;
		if (oldConfig.options.atviseOptions.configName != chart.options.atviseOptions.configName)
			config_changed = true;
		if (oldConfig.options.atviseOptions.configNode != chart.options.atviseOptions.configNode)
			config_changed = true;

		if (config_changed || (oldConfig.options.atviseOptions.enableCursor1 != chart.options.atviseOptions.enableCursor1)) {
			if (chart.options.atviseOptions.enableCursor1) {
				renderer.showMeasuringCursor1();
			} else {
				renderer.hideMeasuringCursor1();
			}
			oldConfig.options.atviseOptions.enableCursor1 = chart.options.atviseOptions.enableCursor1;
		}
		if (config_changed || (oldConfig.options.atviseOptions.enableCursor2 != chart.options.atviseOptions.enableCursor2)) {
			if (chart.options.atviseOptions.enableCursor2) {
				renderer.showMeasuringCursor2();
			} else {
				renderer.hideMeasuringCursor2();
			}
			oldConfig.options.atviseOptions.enableCursor2 = chart.options.atviseOptions.enableCursor2;
		}
	}

	/**
	 * Returns true, if the given mode is "live", "history" or "mixed".
	 * @param {string} mode A string
	 * @returns {boolean} True, if a valid mode, and false, if not.
	 * @memberof TrendControl
	 * @private
	 */
	function _isValidMode(mode) {
		return mode == 'live' || mode == 'history' || mode == 'mixed';
	}

	/**
	 * Stops live mode if *document.hidden* (e.g. if tab in the background) and start if again, if window is visible
	 * @memberof TrendControl
	 */
	function _handleVisibilityChange() {
		if (document.hidden && isLiveModeRunning) {
			control.stopLiveMode();
			for (var i = 0; i < chart.series.length; i++) {
				var currentSeries = chart.series[i];
				var lastDataPoint = currentSeries.data[currentSeries.data.length - 1];

				if (typeof lastDataPoint != "undefined") {
					var isNonStopPoint = lastDataPoint.id && lastDataPoint.id.indexOf('NonStopPoint') !== -1;
					if (isNonStopPoint) lastDataPoint = currentSeries.data[currentSeries.data.length - 2];
					var nextX = lastDataPoint.x + 1;
					if (!currentSeries.options.connectNulls) currentSeries.addPoint([nextX, null]);
				}
			}
			isLiveModePaused = true;
		} else if (isLiveModePaused) {
			control.startLiveMode();
			isLiveModePaused = false;
		}
	}

	/**
	 * This callback is called after the data of the load history method has been loaded.
	 * It hides the loading animation and shows or hides the measuring cursors.
	 * Showing the measuring cursors need loaded data, therefore this is done here.
	 * @callback onHistoryLoadedCallback
	 * @memberof TrendControl
	 */
	function onHistoryLoadedCallback() {
		utils.hideLoading();
		_showOrHideMeasuringCursors();
		setTimeout(function () {
			if (renderer) renderer.forceMeasuringCallbacks();
			_setLoadingState(false);
		}, 100);
	}

	/**
	 * This callback is called if an error occurs. It shows a notification (can be cleared by the user) or an error (text
	 * on the chart, user has to reload the page to remove the error).
	 * @param {number} errorId An error id, must match with the errorMessages / notficationMessages of untils.js.
	 * If errorId > 30000, it is an error, otherwise it is a notification.
	 * @param {string} info An additional text that is appended to the errorMessage / notficationMessage.
	 * @callback onErrorCallback
	 * @memberof TrendControl
	 */
	function onErrorCallback(errorId, info) {
		if (errorId >= 30000) {
			utils.reportError(errorId, info);
		} else {
			utils.reportNotification(errorId, info);
		}
	}
};

/**
 * Private static member to store all current registered "OnUpdated" callbacks.
 * @type {Array}
 * @private
 */
TrendControl._registeredOnUpdatedCallbacks = [];