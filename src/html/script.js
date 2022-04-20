(() => {
  // Initialize the optimizely variable if it is not available yet
  const optimizely = window.optimizely = window.optimizely || []

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
