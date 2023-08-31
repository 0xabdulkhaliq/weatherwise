import { instantiateUIChanges, instantiate404Prompt } from "./ui"

async function getWeatherData(latitude, longitude) {
  try {
    const response = await fetch(
      `http://localhost:3000/weather?latitude=${latitude}&longitude=${longitude}` // Backend, to secure API Key
    )

    if (response.ok) {
      const jsonData = await response.json()

      instantiateUIChanges(jsonData)

      return new Promise((resolve) => setTimeout(resolve, 1500))
    }
    throw new Error()
  } catch (error) {
    instantiate404Prompt("Location not found")
    return Promise.reject(error)
  }
}

async function getMatchingLocations(query) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`
    )
    const jsonData = await response.json()

    const location = jsonData["results"]

    const matches = {}

    if (location !== undefined) {
      location.forEach((loc) => {
        matches[
          `${loc.name}, ${loc.admin1 === undefined ? loc.country : loc.admin1}`
        ] = [loc.latitude, loc.longitude]
      })
    }

    return matches
  } catch (error) {
    return {}
  }
}

export { getWeatherData, getMatchingLocations }
