/* global extension */
const extensionElement = document.getElementById(`optimizely-extension-${extension.$instance}`)

if (extensionElement) {
  extensionElement.parentElement.removeChild(extensionElement)
}
