( // оборачиваем самовызывающей функцией, чтобы незахламлять объект window
  () => {
    const ERROR = 'error'



    async function initializeStructureExchange_Async() { // инициализируем структуру обмена между приложениями
      function getAdaptedStructureFromAtvise(value) {  // адаптировать передаваемую структуру в нормальное представления, получая её из Atvise (для JSON объектов)
        const newObj = {}
        value.forEach(el => {
          let posSplit = el.indexOf(":") + 1 // позиция символа ':'
          let stringValueForParse = el.slice(posSplit, el.length)
          let stringKeyForParse = el.slice(0, posSplit - 1)
          let key = JSON.parse(stringKeyForParse)
          let value = JSON.parse(stringValueForParse)
          newObj[key] = value
        })
        return newObj
      }
      function getNewObjectWithoutFields(object, fields) { // удалить поля из объекта, fields - Array или String
        const newObject = JSON.parse(JSON.stringify(object)) // создать новую копию объекта
        function deleteArrFields(el, fields) {
          for (let i = 0; i < fields.length; i++) {
            delete el[1][fields[i]]
          }
        }
        function deleteStringField(el, field) {
          delete el[1][field]
        }
        const fnDeleteFields = Array.isArray(fields) ? deleteArrFields : deleteStringField

        Object.entries(newObject).forEach((el, index, array) => { // получить value, но удалить все записи 'address'
          fnDeleteFields(el, fields)
        })
        return newObject
      }
      function checkWrongTags(_e, _signals, _reject) { // проверка тегов на соответствие
        let countErrors = 0
        let _err = new Error('В программу Atvise не внесены небходимые теги для графиков! Проверьте наличие тегов в Atvise:');
        _err.stack = ''
        _e.forEach((__el, index) => {
          if (__el.error === -1) {
            countErrors++
            _err.stack += '\r\n' + countErrors + ') ' + _signals[index]
          }
        })

        if (countErrors) {
          _reject(ERROR) // выходим из ожидания результата промиса, с флагом ошибки - reject
          throw _err // выбрасываем сообщение о ошибке
        }

      }
      function taskSensors(e, signals, reject) {
        checkWrongTags(e, signals, reject) // вызываем проверку тегов на соответствие, если ошибка, то выходим из тела функции и вызываем у промиса событие CATCH!!!
        const adaptedData = getAdaptedStructureFromAtvise(e[0].value)
        const adaptedDataForReactWithAdress = adaptedAll_sensorsForReact(adaptedData)
        const adaptedDataForReactWithoutAdress = getNewObjectWithoutFields(adaptedDataForReactWithAdress, 'address')
        return {
          all_sensors_withAdress: adaptedDataForReactWithAdress,
          all_sensors: adaptedDataForReactWithoutAdress
        }
      }
      function taskInfo(e, signals, reject) {
        checkWrongTags(e, signals, reject) // вызываем проверку тегов на соответствие, если ошибка, то выходим из тела функции и вызываем у промиса событие CATCH!!!
        const adaptedData = {}
        e.forEach(el => adaptedData[el.description.ru] = el.value)
        return adaptedInfoForReact(adaptedData)
      }

      const promiseSensors = new Promise((resolve, reject) => {
        const tags = ["SYSTEM.GLOBALS.rigintel.all_sensors"]
        window.webMI.data.read(tags, function (e) { // получить все сенсоры графика, из Atvise
          const resultTask = taskSensors(e, tags, reject)
          resolve(resultTask)
        });
      }).catch(() => ERROR)

      const promiseInfo = new Promise((resolve, reject) => {
        let tags = ["AGENT.OBJECTS.Rig.General.BushName", "AGENT.OBJECTS.Rig.General.FieldName", "AGENT.OBJECTS.Rig.General.WellName", "AGENT.OBJECTS.Depth_day_data.start_date"]
        window.webMI.data.read(tags, function (e) { // получить общую информацию, получить объект Info, из Atvise
          const resultTask = taskInfo(e, tags, reject)
          resolve(resultTask)
        });
      }).catch(() => ERROR)

      const resultPromiseAll = await Promise.all([ // res - результат промиса данные ИЛИ строка с 'error'(res - данные или сигнал оишбки)
        promiseSensors.then(res => {
          RState().atvise.all_sensors_withAdress = res.all_sensors_withAdress
          RState().atvise.all_sensors = res.all_sensors
          return res
        }),
        promiseInfo.then(res => {
          RState().atvise.info = res
          return res
        })
      ]).then(all => {
        all.forEach(el => { // res может получить значения в массиве с ERROR, значит какой то из промисов закончился с ошибкой
          if (el === ERROR) throw true // если находим сигнал ошибки, то переходим в обработчик 'catch'
        })
        return 'ok'
      }).catch(() => ERROR)
      return resultPromiseAll // ERROR - если была ошибка ИЛИ 'ok' - если все промисы успешно выполнены
    }



    let intervalInit
    const promise = new Promise(resole => {
      intervalInit = setInterval(() => {         // ATVISE LOADING and React initilization
        // const signal3 = window?.rigintel?.exchangeStatus?.reactAppStatus === 'initilization'
        const signal3 = (RState().exchangeStatus.scriptAtviseStatus === 'fnsLoaded')
        if (signal3) setTimeout(() => resole(), 500) // при получении сигнала, даем разрешение через 500мс, что бы atvise точно прогрузился
      }, 100)
    })
    promise.then(async res => {       // ATVISE LOADED // коллбек делаем ассинхронный (async) 
      clearInterval(intervalInit)
      const resultAsyncInit = await initializeStructureExchange_Async() // инициализация структуры для обмена между приложениями, с асинхронными запросами
      // await getHistoryData_Async()

      RState().exchangeStatus.scriptAtviseStatus = (resultAsyncInit === ERROR) ? ERROR : 'loaded'
      RState().lib = {}
      RState().lib.getHistoryData_Async = getHistoryData_Async

    })


    async function getHistoryData_Async(params) {
      const result = []
      function getTagsSettings() {
        function getlistNames() {
          const resArr = []
          const settings = RState().atvise.settings.settingsUser
          Object.values(settings).forEach(el => {
            el.forEach(_el => {
              resArr.push(_el.sensor_name)
            })
          })
          return resArr
        }
        function getTagsByListNames(listNames) {
          return listNames.map(el => {
            return RState().atvise.all_sensors_withAdress[el].address
          })
        }
        const listNames = getlistNames()
        const result = getTagsByListNames(listNames)
        result.push('AGENT.OBJECTS.Support.Auto.Operation')
        result.push('AGENT.OBJECTS.IVE50.Well.WellDepth')
        return result
      }

      const promise = new Promise((resolve, reject) => {
        const tags = getTagsSettings() // получить массивов тегов
        function getFilterTagDefault(tag, timeFrom, timeTo) {
          const filter = {}
          filter.address = ['g:' + tag]
          // filter.type = ["v:1"]
          filter.timestamp = ["n:>=" + timeFrom + "<" + timeTo]
          return filter
        }

        async function getData() {

          const resultAdapted = []
          let currIndexTag = 0

          while (currIndexTag < tags.length) { // длительность цикла, зависит от кол-ва тегов

            const _promise = new Promise((_resolve, _reject) => {
              const currTag = tags[currIndexTag]

              const { time_stamp_start: timeFrom, time_stamp_stop: timeTo } = params
              const filterTagDefault = getFilterTagDefault(currTag, timeFrom * 1000, timeTo * 1000)

              window.webMI.data.queryFilter(filterTagDefault, function (e) { // получить общую информацию, получить объект Info, из Atvise
                // const adaptedData = {}
                // function adaptedValue(val) {
                //   return Math.floor(val * 100) / 100
                // }

                // e.forEach(el => adaptedData[el.description.ru] = adaptedValue(el.value))

                result.push(e.result)
                _resolve()
              })
              if (currIndexTag > 0) { // пока идёт ассинхронный запрос, адаптируем полученные данные на прошлом шаге...
                function getAdaptedData(dataArr) {
                  // dataArr.map
                }
                const dataPrevStep = result[currIndexTag - 1]
                getAdaptedData(dataPrevStep)

                // getTimeObj(timeStampStart, timeStampEnd, countIntervals, data, adapter = adapterQueryFilterAtvise) 
                const b = getTimeObj2(timeTo, timeFrom, 600, dataPrevStep, adapterQueryFilterAtvise2)

              }
              currIndexTag++
            })


            await _promise
          }

          resolve()
        }

        const data1 = getData()

      })

      await promise

    }

    function adaptedAll_sensorsForReact(all_sensors) { // адаптировать сигналы графиков, под ReactApp
      const resObj = {}
      Object.entries(all_sensors).forEach(el => {
        const key = el[0]
        const value = el[1]
        resObj[key] = {
          sensor_name_ru: value.name_ru,
          sensor_alias: value.alias,
          sensor_unit: value.unit,
          sensor_min: Number(value.min),
          sensor_max: Number(value.max),
          sensor_color: value.color,
          address: value.address // оставить только в full
        }
      })
      return resObj
    }
    function adaptedSettingsForReact(settings) { // адаптировать настройки графиков, под ReactApp
      const resObj = {}
      Object.entries(settings).forEach(el => {
        const key = el[0]
        const value = el[1]

        resObj[key] = {
          sensor_name: key,
          sensor_name_ru: value.name_ru,
          sensor_alias: value.alias,
          sensor_unit: value.unit,
          sensor_min: Number(value.min),
          sensor_max: Number(value.max),
          sensor_color: value.color,
          sensor_block: Number(value.sensor_block),
          autoscale: (value.autoscale === 'true') || (el.autoscale === true),
          sensor_order: Number(value.sensor_order) // после сортировки, sensor_order удалить...
        }

      })



      const res = {}
      for (let i = 0; i < 5; i++) { // всего 5 колонок с настройками (sensor_block 5шт)
        const block = Object.values(resObj).filter(el => (el.sensor_block === i))
        let blockSort = block.sort((a, b) => a.sensor_order - b.sensor_order) // сортируем по возрастанию
        blockSort.forEach(el => delete el.sensor_order) // удалить поле sensor_order, оно уже не нужно (нужно было для правильной сортировки)
        res[i] = blockSort
      }

      return res
    }

    function adaptedInfoForReact(info) { // адаптировать общую информацию графиков, под ReactApp
      return {
        active_preset_name: "Default",
        active_preset_id: 1,
        padname: info.BushName,
        fieldname: info.FieldName,
        wellname: info.WellName,
        well_type: 1,
        start_building: Number(info.start_date / 1000),
        finish_building: Math.trunc(new Date().getTime() / 1000)
      }
    }

    function adapterDataLiveForUplot(dataAtviseLive) { // адаптируем данные Live режима под Uplot, для ReactApp
      const dataTime = Math.trunc(dataAtviseLive[0].timestamp / 1000) // текущее время для Live режима
      const resultObj = { DataTimes: [dataTime] }
      // const resultObj = { DataTimes: { data: [dataTime] } } //!!!wishco
      function getFormattingValue(val) { // отформатировать value, если нужно
        if (typeof val === "number" || val instanceof Number) return Math.floor(val * 100) / 100 // если число, то возвращаем число с фиксированным кол-вом чисел после запятой
        return IsJsonString(val) && JSON.parse(val) || val // возвращаем JSON, если строка может быть распарсена в JSON, а иначе вернем строку
      }
      dataAtviseLive.forEach(el => {
        const elValue = getFormattingValue(el.value)
        resultObj[el.description.ru] = { data: [elValue] }
      });
      return resultObj
    }

    function isJsonString(str) { // вернем флаг; строку возможно привести к JSON -> true иначе false
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

  }
)()















function getTimeObj2(timeStampStart, timeStampEnd, countIntervals, data, adapter = adapterQueryFilterAtvise2) { // получить необходимую структуру для графика, по входящим параметрам и внешним данным (data)
  let buildingObj = {}
  let resultObj = {}
  const stepTime = getStepTime2(timeStampStart, timeStampEnd, countIntervals)

  function getBlank_ObjTime() { // получить пустой объект с интервалами
    const result = {}
    for (let _index = 0; _index < countIntervals; _index++) {
      let _currIndexElement = ((_index + 1) !== countIntervals) ? timeStampStart + stepTime * (_index) : timeStampEnd
      result[_currIndexElement] = []
    }
    return result
  }

  function fillData_ObjTime(objTime) { // объект с интервалами, заполнить данными (объект, мутирует)
    const resultObj = objTime
    data.forEach(_el => {
      const _arrIntervals = Object.entries(objTime).sort((a, b) => Number(a[0]) - Number(b[0])) // сортируем интервалы по возрастанию TimeStamps
      _arrIntervals.forEach((__key, __index, __array) => {
        const __timestamp = adapter(_el, 'timestamp')
        const __stepInterval = Number(_arrIntervals[1][0]) - Number(_arrIntervals[0][0])// шаг интервалов
        const __intervalLeft = Number(__array[__index][0]) - __stepInterval / 2
        const __intervalRight = __intervalLeft + __stepInterval
        const __isIndexFirst = (__index === 0)
        const __isIdexLast = (__index !== (__array.length - 1))
        let __needAdd = false

        if (__isIndexFirst) {
          if (__intervalLeft >= __timestamp) __needAdd = true
        }

        if ((!__isIndexFirst) && (!__isIdexLast)) {
          if ((__intervalLeft < __timestamp) && (__timestamp < __intervalRight)) __needAdd = true
        }


        if (__isIdexLast) {
          if (__intervalLeft <= __timestamp) __needAdd = true
        }

        if (__needAdd) {
          resultObj[__array[__index][0]].push(_el)
        }

      })
    });

    return resultObj
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

  function floorValuesObject(data) { // округлить данные
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

function adapterQueryFilterAtvise2(data, fieldName = 'timestamp') { // адаптировать данные под Atvise структуру (под Atvise json данные)
  if (fieldName === 'values') return data.map(el => el.value) // возвращаем массив: value
  if (fieldName === 'timestamp') return data.timestamp // возвращаем массив: value 
}


function getStepTime2(timeStampStart, timeStampEnd, countIntervals) { // шаг времени, (время между интервалами)
  return Math.round((timeStampEnd - timeStampStart) / (countIntervals - 1)) // шаг между интервалами (учитывать нужно на 1 шаг меньше, для правильного интервала времени)
}
