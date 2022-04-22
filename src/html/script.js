(() => {
  const LOCAL_STORAGE_KEY_VISITOR_ID = 'bringYourOwnVisitorId'
  const LOCAL_STORAGE_KEY_CONSENT = 'didConsent'

  // Initialize the optimizely variable if it is not available yet and store it in a locally scoped variable
  let optimizely = window.optimizely = window.optimizely || []

  const setVisitorId = () => {
    // Try to find visitor ID in Local Storage
    let id = window.localStorage.getItem(LOCAL_STORAGE_KEY_VISITOR_ID)

    if (!id) {
      // Create a random ID if it does not exist yet
      id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
      window.localStorage.setItem(LOCAL_STORAGE_KEY_VISITOR_ID, id)
    }
  }

  const getConsent = () => {
    // Fetch choice from LocalStorage
    return window.localStorage.getItem(LOCAL_STORAGE_KEY_CONSENT)
  }

  const setConsent = (didConsent) => {
    // Persist the choice in LocalStorage
    window.localStorage.setItem(LOCAL_STORAGE_KEY_CONSENT, didConsent)
    return didConsent
  }

  const toggleEvents = (didConsent) => {
    // LocalStorage only works with string, hence the string comparison
    const type = (didConsent === 'true') ? 'sendEvents' : 'holdEvents'

    // Either hold or send events based on the choice
    optimizely.push({ type })
  }

  const customEvent = (name, revenue) => {
    // Push revenue to Optimizely
    optimizely.push({
      type: 'event',
      eventName: name,
      tags: {
        revenue: window.Math.round(revenue * 100) // Convert to cents
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

  const intialize = () => {
    // Now that window.optimizely has been Initialized; store it in our locally scoped variable again
    optimizely = window.optimizely

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

  // Set a custom visitor idea
  setVisitorId()

  // Only run the part of the code that depends on the optimizely variable after initialization
  optimizely.push({
    type: 'addListener',
    filter: {
      type: 'lifecycle',
      name: 'initialized'
    },
    handler: intialize
  })
})()
