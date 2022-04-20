(() => {
  // Initialize the optimizely variable if it is not available yet
  const optimizely = window.optimizely = window.optimizely || []

  // Amazon CloudWatch Synthetics Canaries use a unique User Agent.
  const isCanary = window.navigator.userAgent.includes('CloudWatchSynthetics')

  // Push a custom attribute indicating whether the visitor is a canary or not.
  optimizely.push({
    type: 'user',
    attributes: {
      isCanary: String(isCanary)
    }
  })

  console.log(`Pushed custom attribute isCanary=${isCanary}`)
})()
