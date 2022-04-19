(() => {
  // Verify whether Optimizely has been initialized
  if (typeof window.optimizely !== 'object') {
    console.error('Optimizely not found')
    return
  }

  // Load data from Optimizely
  const optimizely = window.optimizely

  // Push a custom attribute indicating whether the visitor is a canary or not
  // Amazon CloudWatch Synthetics Canaries use a unique User Agent
  // TODO: store this in project JavaScript
  const isCanary = window.navigator.userAgent.includes('CloudWatchSynthetics')
  optimizely.push({
    type: 'user',
    attributes: {
      isCanary: String(isCanary)
    }
  })

  // Function to send revenue event
  const purchase = () => {
    optimizely.push({
      type: 'event',
      eventName: 'purchase',
      tags: {
        revenue: 2195 // €21.95
      }
    })
  }

  // Function to select buttons and add listeners to them
  const addButtonListeners = () => {
    document.querySelector('button#purchase').onclick = purchase
  }

  // Wait until the DOM is loaded before adding button listeners
  document.addEventListener('DOMContentLoaded', addButtonListeners)
})()
