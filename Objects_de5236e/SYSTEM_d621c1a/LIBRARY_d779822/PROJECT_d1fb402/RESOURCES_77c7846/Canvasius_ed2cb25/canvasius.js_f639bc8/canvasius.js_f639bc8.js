function tClosure() {
  var isAvailable = true

  return function(fn) {
    if (!isAvailable) {
      
      return
    }
    isAvailable = false
    setTimeout(function() {
      isAvailable = true
    }, 20)
    fn()
  }
}
var throttle = tClosure()

function draw(offsets, e) {
  if (!this.drawing) return
  
  var rect = this.canvas.getBoundingClientRect()
  var offsetX = rect.left
  var offsetY = rect.top
  //console.log(rect)
 // var offsetX = offsets.offsetX
  //var offsetY = offsets.offsetY
  
  function render() {
    var scale = this.scale

    try {
      var x = e.clientX
      var y = e.clientY

      this.data[this.data.length - 1].push({ x: (x - offsetX) / scale.x, y: (y - offsetY) / scale.y })
      
      this.ctx.lineTo(x - offsetX - 5, y - offsetY - 5)
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.moveTo(x - offsetX - 5, y - offsetY - 5)
    }
    catch(err) {
		console.log(err)
    }
  }
  throttle(render.bind(this))
}

function Canvasius(root, config) {
  this.drawing = false
  this.root = root
  this.data = []
  this.config = config
  this.editable = config ? config.editable : false
  this.scale = {
	x: config ? (config.width || 100) / 100 : 1,
	y: config ? (config.height || 100) / 100 : 1
  } 

  this.generate(config)
}

Canvasius.prototype.generate = function(config) {
  this.canvas = parent.document.createElement("canvas")
  this.ctx = this.canvas.getContext("2d")
  
  webMI.gfx.setScaledEvents(this.canvas, true)
  
  this.drawing = false
  
  var rect = this.canvas.getBoundingClientRect()
  var offsetX = rect.left
  var offsetY = rect.top
  //console.log(rect)
  
  this.root.innerHTML = ""

  this.canvas.width = config ? config.width || 100 : 100
  this.canvas.height = config ? config.height || 100 : 100
  this.canvas.style.border = "1px solid #000"
  
  this.ctx.strokeStyle = "#000"
  //this.ctx.strokeStyle = "#FFF"
  this.ctx.lineWidth = this.canvas.width / 50
  this.ctx.lineCap = 'round'
  
  function startDrawing(e) {
	//console.log("start")
    this.drawing = true
    //console.log(this)
    this.data.push([])
    this.ctx.beginPath()
    draw.call(this, { offsetX: offsetX, offsetY: offsetY }, e)
  }

  function endDrawing() {
    this.drawing = false
    this.ctx.beginPath()
  }

  if (this.editable) {
    this.canvas.addEventListener("mousedown", startDrawing.bind(this))
    this.canvas.addEventListener("mouseup", endDrawing.bind(this))
    this.canvas.addEventListener("mousemove", draw.bind(this, { offsetX: offsetX, offsetY: offsetY }))
    this.canvas.addEventListener("mouseleave", function() {
		setTimeout(function() { endDrawing.call(this) }.bind(this), 20)
    }.bind(this))
  } else {
    config ? !config.editable ? this.canvas.title = this.config.tooltip || ""  : "" : ""
  }
  
  this.root.appendChild(this.canvas)
}

Canvasius.prototype.reset = function() {
  this.data = []
  this.generate({ width: this.config.width, height: this.config.height })
}

Canvasius.prototype.load = function(connections) {
  this.reset()

  if (Array.isArray(connections) && connections.length > 0) {
    var rect = this.canvas.getBoundingClientRect()
    var offsetX = rect.left
    var offsetY = rect.top
    var scale = this.scale

    connections.map(function(path) {
      this.ctx.beginPath()
      path.map(function(item) {
        var x = item.x
        var y = item.y
        
        this.ctx.lineTo(x  * scale.x, y * scale.y)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(x * scale.x, y* scale.y)
      }.bind(this))
    }.bind(this))
    this.data = connections
  }
  else {
    console.log('no points to draw')
  }
}
Canvasius.prototype.getData = function() {
	return this.data
}

// check
/*
function tClosure() {
  var isAvailable = true

  return function(fn) {
    if (!isAvailable) {
      
      return
    }
    isAvailable = false
    setTimeout(function() {
      isAvailable = true
    }, 15)
    fn()
  }
}
var throttle = tClosure()

function draw(offsets, e) {
  if (!this.drawing) return

  var offsetX = offsets.offsetX
  var offsetY = offsets.offsetY
  
  function render() {
    var scale = this.scale

    try {
      var x = e.clientX
      var y = e.clientY

      this.data[this.data.length - 1].push({ x: x / scale.x, y: y / scale.y })
      
      this.ctx.lineTo(x - offsetX - 10, y - offsetY - 10)
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.moveTo(x - offsetX - 10, y - offsetY - 10)
    }
    catch {}
  }
  throttle(render.bind(this))
}

function Canvasius(root, config) {
  this.drawing = false
  this.root = root
  this.data = []
  this.config = config
  this.editable = config ? config.editable : false
  this.scale = {
    x: config ? (config.width || 100) / 100 : 1,
    y: config ? (config.height || 100) / 100 : 1
  } 

  this.generate(config)
}

Canvasius.prototype.generate = function(config) {
  this.canvas = document.createElement("canvas")
  this.ctx = this.canvas.getContext("2d")
  
  this.drawing = false
  
  var rect = this.canvas.getBoundingClientRect()
  var offsetX = rect.left
  var offsetY = rect.top
  
  root.innerHTML = ""

  this.canvas.width = config ? config.width || 100 : 100
  this.canvas.height = config ? config.height || 100 : 100
  this.canvas.style.border = "1px solid #000"
  
  this.ctx.strokeStyle = "#000"
  this.ctx.lineWidth = this.canvas.width / 50
  this.ctx.lineCap = 'round'
  
  function startDrawing(e) {
    this.drawing = true
    this.data.push([])
    this.ctx.beginPath()
    draw.call(this, { offsetX: offsetX, offsetY: offsetY }, e)
  }

  function endDrawing() {
    this.drawing = false
    this.ctx.beginPath()
  }

  if (this.editable) {
    this.canvas.addEventListener("mousedown", startDrawing.bind(this))
    this.canvas.addEventListener("mouseup", endDrawing.bind(this))
    this.canvas.addEventListener("mousemove", draw.bind(this, { offsetX: offsetX, offsetY: offsetY }))
  } else {
    // this.canvas.addEventListener("mouseover", function() {
    //   showTooltip()
    // })
    config ? !config.editable ? this.canvas.title = this.config.tooltip || ""  : "" : ""
  }
  
  this.root.appendChild(this.canvas)
}

Canvasius.prototype.reset = function() {
  this.data = []
  this.generate(this.config)
}

Canvasius.prototype.load = function(connections) {
  this.reset()

  if (Array.isArray(connections) && connections.length > 0) {
    var rect = this.canvas.getBoundingClientRect()
    var offsetX = rect.left
    var offsetY = rect.top
    var scale = this.scale

    connections.map(function(connection) {
      this.ctx.beginPath()
      connection.map(function(item) {
        var x = item.x
        var y = item.y
        
        this.ctx.lineTo((x - offsetX) * scale.x, (y - offsetY) * scale.y)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo((x - offsetX) * scale.x, (y - offsetY) * scale.y)
      }.bind(this))
    }.bind(this))
    this.data = connections
  }
  else {
    console.log('no points to draw')
  }
}
*/
