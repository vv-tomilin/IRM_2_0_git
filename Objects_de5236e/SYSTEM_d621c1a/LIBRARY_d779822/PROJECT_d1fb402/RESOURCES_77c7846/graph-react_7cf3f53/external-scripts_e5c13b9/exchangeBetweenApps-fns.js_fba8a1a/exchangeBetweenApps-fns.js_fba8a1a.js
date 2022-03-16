( // оборачиваем самовызывающей функцией, чтобы незахламлять объект window
  () => {

    window.RState = RState
    function RState(fieldName = null) { // вернуть общий state, для приложений 
      let state = null
      for (let i = 0; i < 10; i++) {
        if (window.parent[i]) {
          if (window.parent[i].rigintel) {
            state = fieldName && window.parent[i].rigintel.state[fieldName] || window.parent[i].rigintel.state
            break;
          }
          if (window.parent.rigintel) {
            state = fieldName && window.parent.rigintel.state[fieldName] || window.parent.rigintel.state
          }
        }
      }
      return state
    }

    const ERROR = 'error'

    {
      let intervalInit
      const promise = new Promise(resole => {
        intervalInit = setInterval(() => { // ATVISE LOADING and React starting
          const signal3 = (RState().exchangeStatus.reactAppStatus === 'starting')
          if (signal3) setTimeout(() => resole(), 500) // при получении сигнала, даем разрешение через 500мс, что бы atvise точно прогрузился
        }, 100)
      })
      promise.then(async res => {       // ATVISE LOADED // коллбек делаем ассинхронный (async) 
        clearInterval(intervalInit)

        // инициализация структуры для обмена между приложениями, с локальными данными
        // RState().lib = {}
        // RState('lib').isJsonString = isJsonString
        RState().data = { value: null, fnUpdateDataValue: fnUpdateDataValue }
        RState().atvise = {}
        RState().atvise.settings = {}
        RState().atvise.settings.settingsFn = fnUpdateSettingsField
        RState().atvise.settings.saveSettingsFn = fnSaveSettings
        RState('exchangeStatus').scriptAtviseStatus = 'fnsLoaded' // устанавливаем, что все функции подгрузили
      })

      function fnSaveSettings(newValueSettings) {
        webMI.data.write(["AGENT.OBJECTS.Settings_param.Graph.settings"], newValueSettings && JSON.stringify(newValueSettings) || '')
      }

      function fnUpdateDataValue(type = 'live', params) { // обработчик получения данных для графиков, тип: live/interval


        function getTagsSettings(settingsUser) { // получить список тегов
          const sensorsNames = []
          const settingsArr = Object.values(settingsUser)

          settingsArr.forEach(el => {
            Object.values(el).forEach(_item => {
              sensorsNames.push(_item.sensor_name)
            })
          })

          const sensorsTags = sensorsNames.map(el => {
            return RState().atvise.all_sensors_withAdress[el].address
          })
          sensorsTags.push('AGENT.OBJECTS.Support.Auto.Operation')
          sensorsTags.push('AGENT.OBJECTS.IVE50.Well.WellDepth')

          return sensorsTags
        }

        function updateDataValueIfLive(sensorsTags) {
          webMI.data.read(sensorsTags, function (e) {
            const adapted = adapterDataLiveForUplot(e)
            RState().data.value = adapted
          });
        }

        const settingsUser = RState().atvise.settings.settingsUser
        const sensorsTags = getTagsSettings(settingsUser)

        if (type === 'live') updateDataValueIfLive(sensorsTags) // если режим live
        if (type === 'interval') getHistoryDataTik_Async(params) // если режим interval
      }

      async function getHistoryDataTik_Async(params) {

        function getFilterTagDefault(_tag, _timeFrom, _timeTo) { // фильтр по тегу
          const _filter = {}
          _filter.address = ['g:' + _tag]
          // filter.type = ["v:1"]
          _filter.timestamp = ["n:>=" + _timeFrom + "<=" + _timeTo]
          return _filter
        }
        function getFilterTagDefaultArray(tag, intervals) { // массив фильтров по тегу
          const reaArr = intervals.map(el => {
            const r = getFilterTagDefault(tag, el.timeFrom, el.timeTo)
            return r
          })
          return reaArr
        }
        function getIntervalsForFilter(_timeFrom, _timeTo) {
          function getIntervalsCount(__lenInterval, __delitel) {
            if (__lenInterval < __delitel) return 1
            const __quotient = Math.floor(__lenInterval / __delitel);
            const __remainder = __lenInterval % __delitel;
            const __addition = (__remainder > 0) ? 1 : 0
            const __resultCount = __quotient + __addition
            return __resultCount
          }
          const _lenInterval = _timeTo - _timeFrom
          const _DELITEL = 3600 * 1000
          let _countIntervals = getIntervalsCount(_lenInterval, _DELITEL)

          const _resultIntervals = []
          if (_countIntervals === 1) _resultIntervals.push({ timeFrom: _timeFrom, timeTo: _timeTo })
          for (let i = 0; i < (_countIntervals - 1); i++) {
            _resultIntervals.push({ timeFrom: _timeFrom + _DELITEL * i, timeTo: _timeFrom + _DELITEL * (i + 1) })
          }
          if (_countIntervals > 1) _resultIntervals.push({ timeFrom: _timeFrom + _DELITEL * (_countIntervals - 1), timeTo: _timeTo })
          return _resultIntervals
        }
        async function getDataFromAtviseByFilter(_filter) {
          let _promise = new Promise(async (_resolve, _reject) => {
            window.webMI.data.queryFilter(_filter, function (e) { // получить из Atvise
              const t1 = new Date().getTime()
              _resolve(e.result)
            })
          })
          return _promise
        }
        async function getDataFromAtviseByFilterArray(_filters) {
          let _resultArray = []
          let _promise = new Promise(async (_resolve, _reject) => {
            for (let i = 0; i < _filters.length; i++) {
              const _res = await getDataFromAtviseByFilter(_filters[i])
              _resultArray.push(_res)
            }
            _resolve(_resultArray)
          })
          return _promise
        }
        const { time_stamp_start: timeFrom, time_stamp_stop: timeTo } = params //!!! времменно, потом ВКЛЮЧИТЬ
        // const time1 = 10000000
        // const time1 = new Date().getTime() //!!! времменно, потом отключить
        // const timeFrom = Math.floor(time1 / 1000 - 1.1 * 60 * 60)  //!!! времменно, потом отключить
        // const timeTo = Math.floor(time1 / 1000) //!!! времменно, потом отключить

        const adaptTimeFrom = timeFrom * 1000
        const adaptTimeTo = timeTo * 1000
        const intervalsForFilter = getIntervalsForFilter(adaptTimeFrom, adaptTimeTo)
        const filters = getFilterTagDefaultArray("AGENT.OBJECTS.Settings_param.Graph.liveTik", intervalsForFilter)
        const dataAtvise = await getDataFromAtviseByFilterArray(filters)
        const dataTimestamps = getDataTimestampAtviseAdapted(dataAtvise)
        const dataValues = adaptingValuesForReact(dataAtvise)

        function getDataTimestampAtviseAdapted(dataAtviseArr) {
          let resultData = []
          dataAtviseArr.forEach(el => {
            el.forEach(_el => {
              resultData.push(adaptingTimestampForReact(_el.timestamp))
            })
          })
          return resultData
        }

        function adaptingValuesForReact(dataAtvise) { // данные адаптируем под структуру REACT

          const parseValuesArr = dataAtvise.map(el => {
            return el.map(_el => {
              let res
              try {
                res = JSON.parse(_el.value)
              } catch (error) {
                res = {
                  "HookPosition": 0, "StrokePump1": 0, "FlowOutput": 0, "HydrokeyTorque": 0, "HookSpeed": 0, "DrillSpeed": 0, "TemperatureVolume": 0, "MachineKeyTorque1": 0, "MachineKeyTorque2": 0, "WeightOnHook": 0, "LoadOnBit": 0, "PressureManifold": 0, "RotorTorque": 0, "RotorSpeed": 0, "ToolPosition": 0, "WellDepth": 0, "NKPR3": 0, "NKPR5": 0, "HydroSulfide2": 0, "DensityVolume2": 0, "ToppingLevel": 0, "SumStrokePumps": 0, "TDSSpeed": 0, "StrokePump2": 0, "FlowInput": 0, "NKPR1": 0, "TankLevel2": 0, "TankLevel3": 0, "HydroSulfide1": 0, "TankLevel4": 0, "TankLevel5": 0, "TankLevel6": 0, "DensityVolume1": 0, "TankLevel7": 0, "TankLevel8": 0, "TankLevel9": 0, "TankLevel1": 0, "TDSTorque": 0, "Operation": { "oper": "НЕТ ДАННЫХ", "suboper": "в статике", "operclr": "#1583DC", "suboperclr": "#389CFF" }
                }
              }

              return res
            })
          })

          const resultData = {}
          parseValuesArr.forEach(parseValues => {
            parseValues.forEach(object => {
              for (const key in object) {
                if (resultData[key] === undefined) resultData[key] = {}
                if (resultData[key].data === undefined) resultData[key].data = []
                resultData[key].data.push(object[key])
              }
            })
          })

          return resultData
        }

        function adaptingTimestampForReact(timestamp) { // адаптировать под react данные
          return Math.trunc(timestamp / 1000) // убрать дробную часть и удалить доли секунд (timestamp в секундах)
        }

        const dataValuesAndTimes = { data: dataValues }
        dataValuesAndTimes.data.DataTimes = {
          data: dataTimestamps
        }
        RState().data.value = dataValuesAndTimes

      }


    }

    // })







    function adapterDataLiveForUplot(dataAtviseLive) { // адаптируем данные Live режима под Uplot, для ReactApp

      const dataTime = Math.trunc(dataAtviseLive[0].timestamp / 1000) // текущее время для Live режима

      const resultObj = { DataTimes: [dataTime] }

      // const resultObj = { DataTimes: { data: [dataTime] } } //!!!wishco
      function getFormattingValue(val) { // отформатировать value, если нужно
        if (typeof val === "number" || val instanceof Number) return Math.floor(val * 100) / 100 // если число, то возвращаем число с фиксированным кол-вом чисел после запятой
        return isJsonString(val) && JSON.parse(val) || val // возвращаем JSON, если строка может быть распарсена в JSON, а иначе вернем строку
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

    async function updateDataValueIfInterval(tags, params) {
      const dataAtvise = []
      let adapAt = []
      function getFilterTagDefault(tag, timeFrom, timeTo) {
        const filter = {}
        filter.address = ['g:' + tag]
        // filter.type = ["v:1"]
        filter.timestamp = ["n:>=" + timeFrom + "<" + timeTo]
        return filter
      }

      const { time_stamp_start: timeFrom, time_stamp_stop: timeTo } = params

      let currIndexTag = 0
      while (currIndexTag < tags.length) { // длительность цикла, зависит от кол-ва тегов

        let filter = getFilterTagDefault(tags[currIndexTag], timeFrom * 1000, timeTo * 1000)
        let _promise = new Promise(async (_resolve, _reject) => {

          window.webMI.data.queryFilter(filter, function (e) { // получить общую информацию, получить объект Info, из Atvise
            _resolve()
            dataAtvise.push(e.result)
          })

        })
        currIndexTag++
        await _promise


      }

      // })



      adapAt = dataAtvise.map((el) => {
        return getTimeObj2(timeTo, timeFrom, 600, el, adapterQueryFilterAtvise2)
      })


      // if (currIndexTag > 0) { // пока идёт ассинхронный запрос, адаптируем полученные данные на прошлом шаге...
      //   // function getAdaptedData(dataArr) {
      //   //   // dataArr.map
      //   // }
      //   const dataPrevStep = dataAtvise[currIndexTag - 1]

      //   // getAdaptedData(dataPrevStep)

      //   // getTimeObj(timeStampStart, timeStampEnd, countIntervals, data, adapter = adapterQueryFilterAtvise) 

      //   const resAdap = getTimeObj2(timeTo, timeFrom, 600, dataPrevStep, adapterQueryFilterAtvise2)
      //   adapAt.push(resAdap)
      // }


    }


    async function fnUpdateSettingsField(nameSettings, needDefaultSettingsIfError = true, needSavingDefault = true) {

      function getTagByFieldSettings(fieldSettings) {
        const NAME_SETTINGS_DEFAULT = 'settingsDefault'
        const tags = {
          settingsDefault: 'SYSTEM.GLOBALS.rigintel.graph.settingsDefault', // настройки по умолчанию
          settingsUser: 'AGENT.OBJECTS.Settings_param.Graph.settings' // настройки пользователя
        }
        const fieldName = fieldSettings ? fieldSettings : NAME_SETTINGS_DEFAULT
        const tagValue = tags[fieldName]
        const isValidName = !!tagValue
        if (!isValidName) throw new Error()
        return [tagValue]
      }

      async function taskSettings(fieldSettings) {
        let resultValueSettings
        try {
          if (fieldSettings === 'default') throw new Error()
          const tagValue = getTagByFieldSettings(fieldSettings) // получить имя тега и тег
          const dataRead = await getDataReadFromAtviseOrError(tagValue) // получить значение по тегу
          if (dataRead === ERROR) throw new Error() // если по наличию тега в Atvise получили ошибку то инициируем ошибку для Catch
          const dataReadParse = JSON.parse(dataRead[0].value)
          if (!Array.isArray(dataReadParse)) throw new Error() // если не массив значений, то значение не верное...

          // const settingsJson = getJsonFromAtviseStructureOrError(dataReadParse)  // получаем Json или инициируем ошибку для Catch
          //const adaptedSettingsForReact = getAdaptedSettingsForReact(settingsJson)
          // resultValueSettings = adaptedSettingsForReact
          resultValueSettings = dataReadParse
        } catch (err) {
          if (needDefaultSettingsIfError) {
            const tagValue = getTagByFieldSettings() // берем настройки по умолчанию
            const dataRead = await getDataReadFromAtviseOrError(tagValue) // получить значение по тегу
            // fnSaveSettings(dataRead[0].value)
            // webMI.data.write(['AGENT.OBJECTS.Settings_param.Graph.settings'], [JSON.stringify(dataRead[0].value)]);
            const settingsJson = getJsonFromAtviseStructureOrError(dataRead[0].value)  // получаем Json или инициируем ошибку для Catch
            const adaptedSettingsForReact = getAdaptedSettingsForReact(settingsJson)

            if (needSavingDefault) webMI.data.write(['AGENT.OBJECTS.Settings_param.Graph.settings'], [JSON.stringify(adaptedSettingsForReact)]);
            resultValueSettings = adaptedSettingsForReact
          }
          else {
            resultValueSettings = ERROR
          }
        }
        return resultValueSettings
      }

      function isObject(item) {
        return (typeof item === "object" && !Array.isArray(item) && item !== null);
      }

      function getAdaptedSettingsForReact(settings) { // адаптировать настройки графиков, под ReactApp
        const resObj = {}
        let iterationArray = null
        if (isObject(settings)) iterationArray = Object.entries(settings)
        if (Array.isArray(settings)) iterationArray = settings
        iterationArray.forEach(el => {
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

      const valueSettings = await taskSettings(nameSettings)
      const valueSettingsDefault = await taskSettings(nameSettings)
      RState().atvise.settings[nameSettings] = valueSettings
      // RState().atvise[type].value = jsonNotError ? RESULT : ERROR

    }

    async function getDataReadFromAtviseOrError(tags) {
      let result = null
      const promise = new Promise((resolve, reject) => {
        window.webMI.data.read(tags, function (e) { // получить настройки графика, из Atvise
          checkWrongTags(e, tags, reject)
          resolve(e)
        });

      })
      await promise.then(res => {
        result = res
      }).catch(res => {
        result = res
      })

      return result
    }
    function checkWrongTags(_e, _signals, _reject) { // проверка тегов на соответствие
      let countErrors = 0
      let _err = new Error('В программу Atvise не внесены небходимые теги для графиков! Проверьте наличие тегов в Atvise:');
      _err.stack = '' // stack - для формирования текста ошибки
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

    function getJsonFromAtviseStructureOrError(value) {  // получить Json объект из Atvise или сигнал ошибки (для JSON объектов)
      const newObj = {}
      // let errStatus = false

      try {
        value.forEach(el => {
          let posSplit = el.indexOf(":") + 1 // позиция символа ':'
          let stringValueForParse = el.slice(posSplit, el.length)
          let stringKeyForParse = el.slice(0, posSplit - 1)
          let key = JSON.parse(stringKeyForParse)
          let value = JSON.parse(stringValueForParse)
          newObj[key] = value
        })
      } catch (error) {
        // errStatus = true
        throw new Error()
      }
      return newObj
      // return (errStatus ? ERROR : newObj)
    }

    // }
    // const requestHistoryData = (params, config) => { // получить исторические данные 
    //   const { time_stamp_start, time_stamp_stop } = params
    //   const step = (time_stamp_stop - time_stamp_start) / 600
    //   const newTimeArr = []
    //   for (let i = 0; i < 600; i++) {
    //     newTimeArr.push(Math.trunc(time_stamp_start + i * step))
    //   }
    // }

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
        // const _arrIntervals = Object.entries(objTime)
        const _arrIntervals = Object.entries(objTime).sort((a, b) => Number(a[0]) - Number(b[0])) // сортируем интервалы по возрастанию TimeStamps
        const _stepInterval = Number(_arrIntervals[1][0]) - Number(_arrIntervals[0][0])// шаг интервалов
        const halfStep = _stepInterval / 2
        const lastIndexValue = (_arrIntervals.length - 1)

        data.forEach(_el => {
          const _timestamp = adapter(_el, 'timestamp')

          _arrIntervals.forEach((__key, __index, __array) => {


            const __intervalLeft = Number(__array[__index][0]) - halfStep
            const __intervalRight = __intervalLeft + _stepInterval
            const __isIndexFirst = (__index === 0)
            const __isIdexLast = (__index !== lastIndexValue)
            let __needAdd = false

            if (__isIndexFirst) {
              if (__intervalLeft >= _timestamp) __needAdd = true
            }

            if ((!__isIndexFirst) && (!__isIdexLast)) {
              if ((__intervalLeft < _timestamp) && (_timestamp < __intervalRight)) __needAdd = true
            }


            if (__isIdexLast) {
              if (__intervalLeft <= _timestamp) __needAdd = true
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

      var time1 = performance.now();
      buildingObj = getBlank_ObjTime()
      time1 = performance.now() - time1;

      var time2 = performance.now();
      fillData_ObjTime(buildingObj)
      time2 = performance.now() - time2;

      var time3 = performance.now();
      resultObj = merge_ObjTime(buildingObj, mergeAverageArray)
      time3 = performance.now() - time3;

      var time4 = performance.now();
      resultObj = floorValuesObject(resultObj)
      time4 = performance.now() - time4;

      return resultObj
    }

    function adapterQueryFilterAtvise2(data, fieldName = 'timestamp') { // адаптировать данные под Atvise структуру (под Atvise json данные)
      if (fieldName === 'values') return data.map(el => el.value) // возвращаем массив: value
      if (fieldName === 'timestamp') return data.timestamp // возвращаем массив: value 
    }


    function getStepTime2(timeStampStart, timeStampEnd, countIntervals) { // шаг времени, (время между интервалами)
      return Math.round((timeStampEnd - timeStampStart) / (countIntervals - 1)) // шаг между интервалами (учитывать нужно на 1 шаг меньше, для правильного интервала времени)
    }



  }

)()