function getTimeStampArea(timeStamp, areaName, offsetRight = false) {
  const ms = 1000
  let offsetValue = 0
  switch (areaName) {
    case 'min':
      offsetValue = 1 * 60 * ms
      break;

    default:
      break;
  }
  offsetValue = offsetValue * (offsetRight ? -1 : 1)  // offset может быть положительное или отрицательное, зависит от offsetRight
  return timeStamp + offsetValue
}

function getStepTime(timeStampStart, timeStampEnd, countIntervals) { // шаг времени, (время между интервалами)
  return Math.round((timeStampEnd - timeStampStart) / (countIntervals - 1)) // шаг между интервалами (учитывать нужно на 1 шаг меньше, для правильного интервала времени)
}


function adapterQueryFilterAtvise(data, fieldName) { // адаптировать данные под Atvise структуру (под Atvise json данные)
  if (fieldName === 'values') return data.map(el => el.value) // возвращаем массив: value
  if (fieldName === 'timestamp') return data.timestamp // возвращаем массив: value 
}

function getTimeObj(timeStampStart, timeStampEnd, countIntervals, data, adapter = adapterQueryFilterAtvise) { // получить необходимую структуру для графика, по входящим параметрам и внешним данным (data)
  let buildingObj = {}
  let resultObj = {}

  const stepTime = getStepTime(timeStampStart, timeStampEnd, countIntervals)

  function getBlank_ObjTime() { // получить пустой объект с интервалами
    const result = {}
    for (let _index = 0; _index < countIntervals; _index++) {
      let _currIndexElement = ((_index + 1) !== countIntervals) ? timeStampStart + stepTime * (_index) : timeStampEnd
      result[_currIndexElement] = []
    }
    return result
  }

  function fillData_ObjTime(objTime) { // объект с интервалами, заполнить данными (объект, мутирует)
    const resultObj = {}
    data.forEach(_el => {
      Object.entries(objTime).forEach((__key, __index, __array) => {
        const __timestamp = adapter(_el, 'timestamp')
        if ((__array[__index][0] < __timestamp) && (__array[__index + 1][0] > __timestamp)) {
          __array[__index][1].push(_el)
        }
      })
    });
    // return resultObj
  }

  function merge_ObjTime(buildingObj, fn_merge) { // данные в объекте, объединить
    const resultMerge = {}
    Object.entries(buildingObj).forEach((_el) => {
      const arrValues = adapter(_el[1], 'values')
      resultMerge[_el[0]] = fn_merge(arrValues)
    })

    return resultMerge
  }



  function mergeAverageArray(dataArr) { // Соединить данные массива, по усреднённой формуле
    if (dataArr.length > 0) {
      const summ = dataArr.reduce((_summ, _curr) => {
        return (_summ + _curr)
      }, 0)
      return (summ / dataArr.length)
    }
    return null
  }

  function floorValuesObject(data) { // округлить данные в массиве
    const resultFloor = {}
    Object.entries(data).forEach((_el) => {
      resultFloor[_el[0]] = (_el[1] !== null) ? parseFloat(_el[1].toFixed(2)) : null
    })
    return resultFloor
  }

  buildingObj = getBlank_ObjTime()
  fillData_ObjTime(buildingObj)
  resultObj = merge_ObjTime(buildingObj, mergeAverageArray)
  resultObj = floorValuesObject(resultObj)

  return resultObj
}

async function fillEmptyEdgesTimeObj(data, timeFrom, timeTo) {
  async function getTimeObjByStrategy(timeBegin, strategy) {

    // let _timeBegin = timeBegin
    // let _timeFrom
    // let _timeTo


    // if (strategy === 'from') {
    //   let timeStampOffset = getTimeStampArea(time)

    //   getTimeObj(_timeFrom, _timeTo, 60, [], adapterQueryFilterAtvise)
    // }

    await queryFilterAtivise()

  }

  if (data[timeFrom] === null) data[timeFrom] = await getTimeObjByStrategy(timeFrom, 'from')
  if (data[timeTo] === null) data[timeTo] = 888
}


