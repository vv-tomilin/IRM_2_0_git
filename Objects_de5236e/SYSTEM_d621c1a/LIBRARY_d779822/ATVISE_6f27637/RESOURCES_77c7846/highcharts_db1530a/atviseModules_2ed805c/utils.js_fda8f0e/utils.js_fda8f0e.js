'use strict'

var options = {
	loadingMessage: "Loading historical data...",
	errorMessages: {
		30002: "First parameter of registerOnUpdatedCallback must be an valid callback function.",
		30003: "First parameter of unregisterOnUpdatedCallback must be an valid callback id.",
		30004: "Not a valid mode set. chart.options.mode =",
		30005: "Called control.setMode() with invalid mode. control.setMode =",
		30006: "Value for update interval must be equal to or greater than 1 ms. update interval =",
		30101: "xAxis.options.min not set or not a number. options.min =",
		30102: "xAxis.options.max not set or not a number. options.max =",
	},
	notificationMessages: {
		10000: "Live mode already started",
		10001: "Live mode not started",
		10002: "Live mode is not possible when active mode is: ",
		20100: "Series type not supported. Series type =",
		20103: "Datasource error:",
		20104: "Load data into chart before adding a measuring cursor",
		20105: "The time span on the x axis must be set for live mode and mixed mode",
	},
	highchartsErrorMessages: {
		14: "String value sent to series.data, expected Number",
		15: "Highcharts expects data to be sorted",
		28: "Fallback to export server disabled",
	},
	loading: {
		loadingBarWidth: 100,
		loadingBarColor: '#0073f4',
		loadingCircle: [
			'<img style="margin-top: 8px" src="data:image/gif;base64,',
			'R0lGODlhIAAgAPMAAP///wAAAMbGxoSEhLa2tpqamjY2NlZWVtjY2OTk5Ly8vB4eHgQEBAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBham' +
			'F4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT' +
			'4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh1' +
			'2BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APd' +
			'pB309RnHOG5gDqXGLDaC457D1zZ/V/ nmOM82XiHRLYKhKP1oZmADdEAAAh+QQACgABACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDU' +
			'olIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY /CZSg7GSE0gSCjQBMVG023xWBhklAn' +
			'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',
			'" />'
		],
		loadingBar: [
			'<div style="display: inline-block; width: ',
			'loadingBarWidth',
			'px; margin-top: 22px; border: 1px solid gray; border-radius: 3px; overflow: hidden;">',
			'<div style="height: 4px; width: ',
			'indicatorWidth',
			'px; background-color: ',
			'loadingBarColor',
			'"/>'
		]
	},
	notification: {
		config: {
			exporting: {
				buttons: {
					notificationButton: {
						_titleKey: "contextButtonTitle",
						text: "Notifications",
						symbolUrl: "/highcharts/icons/alarm.svg",
						symbolSize: 20,
						symbolX: 22,
						symbolY: 20,
						enabled: false
					}
				}
			}
		}
	}
};

/**
 * This class provides helper functions for the trendControl. It shows errors, notifications and a loading animation.
 * @param {object} chart The instance of the chart the utils are used for.
 * @class
 */
function Utils(chart) {
	this.chart = chart;
	this.chart.highchartsErrors = {};
	options.notification.config.exporting.buttons.notificationButton.onclick = this._notificationButtonClickHandler.bind(this);
	var languageName = "";
	for (var language in project.languages) {
		languageName = language;
		break;
	}
	options.notification.config.exporting.buttons.notificationButton.symbol = "url(" + languageName + options.notification.config.exporting.buttons.notificationButton.symbolUrl + ")";
	this.chart.update(options.notification.config, false); // *** dnu ***
	this._loadRelatedCSS();
	this._initializeNotificationTable();
	this._initializeCloseButton();
	webMI.data.loadScript("other/atvise.iscroll.js", this._initScrollbars.bind(this));
}

/**
 * Show the error message for a specific errorID id to the user. Displayed in the middle of the drawing-area.
 * @param {number} errorID The errorID to show the corresponding message for.
 * @param {string} additionalInformation Text that is attached to the notification message.
 */
