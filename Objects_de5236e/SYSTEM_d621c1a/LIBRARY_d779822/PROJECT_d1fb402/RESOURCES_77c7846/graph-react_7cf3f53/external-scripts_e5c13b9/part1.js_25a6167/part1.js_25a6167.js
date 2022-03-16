
// const getActiveSensorsNames = Object.keys(RState().sensors.all_sensors) // получить имена активных сенсоров
// const activeSensorsArrayAtvise = RState().sensorsArrayAtvise.reduce((sum, curr) => { // получить привязки активных сенсоров для Atvise
//   const isExistName = getActiveSensorsNames.filter(_el => _el === curr.name).length > 0 // существует ли имя сенсора  в необходимом наборе
//   return isExistName ? [...sum, curr.value] : sum // если в наборе есть имя сенсора, то добавим его в массив иначе массив не изменяем
// }, []);

let timeBegin = new Date().getTime()
//timeBegin = 1642572641934

updateGraph(timeBegin, '4h', false)
// updateGraph(timeBegin, '1min', false)

// });


// timeBegin - TimeStamp начала
// timeCaseName - временное обозначение, например '1m'
// directionTimeRight - направление откуда брать данные (true - права, иначе слева)
async function updateGraph(timeBegin, timeCaseName, directionTimeRight = false) {
  const timeLength = getTimeLengthByTimeName(timeCaseName) // получить временную длину (длина для выборки данных) [если timeCaseName='1m' return 60000]
  const { timeFrom, timeTo } = getTimeStampIntervalObject(timeBegin, timeLength, directionTimeRight) // получить начальную временную метку (timeFrom) и конечную временую метку (timeTo)
  const aggregate = getAggregateStructure(timeFrom, timeTo) // возвращаем объект агрегации или false если нет агрегации

  const splittedTimeIntervalsArray = getSplittedTimeIntervalsIterationArray(timeFrom, timeTo) // разбить время, на интервалы для итераций [ {from, to}) ... ]

  const filterQueryArray = getFilterQueryArray(splittedTimeIntervalsArray, aggregate) // получить массив фильтров, фильтры выборки по временным меткам
  const dataArr = await getResult_QueryFilterAtiviseArray(filterQueryArray)  // получить массив данных, по массиву фильтров

  const countIntervals = getCountIntervals(timeFrom, timeTo, aggregate) // получить количество интервалов по временным меткам

  // let timeObj = getTimeObj(timeFrom, timeTo, countIntervals, data, adapterQueryFilterAtvise)
  // await fillEmptyEdgesTimeObj(timeObj, timeFrom, timeTo)

}

function getAggregateStructure(timeFrom, timeTo) { // возвращаем структуру агрегации или false если не надо агрегировать
  const timeLength = timeTo - timeFrom
  const isAggregate = (timeLength >= getMinAggregateLength()) ? true : false
  if (!isAggregate) return false // если нет агрегации, возвращаем false
  const aggregateStructure = aggrigateArrTreeObj()
  let resultStructure = null
  aggregateStructure.forEach(el => {
    if (timeLength >= getTimeLengthByTimeName(el.timeName)) resultStructure = el
  });
  return resultStructure
}


function getMinAggregateLength() {
  return getTimeLengthByTimeName(aggrigateArrTreeObj()[0].timeName)
} // получить минимальную временную длину при агрегации
function timeSplitCountDefault() { return 3 } // количество split(разбитий) (разбитие небходимо, что бы не было переполнения 10000 записей в js объекте)

function aggrigateArrTreeObj() {
  const minute = 60000
  return [
    { aggregateTik: minute, timeName: '4h', filter: { unit: "v:m", interval: "v:1" } }, // первый уровень агрегации, если выборка за 4часа (тик в агрегации, 1 запись в минуту)
    { aggregateTik: 5 * minute, timeName: '2day', filter: { unit: "v:m", interval: "v:5" } }, // второй уровень агрегации, если выборка за 2дня (тик в агрегации, 1 запись в 5 минут)
    { aggregateTik: 60 * minute, timeName: '2week', filter: { unit: "v:h", interval: "v:1" } }, // третий уровень агрегации, если выборка за 2недели (тик в агрегации, 1 запись за 1 час)
    { aggregateTik: 6 * 60 * minute, timeName: '4month', filter: { unit: "v:h", interval: "v:6" } }, // третий уровень агрегации, если выборка за 4месяца (тик в агрегации, 1 запись за 6 час)
  ]
}

function getTimeStampIntervalObject(timeBegin, timeLength, directionTimeRight) { // получить начальную временную метку (timeFrom) и конечную временую метку (timeTo) по начальной временной точки, длине и направления
  return {
    timeFrom: directionTimeRight ? timeBegin : timeBegin - timeLength,
    timeTo: directionTimeRight ? timeBegin + timeLength : timeBegin
  }
}

function getSplittedTimeIntervalsIterationArray(timeFrom, timeTo, timeSplitCount = timeSplitCountDefault()) { // разбить время, на интервалы для итераций (разбитие небходимо, что бы не было переполнения 10000 записей в js объекте)
  const resultArray = []
  const lengthTime = (timeTo - timeFrom)
  const lengthTimeInterval = Math.floor(lengthTime / timeSplitCount)
  for (let index = 0; index < timeSplitCount; index++) {
    const timeFromCalc = timeFrom + lengthTimeInterval * index // начальная позиция на текущем интервале
    const timeToCalc = ((index + 1) < timeSplitCount) ? (timeFrom + lengthTimeInterval * (index + 1)) : timeTo // конечная позиция на текущем интервале: если интервал не последний, то высчитываем конечную позицию на интервале, иначе кончная позиция равна пределу(timeTo)
    resultArray.push({ timeFrom: timeFromCalc, timeTo: timeToCalc })
  }
  return resultArray
}

