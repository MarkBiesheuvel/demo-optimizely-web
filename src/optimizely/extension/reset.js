/* global extension */
const element = document.getElementById(`optimizely-extension-${extension.$instance}`)

if (element) {
  element.parentElement.removeChild(element)
}
