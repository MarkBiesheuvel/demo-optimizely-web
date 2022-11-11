(() => {
  // Initialize the optimizely variable if it is not available yet and store it in a locally scoped variable
  let optimizely = window.optimizely = window.optimizely || []

  /**
   * Send an Optimizely event when a visitor is on the current page for more than `threshold` seconds.
   */
  const timeOnPage = ({ threshold }) => {
    // A simple setTimeout to trigger the time_on_page event
    setTimeout(() => {

      // If the threshold is adjusted, this will be recorded under a different event name
      // Currently there is a single event for all pages, if desired, the page name could be included in the event name
      const eventName = `time_on_page_${threshold}s`

      // TODO: Add desired tags here
      const tags = {}

      // Send event
      optimizely.push({
        type: 'event',
        eventName,
        tags
      })
    }, threshold * 1000)
  }

  /**
   * Send an Optimizely event when a visitor is on the entire site for more than `threshold` seconds
   * To persist a timer between multiple page views a variable in LocalStorage is used.
   */
  const timeOnSite = ({ threshold, interval, storageKey, reset }) => {
    // Initialization of time on site timer
    // Currently the timer is not reset at the start of a new session, this can be implemented if desired
    const value = localStorage.getItem(storageKey)
    let timer = value === null ? 0 :  parseInt(value)

    // If the threshold has already been exceeded, exit the function
    if (threshold <= timer) {
      return
    }

    // Regularly increment a value on LocalStorage in order to persist the timer across multiple page views
    const intervalId = setInterval(() => {

      // Increment timer with elapsed time
      timer += interval

      // Persists timer in LocalStorage
      localStorage.setItem(storageKey, timer.toString())

      // If the threshold is exceeded ...
      if (threshold <= timer) {

        // If the threshold is adjusted, this will be recorded under a different event name
        const eventName = `time_on_site_${threshold}s`

        // TODO: Add desired tags here
        const tags = {}

        // Send event
        optimizely.push({
          type: 'event',
          eventName,
          tags
        })

        // Disable timer
        clearInterval(intervalId)
      }
    }, interval * 1000)
  }

  /**
   * Send custom attributes to Optimizely
   */
  const userAttributes = (attributes) => {
    optimizely.push({
      type: 'user',
      attributes
    })
  }

  // Function to initialize
  const initialize = () => {
    // Now that window.optimizely has been Initialized; store it in our locally scoped variable again
    optimizely = window.optimizely

    const utils = optimizely.get('utils')

    // Look for any buttons with the data-action="buy" property and add click listeners on them
    utils.observeSelector('[data-action="buy"]', (button) => {
      // Retrieve price from data-* attribute
      const price = parseInt(button.dataset.price)
      // Add click listener
      button.addEventListener('click', () => {
        // Send custom event with revenue data to Optimizely
        optimizely.push({
          type: 'event',
          eventName: 'purchase',
          tags: {
            revenue: price
          }
        })
      })
    }, {
      timeout: 5000 // Stop observer after 5 seconds to avoid slowing down the page
    })
  }

  // Push isCanary as a custom attribute
  userAttributes({
    subscriptionPlan: 'premium',
    theme: 'lightMode'
  })

  // Activate event senders
  timeOnPage({
    threshold: 20 // 20 seconds on single page
  })
  timeOnSite({
    threshold: 120, // 120 seconds on entire site
    interval: 2, // How accurate (in seconds) should the timer be
    storageKey: 'customer_data$$time_on_site',  // Key used to read/write to LocalStorage
  })

  // Only run the part of the code that depends on the optimizely variable after initialization
  optimizely.push({
    type: 'addListener',
    filter: {
      type: 'lifecycle',
      name: 'initialized'
    },
    handler: initialize
  })
})()
