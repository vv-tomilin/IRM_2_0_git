var addressList = [		["AGENT.OBJECTS.IVE50.Drawworks.WeightOnHook"],  
                        ["AGENT.OBJECTS.IVE50.Drawworks.LoadOnBit"],  
                        ["AGENT.OBJECTS.IVE50.Drawworks.HookPosition"], 
                        ["AGENT.OBJECTS.IVE50.Drawworks.HookSpeed"], 
                        ["AGENT.OBJECTS.IVE50.TDS.TDSTorque"], 
                        ["AGENT.OBJECTS.IVE50.TDS.TDSSpeed"], 
                        ["AGENT.OBJECTS.IVE50.Mud.Pump.PressureManifold"], 
                        ["AGENT.OBJECTS.IVE50.Well.DrillSpeed"], 
                        ["AGENT.OBJECTS.IVE50.Mud.FlowInput"], 
                        ["AGENT.OBJECTS.IVE50.Mud.FlowOutput"],
                       ];
/*###################______________LIVE________MODE_________________##########################################*/
var myChart_conf = {
	chart:{
		animation: false,	             
		zoomType: 'x',
		spacingTop: 20,
		spacingBottom: 40,
		spacingRight: 20,
		spacingLeft: 20,
		inverted: true,
		styledMode: true,
		height: '1015',
		width: '1850',
		backgroundColor: '#213a53',
		events: {
            load: function () {
                // set up the updating of the chart each second
                var series_0_WeightOnHook = this.series[0];
                var series_1_LoadOnBit = this.series[1];
                var series_2_HookPosition = this.series[2];
                var series_3_HookSpeed = this.series[3];
                var series_4_TDSTorque = this.series[4];
                var series_5_TDSSpeed = this.series[5];
                var series_6_PressureManifold = this.series[6];
                var series_7_DrillSpeed = this.series[7];
                var series_8_FlowInput = this.series[8];
                var series_9_FlowOutput = this.series[9];
                var myInterval = setInterval(function () {
                    var x = (new Date()).getTime(); // current time
	webMI.data.read(addressList, function(e) {
	//console.log(e)
	if(e[0].value < 0 || !e[0].value){ 
	var y0 = 0
	series_0_WeightOnHook.addPoint([e[0].timestamp, y0]);
	} else {
	series_0_WeightOnHook.addPoint([e[0].timestamp, +e[0].value.toFixed(2)]);
	};
	
	if(e[1].value < 0 || !e[1].value ){ 
	var y1 = 0
	series_1_LoadOnBit.addPoint([e[1].timestamp, y1]);
	} else {
	series_1_LoadOnBit.addPoint([e[1].timestamp, +e[1].value.toFixed(2)]);
	};
	
	if(e[2].value < 0 || !e[2].value){ 
	var y2 = 0
	series_2_HookPosition.addPoint([e[2].timestamp, y2]);
	} else {
	series_2_HookPosition.addPoint([e[2].timestamp, +e[2].value.toFixed(2)]);
	};
		
	
	if(e[3].value < 0 || !e[3].value){ 
	var y3 = 0
	series_3_HookSpeed.addPoint([e[3].timestamp, y3]);
	} else {
	series_3_HookSpeed.addPoint([e[3].timestamp, +e[3].value.toFixed(2)]);
	};
	
	if(e[4].value < 0 || !e[4].value){ 
	var y4 = 0
	series_4_TDSTorque.addPoint([e[4].timestamp, y4]);
	} else {
	series_4_TDSTorque.addPoint([e[4].timestamp, +e[4].value.toFixed(2)]);
	};
	
	if(e[5].value < 0 || !e[5].value){ 
	var y5 = 0
	series_5_TDSSpeed.addPoint([e[5].timestamp, y5]);
	} else {
	series_5_TDSSpeed.addPoint([e[5].timestamp, +e[5].value.toFixed(2)]);
	};
	
	if(e[6].value < 0 || !e[6].value){ 
	var y6 = 0
	series_6_PressureManifold.addPoint([e[6].timestamp, y6]);
	} else {
	series_6_PressureManifold.addPoint([e[6].timestamp, +e[6].value.toFixed(2)]);
	};
	
	if(e[7].value < 0 || !e[7].value){ 
	var y7 = 0
	series_7_DrillSpeed.addPoint([e[7].timestamp, y7]);
	} else {
	series_7_DrillSpeed.addPoint([e[7].timestamp, +e[7].value.toFixed(2)]);
	};
	
	if(e[8].value < 0 || !e[8].value){ 
	var y8 = 0
	series_8_FlowInput.addPoint([e[8].timestamp, y8]);
	} else {
	series_8_FlowInput.addPoint([e[8].timestamp, +e[8].value.toFixed(2)]);
	};
	
	if(e[9].value < 0 || !e[9].value){ 
	var y9 = 0
	series_9_FlowOutput.addPoint([e[9].timestamp, y9]);
	} else {
	series_9_FlowOutput.addPoint([e[9].timestamp, +e[9].value.toFixed(2)]);
	};
	
	/*
	series_0_WeightOnHook.addPoint([e[0].timestamp, +e[0].value.toFixed(2)], false, true);
	series_1_LoadOnBit.addPoint([e[1].timestamp, +e[1].value.toFixed(2)], false, true);
	series_2_HookPosition.addPoint([e[2].timestamp, +e[2].value.toFixed(2)], false, true);
	series_3_HookSpeed.addPoint([e[3].timestamp, +e[3].value.toFixed(2)], false, true);
	series_4_TDSTorque.addPoint([e[4].timestamp, +e[4].value.toFixed(2)], false, true);
	series_5_TDSSpeed.addPoint([e[5].timestamp, +e[5].value.toFixed(2)], false, true);
	series_6_PressureManifold.addPoint([e[6].timestamp, +e[6].value.toFixed(2)], false, true);
	series_7_DrillSpeed.addPoint([e[7].timestamp, +e[7].value.toFixed(2)], false, true);
	series_8_FlowInput.addPoint([e[8].timestamp, +e[8].value.toFixed(2)], false, true);
	series_9_FlowOutput.addPoint([e[9].timestamp, +e[9].value.toFixed(2)], false, true);*/
				
});
                    
                   
                }, 3000);
            }
        }
	},
	 time: {
        useUTC: false
    },
	plotOptions: {
		series: {			
			turboThreshold: 600000,
			connectNulls: true,
			dataGrouping: {
				enabled: true
				}
			},        
	},
	navigator: {
		adaptToUpdatedData: true,
		enabled:false,  			
			},		  
    rangeSelector: {
		enabled: false,
    },
    scrollbar: {
		enabled: false,    
    },
    subtitle: {
			text: 'Живые данные'
			},

	xAxis: [{
			type: 'datetime',
			//tickPixelInterval: 200,
			//minTickInterval: 60000,
			//range: 2*60000,
			min:  Date.now() - 10*60*1000,
			max: Date.now(),
			ordinal: false,
			opposite: true,									
                labels: {
                    format: '{value:%H:%M}',
                    rotation: 90,
                },
                crosshair: {
                    label: {
                        enabled: true,					
                        format: '{value:%b %e, %Y %H:%M:%S}',				                        			                   					
                        },
                    snap: false,					
                },
            }],
        
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
		},
 
    series: [
    //####################################################################################### series[0]	Вес на крюке         
            {
                name: 'Вес на крюке',
                className: 'highcharts-WeightOnHook',
                type: 'spline',                      
                data: [],
                yAxis: 0,
                showInNavigator: false,   
                marker: {
                    enabled: false,
                    },
            },
    //####################################################################################### series[1]	Нагрузка на долото
            {
                name: 'Нагрузка на долото',
                className: 'highcharts-LoadOnBit',
                type: 'spline',         
                data: [],        
                yAxis: 5,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
    
            },
    //####################################################################################### series[2]	Положение крюкоблока
            {
                name: 'Положение крюкоблока',
                className: 'highcharts-HookPosition',
                type: 'spline',
                data: [],
                yAxis: 1,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },          
    
            },
    //####################################################################################### series[3]	Скорость крюкоблока
            {
                name: 'Скорость крюкоблока',
                className: 'highcharts-HookSpeed',
                type: 'spline',
                data: [],
                yAxis: 6,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
    
            },
    //####################################################################################### series[4]	Момент на ВСП
            {
                name: 'Момент на ВСП',
                className: 'highcharts-TDSTorque',
                type: 'spline',  
                data: [],
                yAxis: 2,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
    
            },
    //####################################################################################### series[5]	Обороты ВСП
            {
                name: 'Обороты ВСП',
                className: 'highcharts-TDSSpeed',		
                type: 'spline',  
                data: [],
                yAxis: 7,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
    
            },
    //####################################################################################### series[6]	Давление в манифольде
            {
                name: 'Давление в манифольде',
                className: 'highcharts-MudPumpPressureManifold',
                type: 'spline',  
                data: [],
                yAxis: 3,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
    
            },
    //####################################################################################### series[7]	Скорость проходки
            {
                name: 'Скорость проходки',
                className: 'highcharts-DrillSpeed',		//7
                type: 'spline',  
                data: [],
                yAxis:8,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
    
            },
    //####################################################################################### series[8]	Поток на входе
            {
                name: 'Поток на входе',
                className: 'highcharts-FlowInput',
                type: 'spline',  
                data: [],
                yAxis: 4,
                showInNavigator: false,
                marker:{
                    enabled: false,
                    },
            },
    //####################################################################################### series[9]	Поток на выходе
            {			
                name: 'Поток на выходе',
                className: 'highcharts-FlowOutput',
                type: 'spline',
                data: [],
                yAxis: 9,
                showInNavigator: false,     
                marker:{
                    enabled: false,
                    },
            },
],
/***************************************************************************************	Y AXIS	********************************************************************************/
    //##################################################################################################################################################################################        
    //################################################################################################################################################################################## 
    //################################################################################################################################################################################## 
           yAxis: [
    //########################################################################################################################## 0	yAxis	Вес на крюке		
           {				 
            width: '18%',
            left: '0%',
            offset: 40,
            max: 50,
            min: 0,
            title: {
                text: 'Вес на крюке Т.', 
                margin: -15,
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },			
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;					
                            return function() {					
                                    if (visible) {
                                        myChart.series[0].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[0].show();
                                        this.element.element.className.baseVal = "highcharts-WeightOnHook"								
                                    }
                                    visible = !visible;							
                                    }
                        })()
                    },
                    },
            className: 'highcharts-WeightOnHook',
            showLastLabel: true,       
            },  
    
    //############################################################################	1	yAxis	Положение крюкоблока
            {
            width: '18%',   
            left: '20%',
            offset: 40,
            max: 30,
            min: 0,
            
            title: {
                text: "Положение крюкоблока м.",  
                margin: -15,
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"},
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"},
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[2].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[2].show();
                                        this.element.element.className.baseVal = "highcharts-HookPosition"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },
                    }, 
            className: 'highcharts-HookPosition',
            showLastLabel: true,					  
            },
    
    //########################################################################## 2	yAxis	Обороты на ВСП кН.м
            {				
            width: '18%',
            left: '40%',
            offset: 40,
            max: 50,
            min: 0,
            title: {
                text: "Момент на ВСП кН.м",  
                margin: -15,  
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[4].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[4].show();
                                        this.element.element.className.baseVal = "highcharts-TDSTorque"								
                                    }
                                    visible = !visible;							
                                    }
                        })()
                    },
                    },
            className: 'highcharts-TDSTorque',
            showLastLabel: true,
            },
    
    //############################################################################# 3	yAxis	Давление в манифольде
            {
            width: '18%',
            left: '60%',
            offset: 40,
            max: 200,
            min: 0,
            title: {
                text: "Давление в манифольде МПа",  
                margin: -15,
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[6].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[6].show();
                                        this.element.element.className.baseVal = "highcharts-MudPumpPressureManifold"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },   
            },
            className: 'highcharts-MudPumpPressureManifold',
            showLastLabel: true,
            },
    
    //######################################################################### 4	yAxis	Поток на входе
            {
            width: '18%',
            left: '80%',
            offset: 40,
            max: 20,
            min: 0,
            title: {
                text: "Поток на входе",  
                margin: -15,
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[8].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[8].show();
                                        this.element.element.className.baseVal = "highcharts-FlowInput"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    }, 
            },
            className: 'highcharts-FlowInput',
            showLastLabel: true,				
            },
    
    //#########################################__opposite__yAxis____##########################################################
    //
    //################################################################### 5  yAxis	 Нагрузка на долото									
            {						
            width: '18%',
            left: '0%',
            offset: 85,   
            max: 20,
            min: 0,
            title: {
                text: "Нагрузка на долото",
                margin: -12,   
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[1].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[1].show();
                                        this.element.element.className.baseVal = "highcharts-LoadOnBit"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },  
                },
            className: 'highcharts-LoadOnBit',
            showLastLabel: true,
            labels: {		
                overflow:"allow",                          
            },
            },
    
    //############################################################################ 6 	yAxis	Скорость крюкоблока        
            {					
            width: '18%',
            left: '20%',
            offset: 85,
            max: 1,
            min: 0,
          
            title: {
                text: "Скорость крюкоблока", 
                margin: -12, 
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[3].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[3].show();
                                        this.element.element.className.baseVal = "highcharts-HookSpeed"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },  
                },
            className: 'highcharts-HookSpeed',
            showLastLabel: true,
            labels: {
                overflow:"allow",    
            },							  
            },
    
    
    //######################################################################## 7   yAxis    Обороты ВСП 
            {			
            width: '18%',
            left: '40%',
            offset: 85,
            max: 200,
            min: 0,
            title: {
                text: "Обороты ВСП", 
                margin: -12,
                events: {
                                
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[5].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[5].show();
                                        this.element.element.className.baseVal = "highcharts-TDSSpeed"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },   
                },
            className: 'highcharts-TDSSpeed',
            showLastLabel: true,
            labels: {
                overflow:"allow",   
            },
            },
    
    //######################################################################  8  yAxis  Скорость проходки        
            {					
            width: '18%',
            left: '60%',
            offset: 85,		
            max: 80,
            min: 0,
            title: {
                text: "Скорость проходки", 
                margin: -12,
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[7].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[7].show();
                                        this.element.element.className.baseVal = "highcharts-DrillSpeed"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },   
                },
            className: 'highcharts-DrillSpeed',
            showLastLabel: true,
            labels: {
                overflow:"allow",  
            },
            },
    
    //#######################################################################  9 yAxis  Поток на выходе        
            {					
            width: '18%',
            left: '80%',
            offset: 85,
            max: 20,
            min: 0,
            title: { 
                events: {				
                    mouseover: function(){				
                    this.element.element.style.fontWeight = "700"
                    this.element.element.style.cursor = "pointer"
                    },
                    mouseout: function(){				
                    this.element.element.style.fontWeight = ""
                    this.element.element.style.cursor = "default"								
                    },
                    click: (function() {															
                        var visible = true;
                            return function() {					
                                    if (visible) {
                                        myChart.series[9].hide();
                                        this.element.element.className.baseVal = "onmouseclick"							
                                    } else {
                                        myChart.series[9].show();
                                        this.element.element.className.baseVal = "highcharts-FlowOutput"								
                                    }
                                    visible = !visible;							
                                    }
                        })()				
                    },   
            text: "Поток на выходе", 
            margin: -12,},
            className: 'highcharts-FlowOutput',
            showLastLabel: true,
            labels: {
                overflow:"allow",  
            },				
            },				
         ],
}
