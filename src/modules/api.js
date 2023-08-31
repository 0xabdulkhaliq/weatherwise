import { instantiateUIChanges, instantiate404Prompt } from "./ui"

async function makeApiCall(location) {
  try {
    const response = await fetch(
      `http://localhost:3000/weather?location=${location}` // Backend, to secure API Key
    )
    console.log(response)
    if (response.ok) {
      const jsonData = await response.json()

      console.log(jsonData)

      instantiateUIChanges(jsonData)

      return new Promise((resolve) => setTimeout(resolve, 1500))
    }
    throw new Error()
  } catch (error) {
    console.log(error)
    instantiate404Prompt("Location not found")
    return Promise.reject(error)
  }
}

export { makeApiCall }
