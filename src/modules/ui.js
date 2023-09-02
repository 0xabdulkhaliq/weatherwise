import {
  getFormattedLocation,
  getFormattedDate,
  getFormattedTime,
  getFormattedImage,
  getMaxTemperature,
  getMinTemperature,
  getTemperatureRange,
  getCeiledValue,
  getWeatherConditionUsingCode
} from "./weatherUtils"

function updateStatisticsDashboard(weatherData) {
  const userLocation = document.querySelector(".meta-wrapper__location p")
  const dateMeta = document.querySelector(".meta-wrapper__location time")
  const timeMeta = document.querySelector(".meta-wrapper__time time")
  const temperature = document.querySelector(".current__temp")
  const temperatureRange = document.querySelector(".range__min-to-max")
  const weatherCondition = document.querySelector(".weather-condition__string")
  const weatherIllustrationImage = document.querySelector(
    ".stat-data__illustration"
  )
  const statisticsDashboard = document.querySelector(
    ".header-container__statistics"
  )

  userLocation.textContent = getFormattedLocation(weatherData.location)

  dateMeta.textContent = getFormattedDate(weatherData.location.localtime)

  timeMeta.textContent = getFormattedTime(weatherData.location.localtime)

  temperature.textContent = getMaxTemperature(weatherData.current, true)

  temperatureRange.textContent = getTemperatureRange(
    temperature.textContent,
    weatherData.daily,
    0
  )

  weatherCondition.textContent = getWeatherConditionUsingCode(
    weatherData.current.condition.code
  )

  weatherIllustrationImage.src = getFormattedImage(
    weatherCondition.textContent,
    "svg",
    weatherData.current
  )

  statisticsDashboard.style.backgroundImage = `url("${getFormattedImage(
    weatherCondition.textContent,
    "png",
    weatherData.current
  )}")`
}

function updateGeneralStatistics(weatherData) {
  const statValues = {
    thermalSensation: `${getCeiledValue(weatherData.current.feelslike_c)}°c`,
    rainProbability: `${weatherData.daily.precipitation_probability_max[0]}%`,
    windSpeed: `${getCeiledValue(weatherData.current.wind_kph)} Km/h`,
    humidity: `${weatherData.current.humidity}%`,
    uvIndex: weatherData.current.uv
  }

  const keysForStatValues = Object.keys(statValues)

  const generalStatisticsList = document.querySelector(
    ".overview-section__list"
  )

  for (let i = 0; i < generalStatisticsList.children.length; i++) {
    generalStatisticsList.children[i].children[1].textContent =
      statValues[keysForStatValues[i]]
  }
}

function updatePredictions(weatherData) {
  const futurePredictions = weatherData.daily
  const listWrapper = document.querySelector(".predictions__list")

  listWrapper.innerHTML = ""

  for (let i = 1; i < 6; i++) {
    const listItem = document.createElement("li")
    const currentDate = futurePredictions["time"][i]
    const formattedDay = getFormattedDate(currentDate).split(",")[0]
    const weatherCode = futurePredictions["weathercode"][i]
    const weatherCondition = getWeatherConditionUsingCode(weatherCode)

    listItem.innerHTML = `<span class="list__day">
                            ${formattedDay.substring(0, 3)}
                              <span class="day__trimmed-part">
                                ${formattedDay.substring(3)}
                              </span>
                            </span>
                            <img src="${getFormattedImage(
                              weatherCondition,
                              "svg"
                            )}" alt="">

                            <p class="list__stats">
                                <span class="stats__weather">
                                    <span class="weather__sr-only">Weather Condition</span>
                                    ${weatherCondition}
                                </span>

                                <span class="list__temp-range">
                                <span class="temp-range__sr-only">Temperature Range</span>
                                    ${getMaxTemperature(
                                      futurePredictions,
                                      false,
                                      i
                                    )}
                                <abbr title="to" class="sr-only">-</abbr>
                                <span class="temp-range__to">
                                    ${getMinTemperature(futurePredictions, i)}
                                </span>
                                </span>
                            </p>`

    listWrapper.appendChild(listItem)
  }
}

function instantiate404Prompt(error) {
  const errorPrompt = document.querySelector(".main__error-prompter")
  const errorConveyingText = errorPrompt.querySelector(
    ".error-prompter__heading"
  )

  errorConveyingText.textContent = error
  errorPrompt.classList.toggle("main__error-prompter--active")

  setTimeout(() => {
    errorPrompt.classList.toggle("main__error-prompter--active")
  }, 4000)
}

function activateDashboard() {
  const mainElement = document.querySelector("main")

  mainElement.classList.add("main--dashboard-active")

  deactivateDashboard(mainElement)
}

function activateIntroForm(listWrapper, state) {
  const introFormSection = listWrapper.parentElement.parentElement

  if (introFormSection.classList[0] !== "main__intro") return

  state === "on"
    ? introFormSection.classList.add("main__intro--form-activated")
    : (introFormSection.className = "main__intro")
}

function deactivateDashboard(mainElement) {
  const homeBtn = document.querySelector(".header-wrapper__header")

  homeBtn.addEventListener("click", () => {
    mainElement.classList = ""
  })
}

function instantiateUIChanges(jsonResponse) {
  updateStatisticsDashboard(jsonResponse)
  updateGeneralStatistics(jsonResponse)
  updatePredictions(jsonResponse)
}

export {
  instantiateUIChanges,
  instantiate404Prompt,
  activateDashboard,
  activateIntroForm
}
