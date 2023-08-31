function getFormattedLocation(locationObject) {
  return `${locationObject.name}, ${locationObject.region} - ${locationObject.country}`
}

function getFormattedDate(currentDate) {
  const date = new Date(currentDate)

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  return `${days[date.getDay()]}, ${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`
}

function getFormattedTime(localtime) {
  return localtime.split(" ")[1]
}

function getFormattedImage(weather, format, moment) {
  let imageUrl

  if (moment === undefined) {
    imageUrl = `Weather=${weather}, Moment=Day.${format}`
  } else {
    moment.is_day ? (moment = "Day") : (moment = "Night")
    imageUrl = `Weather=${weather}, Moment=${moment}.${format}`
  }

  return format === "svg"
    ? `./images/icons/${imageUrl}`
    : `./images/backgrounds/${imageUrl}`
}

function getMaxTemperature(data, isForecast) {
  return isForecast
    ? `${getCeiledValue(data.day.maxtemp_c)}°c`
    : `${getCeiledValue(data.temp_c)}°c`
}

function getMinTemperature(forecastObject) {
  return `${getCeiledValue(forecastObject.day.mintemp_c)}°c`
}

function getTemperatureRange(maxTemperature, forecastObject) {
  return `${getMinTemperature(forecastObject)} / ${maxTemperature}`
}

function getCeiledValue(value) {
  return Math.ceil(value)
}

function getWeatherConditionUsingCode(code) {
  const newIcons = {
    Clear: [1000],
    Rain: [
      1063, 1069, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1237, 1240,
      1243, 1246, 1249, 1252, 1261, 1264
    ],
    Storm: [1087, 1273, 1276, 1279, 1282],
    Cloudy: [
      1006, 1009, 1030, 1072, 1117, 1135, 1147, 1150, 1153, 1168, 1171, 1204,
      1207
    ],
    "Few Clouds": [1003],
    Snow: [1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258]
  }
  const matchedWeatherCondition = Object.keys(newIcons).find((key) =>
    newIcons[key].includes(code)
  )

  return matchedWeatherCondition
}

export {
  getFormattedLocation,
  getFormattedDate,
  getFormattedTime,
  getFormattedImage,
  getMaxTemperature,
  getMinTemperature,
  getTemperatureRange,
  getCeiledValue,
  getWeatherConditionUsingCode
}
