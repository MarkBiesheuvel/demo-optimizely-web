(() => {
  // Verify whether Optimizely has been initialized
  if (typeof window.optimizely !== 'object') {
    console.error('Optimizely not found')
    return
  }

  // Load data from Optimizely
  const optimizely = window.optimizely
  const data = optimizely.get('data')

  // Enable logging
  optimizely.push({
    type: 'log',
    level: 'INFO'
  })

  // Function to put a user into a particular experiment
  const bucketVisitor = (variationIndex) => {
    for (const experimentId in data.experiments) {
      optimizely.push({
        type: 'bucketVisitor',
        experimentId: experimentId,
        variationIndex: variationIndex
      })
    }
    window.location.reload()
  }

  // Function to send addToCart event
  const addToCart = () => {
    optimizely.push({
      type: 'event',
      eventName: 'addToCart'
    })
  }

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
    const buttonOriginal = document.querySelector('button#original')
    const buttonVariation1 = document.querySelector('button#variation1')
    const buttonAddToCart = document.querySelector('button#addtocart')
    const buttonPurchase = document.querySelector('button#purchase')

    buttonOriginal.onclick = () => {
      bucketVisitor(0)
    }
    buttonVariation1.onclick = () => {
      bucketVisitor(1)
    }
    buttonAddToCart.onclick = () => {
      addToCart()
    }
    buttonPurchase.onclick = () => {
      purchase()
    }
  }

  // Wait until the DOM is loaded before adding button listeners
  document.addEventListener('DOMContentLoaded', addButtonListeners)
})()
