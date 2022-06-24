(() => {
  // Initialize the optimizely variable if it is not available yet and store it in a locally scoped variable
  let optimizely = window.optimizely = window.optimizely || []

  // Function to push revenue to Optimizely
  const customEvent = (name, revenue) => {
    optimizely.push({
      type: 'event',
      eventName: name,
      tags: {
        revenue: window.Math.round(revenue * 100) // Convert to cents
      }
    })
  }

  // Function to push a custom attributes
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

    // TODO: custom event on new website
  }

  // Push isCanary as a custom attribute
  userAttributes({
    subscriptionPlan: 'premium',
    theme: 'lightMode'
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
