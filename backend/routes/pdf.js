const express = require('express')
const { signPdf } = require('../controllers/pdfController')

const router = express.Router()

router.post('/', signPdf)

module.exports = router