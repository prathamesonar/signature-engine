const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  originalHash: String,
  finalHash: String,
  fileName: String,
  fieldsCount: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('PdfRecord', recordSchema)