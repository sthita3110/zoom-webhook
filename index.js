require('dotenv').config();
console.log('ZOOM_WEBHOOK_SECRET_TOKEN:', process.env.ZOOM_WEBHOOK_SECRET_TOKEN);
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 4002

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200)
  res.send(`Zoom Webhook sample successfully running.`)
})

app.post('/webhook', async (req, res) => {
  console.log('Webhook request received:', req.body); // Add this line
  var response

  console.log(req.headers)
  console.log(req.body)

  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`

  const hashForVerify = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(message).digest('hex')

  const signature = `v0=${hashForVerify}`

  if (req.headers['x-zm-signature'] === signature) {
    if (req.body.event === 'endpoint.url_validation') {
      const hashForValidate = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(req.body.payload.plainToken).digest('hex')

      response = {
        message: {
          plainToken: req.body.payload.plainToken,
          encryptedToken: hashForValidate
        },
        status: 200
      }

      console.log(response.message)

      res.status(response.status)
      res.json(response.message)
    } else {
      response = { message: 'Authorized request to Zoom Webhook sample.', status: 200 }

      console.log(response.message)

      res.status(response.status)
      res.json(response)

      const hevoUrl = process.env.HEVO_WEBHOOK_URL
      if (hevoUrl) {
        try {
          await axios.post(hevoUrl, req.body)
          console.log('Webhook successfully forwarded to Hevo')
        } catch (error) {
          console.error('Error forwarding to Hevo:', error.message)
        }
      } else {
        console.error('HEVO_WEBHOOK_URL is not set in environment variables')
      }
    }
  } else {
    response = { message: 'Unauthorized request to Zoom Webhook sample.', status: 401 }

    console.log(response.message)

    res.status(response.status)
    res.json(response)
  }
})

app.listen(port, () => console.log(`Zoom Webhook sample listening on port ${port}!`))