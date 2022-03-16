(() => { // Отображением графика на дисплее Atvise и обработка resize и открытия и закрытия дисплея


  window.RState = window.parent.RState

  var GRAPH_WIDTH = 1920 - 75 // ширина графика, в пикселях (значение: ЧИСЛО)
  var GRAPH_HEIGHT = 1080 - 75 // высота графика, в пикселях (значение: ЧИСЛО)
  var GRAPH_LEFT_OFFSET = 70 // смещение окна графика слева, по оси X, в пикселях (значение: ЧИСЛО)
  var GRAPH_TOP_OFFSET = 70 // смещение окна графика сверху, по оси Y, в пикселях (значение: ЧИСЛО)

  webMI.addOnunload(function (e) { // при закрытии Display
    RState().showing.fn(0)
    var root2 = parent.document.querySelector("#root2")
    root2.style.display = 'none'
  });

  var resizeFn = function () {

    var mainContainer = parent.document.querySelector("#mainContainer")
    var root2 = parent.document.querySelector("#root2")
    root2.style.position = 'absolute'
    root2.style.display = 'block'

    root2.style.zoom = getComputedStyle(mainContainer).zoom
    root2.style.top = GRAPH_TOP_OFFSET + parseInt(getComputedStyle(mainContainer).top) + 'px'
    root2.style.left = GRAPH_LEFT_OFFSET + parseInt(getComputedStyle(mainContainer).left) + 'px'
    root2.style.width = getComputedStyle(mainContainer).width
    root2.style.height = getComputedStyle(mainContainer).height

    var wrapper = root2.querySelector(".root2__wrapper")
    webMI.gfx.setScaledEvents(wrapper, true)

    getComputedStyle(mainContainer).left

    wrapper.style.width = GRAPH_WIDTH + "px"
    wrapper.style.height = GRAPH_HEIGHT + "px"
    wrapper.style.left = GRAPH_LEFT_OFFSET + "px"
    wrapper.style.top = GRAPH_TOP_OFFSET + "px"

    RState().showing.fn(1)
  }
  resizeFn()
  parent.window.addEventListener("resize", resizeFn)

})()