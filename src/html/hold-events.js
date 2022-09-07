(() => {
  // Initialize the optimizely variable if it is not available yet and store it in a locally scoped variable
  let optimizely = window.optimizely = window.optimizely || []

  // Function to initialize
  const initialize = () => {
    // Now that window.optimizely has been Initialized; store it in our locally scoped variable again
    optimizely = window.optimizely

    // Util library of Optimizely
    const utils = optimizely.get('utils')
    const observerOptions = {
      timeout: 5000 // Stop observer after 5 seconds to avoid slowing down the page
    }

    // Add click listener on Allow button
    utils.observeSelector('#allow', (allowButton) => {
      allowButton.addEventListener('click', () => {
        // Set cookie to remember data sharing is allowed
        document.cookie = 'optimizelyAllowDataSharing=true; Max-Age=15780000'
        // Allow events to be send again
        optimizely.push({
          type: 'sendEvents'
        })
      })
    }, observerOptions)

    // Add click listener on Deny button
    utils.observeSelector('#deny', (denyButton) => {
      denyButton.addEventListener('click', () => {
        // Delete Optimizely data sharing cookie
        document.cookie = 'optimizelyAllowDataSharing=false; Max-Age=-1'
        // Prevent events from being send to Optimizely
        optimizely.push({
          type: 'holdEvents'
        })
      })
    }, observerOptions)
  }

  // Prevent events from being send to Optimizely if the data sharing cookie is not set
  if (!document.cookie.includes('optimizelyAllowDataSharing=true')) {
    optimizely.push({
      type: 'holdEvents'
    })
  }

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