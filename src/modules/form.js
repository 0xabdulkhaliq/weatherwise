import { getMatchingLocations, getWeatherData } from "./api"
import {
  activateDashboard,
  activateIntroForm,
  instantiate404Prompt
} from "./ui"

function instantiateForm() {
  const inputElements = document.querySelectorAll("input")
  const formElements = document.querySelectorAll("form")
  const listWrappers = document.querySelectorAll(".form__suggestions-list")
  const submitBtns = document.querySelectorAll(".form__submit-btn")

  const updateDebounce = debounce((locationQuery, listWrapper, submitBtn) => {
    if (locationQuery.length < 3)
      return toggleLoadingAnimationForSubmitBtn(submitBtn, "off")

    getMatchingLocations(locationQuery)
      .then((data) => {
        displaySuggestions(data, listWrapper)
      })
      .finally(() => toggleLoadingAnimationForSubmitBtn(submitBtn, "off"))
  })

  formElements.forEach((el) =>
    el.addEventListener("submit", (e) => e.preventDefault())
  )

  inputElements.forEach((el) =>
    el.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      const submitBtn = e.target.parentElement.children[3]
      const listWrapper = e.target.nextElementSibling

      toggleLoadingAnimationForSubmitBtn(submitBtn, "on")
      submitBtnStateModifier(submitBtn, "active")

      query !== ""
        ? updateDebounce(query, listWrapper, submitBtn)
        : hideSuggestions(listWrapper)
    })
  )

  listWrappers.forEach((el) =>
    el.addEventListener("click", (e) => {
      e.target.classList.add("active")

      const latitude = e.target.getAttribute("data-lat")
      const longitude = e.target.getAttribute("data-long")
      const inputElement =
        e.target.parentElement.parentElement.previousElementSibling

      const submitBtn = e.target.parentElement.parentElement.nextElementSibling

      setTimeout(() => {
        try {
          inputElement.value = e.target.textContent

          inputElement.setAttribute("data-lat", latitude)
          inputElement.setAttribute("data-long", longitude)

          hideSuggestions(e.target.parentElement.parentElement, "dontHideBtn")
          submitBtnStateModifier(submitBtn, "active")
        } catch (error) {}
      }, 500)
    })
  )

  submitBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const inputField = e.target.parentElement.children[1]
      const locationToSearch = inputField.value

      const latitude = inputField.getAttribute("data-lat")
      const longitude = inputField.getAttribute("data-long")

      if (locationToSearch === "") return
      if (!navigator.onLine)
        return instantiate404Prompt("Oops! You're currently offline")

      toggleLoadingAnimationForSubmitBtn(e.target, "on")

      getWeatherData(latitude, longitude)
        .then(() => activateDashboard())
        .catch((error) => {})
        .finally(() => {
          hideSuggestions(e.target.parentElement.children[2])
          inputField.value = ""
          toggleLoadingAnimationForSubmitBtn(e.target, "off")
        })
    })
  )
}

function debounce(callback, delay = 1000) {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

function hideSuggestions(listWrapperEl, canHideSubmitBtn) {
  listWrapperEl.style.opacity = 0
  activateIntroForm(listWrapperEl, "off")
  canHideSubmitBtn === undefined
    ? submitBtnStateModifier(listWrapperEl.nextElementSibling, "disabled")
    : null

  setTimeout(() => {
    listWrapperEl.innerHTML = ""
  }, 600)
}

function displaySuggestions(suggestionsData, listWrapperEl) {
  listWrapperEl.innerHTML = ""

  const suggestionsList = Object.keys(suggestionsData)

  if (suggestionsList.length !== 0) {
    suggestionsList.forEach((suggestion) => {
      const listItem = document.createElement("li")
      const latitude = suggestionsData[suggestion][0]
      const longitude = suggestionsData[suggestion][1]

      listItem.innerHTML = `<button data-lat=${latitude} data-long=${longitude}>${suggestion}</button>`
      listWrapperEl.appendChild(listItem)
    })

    activateIntroForm(listWrapperEl, "on")
  }

  setTimeout(() => {
    listWrapperEl.style.opacity = 1
    submitBtnStateModifier(listWrapperEl.nextElementSibling, "disabled")
  }, 100)
}

function submitBtnStateModifier(submitBtn, state) {
  state === "active"
    ? submitBtn.classList.add("form__submit-btn--active")
    : submitBtn.classList.remove("form__submit-btn--active")
}

function toggleLoadingAnimationForSubmitBtn(submitBtn, state) {
  state === "on"
    ? (submitBtn.style =
        "background: 0% / cover url(./images/icons/loader.svg); animation: 2s spin infinite;")
    : (submitBtn.style = "")
}

export { instantiateForm }
