/* global extension */
const utils = window.optimizely.get('utils')

utils.waitForElement('#target')
  .then((element) => {
    element.insertAdjacentHTML('beforeend', extension.$html)
  })
