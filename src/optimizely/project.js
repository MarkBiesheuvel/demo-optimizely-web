(() => {
  // Amazon CloudWatch Synthetics Canaries use a unique User Agent.
  // TODO: expand bot detection
  const isCanary = window.navigator.userAgent.includes('CloudWatchSynthetics')

  // Initialize the optimizely variable if it is not available yet
  const optimizely = window.optimizely = window.optimizely || []

  // Automatically consent for canaries, but fetch from LocalStorage for users
  const didConsent = isCanary ? 'true' : window.localStorage.getItem('didConsent')

  // LocalStorage only works with string, hence the string comparison
  if (didConsent === 'true') {
    // Do nothing
  } else if (didConsent === 'false') {
    // Disable Optimizely tracking
    optimizely.push({
      type: 'disable',
      scope: 'tracking'
    })
  } else {
    // No value specified
    optimizely.push({
      type: 'holdEvents'
    })
  }

  // Push a custom attribute indicating whether the visitor is a canary or not.
  optimizely.push({
    type: 'user',
    attributes: {
      isCanary: String(isCanary)
    }
  })
})()
