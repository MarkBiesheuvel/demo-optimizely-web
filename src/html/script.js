(() => {
  // Initialize the optimizely variable if it is not available yet
  const optimizely = window.optimizely = window.optimizely || []

  const getConsent = () => {
    // Fetch choice from LocalStorage
    return window.localStorage.getItem('didConsent')
  }

  const setConsent = (didConsent) => {
    // Persist the choice in LocalStorage
    window.localStorage.setItem('didConsent', didConsent)
    return didConsent
  }

  const toggleEvents = (didConsent) => {
    // LocalStorage only works with string, hence the string comparison
    const type = (didConsent === 'true') ? 'sendEvents' : 'holdEvents'

    // Either hold or send events based on the choice
    optimizely.push({type})
  }

  const customEvent = (name, revenue) => {
    // Push revenue to Optimizely
    optimizely.push({
      type: 'event',
      eventName: name,
      tags: {
        revenue: (revenue * 100).toFixed()
      }
    })
  }

  const customAttribute = (key, value) => {
    // Push a custom attribute
    optimizely.push({
      type: 'user',
      attributes: {
        [key]: String(value)
      }
    })
  }

  const foo = () => {
    const utils = optimizely.get('utils')

    // This function depends on utils
    const addClickListener = (selector, callback) => {
      // Wait until element is available in DOM
      utils.waitForElement(selector).then((element) => {
        // Add click listener to button
        element.onclick = callback
      })
    }

    addClickListener('button#purchase', () => {
      customEvent('purchase', 21.95)
    })

    addClickListener('button#consent-true', () => {
      toggleEvents(setConsent('true'))
    })

    addClickListener('button#consent-false', () => {
      toggleEvents(setConsent('false'))
    })

    addClickListener('button#consent-null', () => {
      toggleEvents(setConsent(null))
    })
  }

  // Amazon CloudWatch Synthetics Canaries use a unique User Agent.
  // TODO: expand bot detection
  const isCanary = window.navigator.userAgent.includes('CloudWatchSynthetics')

  // Push isCanary as a custom attribute
  customAttribute('isCanary', isCanary)

  // Either send or hold events based on tracking consent (only if user is not a robot and thus human)
  if (!isCanary) {
    toggleEvents(getConsent())
  }

  // Only run the part of the code that depends on the optimizely variable after initialization
  optimizely.push({
    type: 'addListener',
    filter: {
      type: 'lifecycle',
      name: 'pageActivated'
    },
    handler: foo
  })
})()
