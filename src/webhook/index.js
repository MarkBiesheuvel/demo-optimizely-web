const http = require('https')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const { BUCKET_NAME } = process.env

exports.handler = async (event) => {
  const body = JSON.parse(event.body)
  const url = body.data.cdn_url

  const request = new Promise((resolve, reject) => {
    http.get(url, (response) => {
      const chunks = []

      response.on('data', (chunk) => {
        chunks.push(chunk)
      })

      response.on('end', () => {
        resolve(chunks.join(''))
      })

      response.on('error', (error) => {
        reject(error)
      })
    })
  })

  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: 'optimizely.js',
    Body: await request
  }).promise()

  return {
    statusCode: 200,
    body: 'OK'
  }
}