Utils.prototype.reportError = function (errorID, additionalInformation) {
	additionalInformation = typeof additionalInformation != "undefined" ? ": " + additionalInformation : "";
	additionalInformation = webMI.escapeHTML(additionalInformation);

	this.chart.showLoading(
		['<strong style="color: red;">',
			options.errorMessages[errorID] + additionalInformation,
			'</strong><br />'
		].join(''));

	this.errorSet = true;
};

/**
 * Add the notification message for a specific notificationID id to the notification window.
 * @param {number} notificationID The notificationID to show the corresponding message for.
 * @param {string} additionalInformation Text that is attached to the notification message.
 */
Utils.prototype.reportNotification = function (notificationID, additionalInformation, isHighchartsError) {
	if(typeof this.chart == "undefined" || typeof this.chart.highchartsErrors == "undefined")
		return;
	
	if (isHighchartsError) {
		if (typeof this.chart.highchartsErrors[notificationID] == "undefined") {
			additionalInformation = (typeof options.highchartsErrorMessages[notificationID] != "undefined") ? "Highcharts error #" + notificationID + ": " + options.highchartsErrorMessages[notificationID] : "Highcharts error #" + notificationID;
			this.chart.highchartsErrors[notificationID] = true;
		} else {
			return;
		}
	}

	var notificationMessage = options.notificationMessages[notificationID] ? options.notificationMessages[notificationID] : "";
	
	this._showNotificationButton();
	additionalInformation = (typeof additionalInformation != "undefined") ? additionalInformation : "";
	this._addNotification(notificationMessage + additionalInformation);
	this._updateScroller();
};


/**
 * Show a loading sign to the user. This method usually displays a turning circle. If the parameter progress is specified a progressbar is shown.
 * @param {string} text A string that is displayed together with the loading animation.
 * @param {number} progress The loading progress that should be shown in the progressBar. Can be in the range from [0 ... 1].
 */
Utils.prototype.showLoading = function (text, progress) {
	if(this.errorSet){
		return;
	}

	text = webMI.escapeHTML(text);

	var html = "";
	if (progress) {
		var indicatorWidth = (progress * options.loading.loadingBarWidth).toFixed(0);
		//set bar color
		options.loading.loadingBar[6] = options.loading.loadingBarColor;
		//set bar width
		options.loading.loadingBar[1] = options.loading.loadingBarWidth;
		//set indicator width
		options.loading.loadingBar[4] = indicatorWidth;
		html = options.loading.loadingBar.join('');
	} else {
		html = options.loading.loadingCircle.join('');
	}

	if (text) {
		html = [text, '<br />', html].join('');
	}

	this.chart.showLoading(html);

};

/**
 * Hide the loading animation.
 */
Utils.prototype.hideLoading = function () {
	if(this.errorSet){
		return;
	}
	this.chart.hideLoading();
};


/**
 * Get the readonly options.
 */
Utils.prototype.getOptions = function () {
	return options;
};

/**
 * Remove events and set objects to null.
 */
Utils.prototype.destroy = function () {
	var self = this;
	this.scroller.destroy();
	this.scroller = null;
	this.closeButton.addEventListener("click", this.boundFunctions._closeButtonClickHandler);
	this.closeButton.addEventListener("touchstart", this.boundFunctions._closeButtonClickHandler);
	this.boundFunctions = null;
	this.chart = null;
	this.header = null;
	this.scrollContainer = null;
	this.tableContainer = null;
	this.tableElement = null;
	this.closeButton = null;
	self = null;
};

Utils.prototype.resetErrors = function () {
	this.errorSet = false;
};

/**
 * Callback function for the notification button.
 * @private
 */
Utils.prototype._notificationButtonClickHandler = function () {
	var notificationContainer = Highcharts.charts[Highcharts.hoverChartIndex].renderTo.children.namedItem('notificationContainer' + Highcharts.hoverChartIndex);
	notificationContainer.style.display = "block";
	this._updateScroller();
};

/**
 * Callback function for the close button of the notification window.
 * @private
 */
Utils.prototype._closeButtonClickHandler = function () {
	this.notificationContainer.style.display = "none";
	this._clearNotifications();
	this._hideNotificationButton();
};

/**
 * Shows the notification button on the chart.
 * @private
 */
Utils.prototype._showNotificationButton = function () {
	options.notification.config.exporting.buttons.notificationButton.enabled = true;
	this.chart.update(options.notification.config, true);
};

/**
 * Hides the notification button on the chart.
 * @private
 */
