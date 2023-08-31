import { makeApiCall } from "./api"
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

  formElements.forEach((el) =>
    el.addEventListener("submit", (e) => e.preventDefault())
  )

  inputElements.forEach((el) =>
    el.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()

      query !== ""
        ? displaySuggestions(customFilter(query), e.target.nextElementSibling)
        : hideSuggestions(e.target.nextElementSibling)
    })
  )

  listWrappers.forEach((el) =>
    el.addEventListener("click", (e) => {
      e.target.classList.add("active")

      setTimeout(() => {
        try {
          e.target.parentElement.parentElement.previousElementSibling.value =
            e.target.textContent
          hideSuggestions(e.target.parentElement.parentElement, "dontHideBtn")
        } catch (error) {}
      }, 500)
    })
  )

  submitBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const locationToSearch = e.target.parentElement.children[1].value

      if (locationToSearch === "") return
      if (!navigator.onLine)
        return instantiate404Prompt("Oops! You're currently offline")

      toggleLoadingAnimationForSubmitBtn(e.target)

      makeApiCall(locationToSearch)
        .then(() => activateDashboard())
        .catch((error) => {})
        .finally(() => {
          hideSuggestions(e.target.parentElement.children[2])
          e.target.parentElement.children[1].value = ""
          toggleLoadingAnimationForSubmitBtn(e.target)
        })
    })
  )
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

function displaySuggestions(suggestionsList, listWrapperEl) {
  listWrapperEl.innerHTML = ""

  suggestionsList.forEach((suggestion) => {
    const listItem = document.createElement("li")

    listItem.innerHTML = `<button>${suggestion}</button>`
    listWrapperEl.appendChild(listItem)
  })

  activateIntroForm(listWrapperEl, "on")

  setTimeout(() => {
    listWrapperEl.style.opacity = 1
    submitBtnStateModifier(listWrapperEl.nextElementSibling, "active")
  }, 100)
}

function customFilter(query) {
  const matches = []

  for (const item of data) {
    if (item.substr(0, query.length).toLowerCase() == query) {
      matches.push(item)
    }
  }

  return matches
}

function submitBtnStateModifier(submitBtn, state) {
  state === "active"
    ? submitBtn.classList.add("form__submit-btn--active")
    : submitBtn.classList.remove("form__submit-btn--active")
}

function toggleLoadingAnimationForSubmitBtn(submitBtn) {
  submitBtn.classList.toggle("form__submit-btn--loading")
}

export { instantiateForm }
