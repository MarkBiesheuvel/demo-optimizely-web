/* global extension */
const utils = window.optimizely.get('utils')

utils.waitForElement('body')
  .then((elem) => {
    elem.insertAdjacentHTML('afterbegin', extension.$html)
  })
