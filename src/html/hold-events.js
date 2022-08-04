(() => {
  // Initialize the optimizely variable if it is not available yet and store it in a locally scoped variable
  let optimizely = window.optimizely = window.optimizely || []

  // Function to initialize
  const initialize = () => {
    // Now that window.optimizely has been Initialized; store it in our locally scoped variable again
    optimizely = window.optimizely

    const utils = optimizely.get('utils')

    utils.observeSelector('#sendEvents', (button) => {
      // Add click listener
      button.addEventListener('click', () => {
        // Allow events to be send again
        optimizely.push({
          type: 'sendEvents'
        })
      })
    }, {
      timeout: 5000 // Stop observer after 5 seconds to avoid slowing down the page
    })
  }

  // Prevent Optimizely from sending events back to logx.optimizely.com
  optimizely.push({
    type: 'holdEvents'
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