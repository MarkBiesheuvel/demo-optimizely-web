(() => {
  // Store in locally scoped variable. This improves minifying
  const optimizely = window.optimizely

  // Optimizely needs to be initialized in order to use the Utils lib
  if (typeof optimizely !== 'object') {
    console.error('Optimizely not found')
    return
  }

  const utils = optimizely.get('utils')

  const addClickListener = (selector, callback) => {
    // Wait until element is available in DOM
    utils.waitForElement(selector).then((element) => {
      // Add click listener to button
      element.onclick = callback
    })
  }

  addClickListener('button#purchase', () => {
    // Push revenue to Optimizely
    optimizely.push({
      type: 'event',
      eventName: 'purchase',
      tags: {
        revenue: 2195 // €21.95
      }
    })
  })

  addClickListener('button#consent-true', () => {
    // Store this consent in LocalStorage
    window.localStorage.setItem('didConsent', 'true')

    // Send all events that were queued
    optimizely.push({
      type: 'sendEvents'
    })
  })

  addClickListener('button#consent-false', () => {
    // Store this consent in LocalStorage
    window.localStorage.setItem('didConsent', 'false')

    // Disable Optimizely tracking
    optimizely.push({
      type: 'disable',
      scope: 'tracking'
    })
  })

  addClickListener('button#consent-null', () => {
    // Store this consent in LocalStorage
    window.localStorage.setItem('didConsent', null)

    // Disable Optimizely tracking
    optimizely.push({
      type: 'holdEvents'
    })
  })
})()
