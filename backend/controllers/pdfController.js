const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const path = require('path')
const { calculateHash } = require('../utils/hashCalculator')

async function signPdf(req, res) {
  try {
    const { signature, fields } = req.body

    console.log('Received request with', fields ? fields.length : 0, 'fields')

    if (!signature) {
      return res.status(400).json({ error: 'No signature' })
    }

    if (!fields || fields.length === 0) {
      return res.status(400).json({ error: 'No fields' })
    }

    const pdfPath = path.join(__dirname, '../pdfs/sample.pdf')
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(400).json({ error: 'PDF not found' })
    }

    const pdfBytes = fs.readFileSync(pdfPath)
    const originalHash = calculateHash(pdfBytes)

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    for (const field of fields) {
      if (field.type === 'signature') {
        try {
          const sigBase64 = signature.includes(',') ? signature.split(',')[1] : signature
          const sigBuffer = Buffer.from(sigBase64, 'base64')
          
          let sigImage
          try {
            sigImage = await pdfDoc.embedPng(sigBuffer)
          } catch {
            sigImage = await pdfDoc.embedJpg(sigBuffer)
          }

          const x = Math.max(10, Math.min(field.pdfCoord.x, 500))
          const y = Math.max(10, Math.min(field.pdfCoord.y, 800))
          const w = Math.min(field.pdfCoord.width, 150)
          const h = Math.min(field.pdfCoord.height, 80)

          console.log('Drawing signature at:', { x, y, w, h })

          firstPage.drawImage(sigImage, {
            x: x,
            y: y,
            width: w,
            height: h
          })
        } catch (err) {
          console.error('Signature error:', err.message)
        }
      } else if (field.type === 'text') {
        const x = Math.max(10, Math.min(field.pdfCoord.x, 500))
        const y = Math.max(10, Math.min(field.pdfCoord.y, 800))
        firstPage.drawText(field.label || 'Text Field', {
          x: x,
          y: y,
          size: 12,
          color: require('pdf-lib').rgb(0, 0, 0)
        })
      } else if (field.type === 'date') {
        const x = Math.max(10, Math.min(field.pdfCoord.x, 500))
        const y = Math.max(10, Math.min(field.pdfCoord.y, 800))
        const today = new Date().toLocaleDateString()
        firstPage.drawText(today, {
          x: x,
          y: y,
          size: 12,
          color: require('pdf-lib').rgb(0, 0, 0)
        })
      }
    }

    const modifiedPdfBytes = await pdfDoc.save()
    const finalHash = calculateHash(modifiedPdfBytes)

    console.log('Original hash:', originalHash)
    console.log('Final hash:', finalHash)
    console.log('PDF size:', modifiedPdfBytes.length)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="signed_document.pdf"')
    res.setHeader('Content-Length', modifiedPdfBytes.length)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    res.send(Buffer.from(modifiedPdfBytes))

  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { signPdf }