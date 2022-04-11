(() => {
  if (typeof window.optimizely !== 'object') {
    console.log('Optimizely not found')
    return
  }

  const optimizely = window.optimizely
  const data = optimizely.get('data')

  for (const experimentId in data.experiments) {
    optimizely.push({
      type: 'bucketVisitor',
      experimentId: experimentId,
      variationIndex: 1
    })
  }

  console.log('Done')
})()
