const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const pdfRoutes = require('./routes/pdf')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const mongoUri = process.env.MONGO_URI
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB not available'))
}

app.use('/sign-pdf', pdfRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})