function getFilterQueryArray(timeIntervalsArray, aggregate = false) { // получить массив фильтров, фильтры выборки по временным меткам
  return timeIntervalsArray.map(el => getFilterQuery(el.timeFrom, el.timeTo, aggregate))
}

function getFilterQuery(timeFrom, timeTo, aggregate = false) { // получить объект, фильтр выборки по временным меткам
  const filter = {}
  filter.address = ["g:AGENT.OBJECTS.IVE50.Drawworks.HookSpeed*"]
  filter.type = ["v:1"]
  filter.timestamp = ["n:>=" + timeFrom + "<" + timeTo]
  if (aggregate) {
    filter.unit = aggregate.filter.unit
    filter.interval = aggregate.filter.interval
    filter.aggregate = ["v:Average"];
  }
  return filter
}

async function getResult_QueryFilterAtiviseArray(filterArray) { // получить массив данных, при помощи массивов фильтров
  let resultArray = []
  for (const el of filterArray) {
    resultArray.push(await getResult_QueryFilterAtivise(el)) // добавляем полученный, разбитый, срез данных в массив
  }
  return resultArray
}

async function getResult_QueryFilterAtivise(filter) { // получить данные, по фильтру
  let promiseResult = await new Promise((resolve, reject) => {
    webMI.data.queryFilter(filter, function (e) {
      resolve(e.result)
    });
  });
  return promiseResult
}

function getCountIntervals(timeFrom, timeTo, aggregate) {
  let timeLength = timeTo - timeFrom
  const tik = aggregate && aggregate.aggregateTik || 1000 // тик без агрегации 1сек (1000мс), при агрегации зависит от aggregateTik
  const maxCountItems = 600
  const count = timeLength / tik
  const countResult = ((count > maxCountItems) ? maxCountItems : count)
  return countResult
}

function getTimeLengthByTimeName(timeName) {  // получить временнУю длину по имени интервала из массива объектов
  return getTimeIntervalsObject().filter(el => el.timeName === timeName)[0].timeLength
}

function getTimeIntervalsObject() { // получить массив объектов временных интервалов
  return [
    { id: 1, timeName: '1m', timeLength: 60000 },
    { id: 2, timeName: '10m', timeLength: 600000 },
    { id: 3, timeName: '30m', timeLength: 1800000 },
    { id: 4, timeName: '1h', timeLength: 3600000 },
    { id: 5, timeName: '2h', timeLength: 7200000 },
    { id: 6, timeName: '4h', timeLength: 14400000 },
    { id: 7, timeName: '8h', timeLength: 28800000 },
    { id: 8, timeName: '12h', timeLength: 43200000 },
    { id: 9, timeName: '24h', timeLength: 86400000 },
    { id: 10, timeName: '2day', timeLength: 86400000 * 2 },
    { id: 11, timeName: '2week', timeLength: 86400000 * 7 * 2 },
    { id: 11, timeName: '4month', timeLength: 86400000 * (30 + 31) * 2 },
  ]
}





function getGata() {
  return [
    {
      "type": 1,
      "timestamp": 1642572585500,
      "servertimestamp": 1642572582024.716,
      "value": 51.10620880126953,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572585500,
      "servertimestamp": 1642572585610.0933,
      "value": 9.074650764465332,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572589000,
      "servertimestamp": 1642572589086.7085,
      "value": 43.912471771240234,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572592500,
      "servertimestamp": 1642572592562.2815,
      "value": 3.887532949447632,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572596000,
      "servertimestamp": 1642572596033.3303,
      "value": 8.912689208984375,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572599500,
      "servertimestamp": 1642572599512.1255,
      "value": 69.17440795898438,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572603000,
      "servertimestamp": 1642572603094.0657,
      "value": 65.84197998046875,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572606500,
      "servertimestamp": 1642572606563.6467,
      "value": 70.86714172363281,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572610000,
      "servertimestamp": 1642572610040.7668,
      "value": 21.669069290161133,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572613500,
      "servertimestamp": 1642572613508.9492,
      "value": 91.23290252685547,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572617000,
      "servertimestamp": 1642572617085.747,
      "value": 49.487998962402344,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572620500,
      "servertimestamp": 1642572620571.225,
      "value": 56.23311996459961,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572624000,
      "servertimestamp": 1642572624043.5024,
      "value": 14.48822021484375,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572627500,
      "servertimestamp": 1642572627522.8608,
      "value": 11.442449569702148,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572631000,
      "servertimestamp": 1642572631001.5293,
      "value": 9.014439582824707,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572634500,
      "servertimestamp": 1642572634577.8877,
      "value": 67.26953887939453,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    },
    {
      "type": 1,
      "timestamp": 1642572638000,
      "servertimestamp": 1642572638043.4844,
      "value": 10.707169532775879,
      "status": 0,
      "address": "AGENT.OBJECTS.IVE50.Drawworks.HookSpeed",
      "description": {
        "de": "HookSpeed",
        "en": "HookSpeed",
        "ru": "HookSpeed"
      }
    }
  ]
}




