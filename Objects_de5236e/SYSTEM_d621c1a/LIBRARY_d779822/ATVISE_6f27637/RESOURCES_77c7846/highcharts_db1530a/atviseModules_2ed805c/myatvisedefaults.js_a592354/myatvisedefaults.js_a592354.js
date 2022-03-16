/*Set options for Highcharts globally*/

var atviseDefaults = {

	global: {
		useUTC: false
	},
	boost: {
		enabled: true
	},
	plotOptions: {
		//series: { turboThreshold: 0 },
		line: {
			type: 'line'
		}
	},
	title: {
		text: ''
	},
	subtitle: {
		text: ''
	},
	/*The highcharts-objectdisplay is overwriting the predefined atviseOptions */
	atviseOptions: {
		mode: 'mixed',
		source: 'atvise',
		liveModeFrameRate: 20 // [1 ... 60]fps
	},
	legend: {
		enabled: false
	},
	credits: {
		enabled: false

	},
	chart: {
//mycorrection start
/*		backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: 1
                    },
                    stops: [[0, "rgb(48, 48, 96)"], [1, "rgb(0, 0, 0)"]]
                },
*/
		//height:'80%',
		margin: [20, 0, 20, 48],
		backgroundColor: "#0A222E",//"#010406",//"#0A222E",
        borderColor: "#0A222E",//"#010406",//"#0A222E", //"#000000"
        borderWidth: 2,
        className: "dark-container",
        plotBackgroundColor: "rgba(255, 255, 255, .1)",
        plotBorderColor: "#CCCCCC",
        plotBorderWidth: 1,
//mycorrection stop
		inverted: false, //true, //mycorrection
		alignTicks: false,
		events: {
			redraw: function() { try { this._setRedrawComplete(); } catch(ex) { }}
		},
		panning: false,
//		panKey: 'shift',
		style: {
			fontFamily: "Arial"
		},
		zoomType: 'x'
    },
	/* Highcharts default is to generate documents on a highcharts server. this requires an internet connection	    */
	/* -- fallbackToExportServer: true, this will allow the fallback to the highchart server        			    */
	/*							  false, this will prevent the connection									        */
	/* -- libURL: some browser can use local libraries to generate the documents (firefox and chrome)               */
	/*            these browser will have a look at these path (default: /highcharts/lib/)						    */
	/* please note: the list of current browsers supporting highchart exports can be requested through our support. */
	exporting: {
		enabled:false,
                buttons: {
			contextButton: {
				width: 28,
				height: 28,
				symbolSize: 23
			}
		},
		fallbackToExportServer: false,
		libURL: "/highcharts/lib/"
	},
	tooltip: {
//mycorrection start
//		shared: true,
		style: {"fontSize":"14px"},
//mycorrection stop
		followTouchMove: false,
		formatter: function() {
			var dateFormat = '%H:%M:%S.%L';
//mycorrection start
//			if (this.point.id && this.point.id.indexOf("rightNonStopPoint") > -1) {
//				dateFormat = '%H:%M:%S'; //dd/mm/YY
				dateFormat = '%d-%m-%Y %H:%M:%S'; //dd/mm/YY
//			}
//mycorrection stop
			var pointKey= this.point.key ? this.point.key : this.point.x;

			var header = '<span style="font-size: 8px">' + Highcharts.dateFormat(dateFormat, pointKey) + '</span><br/>';

			var prefix = "", suffix = "", value = this.point.y.toFixed(2);//this.point.y; this.point.y.toFixed(2)

			if(this.series.options.tooltip) {
				prefix = this.series.options.tooltip.valuePrefix ? this.series.options.tooltip.valuePrefix : "";
				suffix = this.series.options.tooltip.valueSuffix ? this.series.options.tooltip.valueSuffix : "";
				value = this.series.options.tooltip.valueDecimals ? this.point.y.toFixed(this.series.options.tooltip.valueDecimals): this.point.y;

			}
			var text =  '<span style="color:' + this.series.color +	'">\u25CF</span>' + this.series.name + ': <b>' + prefix + value + suffix + '</b><br/>';
			return header+text;
		}
	},
	xAxis: {
//mycorrection start
//		reversed: true, //mycorrection
		//height: "80%",
		"min":1579672797050,
		"max":1579676397050,
		dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%e %b',
			week: '%e %b',
			month: '%b \'%y',
			year: '%Y'
        },
		gridLineColor: "#333333",
        gridLineWidth: 1,
        labels: {
                    style: {
                        color: "#A0A0A0",
						"fontSize":"8px"
                    }
                },
        lineColor: "#A0A0A0",
        tickColor: "#A0A0A0",
        title: {
                    style: {
                        color: "#CCC",
                        fontWeight: "bold",
                        fontSize: "12px",
                        fontFamily: "Trebuchet MS, Verdana, sans-serif"
                    }
                },
//mycorrection stop
		events: {
			setExtremes: function() { try { this.chart._setExtremesComplete(); } catch(ex) { }}
		},
	},
	yAxis: {
//mycorrection start
				gridLineColor: "#333333",
                
                lineColor: "#A0A0A0",
                minorTickInterval: null,
                tickColor: "#A0A0A0",
                tickWidth: 1,
                
		title: {
			style: {
				"fontSize":"8px",
				color: "#CCC",
                        fontWeight: "bold",
                        fontFamily: "Trebuchet MS, Verdana, sans-serif"
			}
		},
		labels: {
			style: {
				"fontSize":"8px",
				color: "#A0A0A0"}
		},
//		reversed: false, //mycorrection
//		opposite: true, //mycorrection
//mycorrection stop
		autoscale: true,
		endOnTick: false,
//        lineColor: '#CCD6EB',
        lineWidth: 1
	}
};

if (!webMI.getClientInfo().isDesktop) {
	atviseDefaults.navigation = {
		"menuStyle" : { height: "200px", overflow: "auto" }
	};
}