Utils.prototype._hideNotificationButton = function () {
	options.notification.config.exporting.buttons.notificationButton.enabled = false;
	this.chart.update(options.notification.config, true);
};

/**
 * Appends all for the notification window necessary elements to the DOM.
 * @private
 */
Utils.prototype._initializeNotificationTable = function () {
	var chartContainer = this.chart.renderTo;
	this.notificationContainer = document.createElement("div");
	this.notificationContainer.id = "notificationContainer" + this.chart.index;
	this.header = document.createElement("div");
	this.scrollContainer = document.createElement("div");
	this.tableContainer = document.createElement("div");
	this.tableElement = document.createElement("table");
	this.tableElement.id = "tableElement" + this.chart.index;

	this.notificationContainer.classList.add("notificationContainer");
	this.header.classList.add("header");
	this.scrollContainer.classList.add("scrollContainer");
	this.tableContainer.classList.add("tableContainer");
	this.tableElement.classList.add("notificationTable");

	this.scrollContainer.appendChild(this.tableContainer);
	this.tableContainer.appendChild(this.tableElement);
	this.notificationContainer.appendChild(this.header);
	this.notificationContainer.appendChild(this.scrollContainer);
	chartContainer.appendChild(this.notificationContainer);
};

/**
 * Appends all for the notification window-close button necessary elements to the DOM.
 * @private
 */
Utils.prototype._initializeCloseButton = function () {
	this.closeButton = document.createElement("button");
	this.closeButton.classList.add("closeButton");
	this.closeButton.innerHTML = "x";
	this.header.appendChild(this.closeButton);

	this.boundFunctions = {};
	this.boundFunctions._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
	this.closeButton.addEventListener("click", this.boundFunctions._closeButtonClickHandler);
	this.closeButton.addEventListener("touchstart", this.boundFunctions._closeButtonClickHandler);
};

/**
 * Add a notification to the notification window.
 * @param messageText The text of the notification.
 * @private
 */
Utils.prototype._addNotification = function (messageText) {
	for (var i = 0; i < this.chart.renderTo.children.length; i++) {
		if (this.chart.renderTo.children[i].id.indexOf('notificationContainer') == 0)
			var notificationContainer = this.chart.renderTo.children[i];
	}
	var tableContainer = notificationContainer.getElementsByClassName('tableContainer')[0];
	var tableElement = tableContainer.getElementsByTagName('table')[0];
	var tableRow = tableElement.insertRow();
	var tableCell = tableRow.insertCell();
	var securedMessageText = webMI.secureString(messageText);
	tableCell.innerHTML = securedMessageText;
};

/**
 * Removes all notifications from the notification window.
 * @private
 */
Utils.prototype._clearNotifications = function () {
	if (typeof this.tableElement.childNodes[0] == "undefined")
		return;

	this.chart.highchartsErrors = {};
	while (this.tableElement.childNodes[0].childNodes.length > 0) {
		this.tableElement.deleteRow(0);
	}
};

/**
 * Initializes the scrollbar. (IScroll)
 * @private
 */
Utils.prototype._initScrollbars = function () {
	this.scroller = new window.IScroll(this.tableContainer, {
		preventDefault: true,
		useTransform: true,
		useTransition: false,
		mouseWheel: true,
		scrollbars: true,
		bounce: false,
		mouseWheelSpeed: 1,
		disablePointer: true,
		disableMouse: false,
		disableTouch: false,
		momentum: true,
		scrollX: true,
		scrollY: true,
		tap: false,
		bindToWrapper: true,
		interactiveScrollbars: true,
		HWCompositing: false
	});
};

/**
 * Performs an update on the scrollbar when content has changed.
 * @private
 */
Utils.prototype._updateScroller = function () {
	var self = this;
	window.setTimeout(function () {
		if (self.scroller) {
			self.scroller.refresh();
		}
	}, 0);
};

/**
 * Load the css for the notification window.
 * @private
 */
Utils.prototype._loadRelatedCSS = function () {
	var fileref = document.createElement("link");
	fileref.rel = "stylesheet";
	fileref.id = "utilsStyle";
	fileref.type = "text/css";
	fileref.href = "/highcharts/atviseModules/utils.css";
	document.getElementsByTagName("head")[0].appendChild(fileref);
};
