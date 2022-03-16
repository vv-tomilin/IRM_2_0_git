/*###################______________HISTORY________MODE_________________##########################################*/
var myChart_conf_history = {
	chart:{
		animation: false,	             
		zoomType: 'xy',
		spacingTop: 20,
		spacingBottom: 40,
		spacingRight: 20,
		spacingLeft: 20,
		inverted: true,
		styledMode: true,
		height: '1015',
		width: '1850',
		},
		
		subtitle: {
			text: 'Исторические данные'
			},
	
	navigator: {
		adaptToUpdatedData: true,
		enabled:true, 			
			},		  
    rangeSelector: {
		enabled: true,
        selected: 4, 
        buttons: [
        
        {
            count: 5,
            type: 'minute',
            text: '5M'
        }, 
        {
            count: 30,
            type: 'minute',
            text: '30M'
        },
        {
            count: 1,
            type: 'hour',
            text: '1H'
        },
        {
            count: 12,
            type: 'hour',
            text: '12H'
        },
         {
            count: 1,
            type: 'day',
            text: '1Д'
        },
        {
            count: 3,
            type: 'day',
            text: '3Д'
        },
        {
            type: 'all',
            text: 'All'
        }],
		inputEnabled: true,	
		inputDateFormat: '%b %e, %Y %H:%M',
		verticalAlign: "bottom",
				
    },
   
	xAxis: [{
		type: 'datetime',
		minorTickInterval: 'auto',
		tickPixelInterval: 50,
		opposite: true,
		labels: {
			//format: '{value:%H:%M:%S}',
			rotation: 90,
		},		
		crosshair: {
			snap: false,					
		},
		showLastLabel: true,	
	}],
	
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
                showInNavigator: true,   
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
