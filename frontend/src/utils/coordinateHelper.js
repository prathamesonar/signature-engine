export function convertToPdfCoords(x, y, width, height, scale, pdfDims) {
  const A4_WIDTH_POINTS = 595
  const A4_HEIGHT_POINTS = 842
  
  const browserWidth = pdfDims.width
  const browserHeight = pdfDims.height
  
  const xScaleFactor = A4_WIDTH_POINTS / browserWidth
  const yScaleFactor = A4_HEIGHT_POINTS / browserHeight
  
  const pdfX = x * xScaleFactor
  const pdfY = A4_HEIGHT_POINTS - ((y + height) * yScaleFactor)
  const pdfWidth = width * xScaleFactor
  const pdfHeight = height * yScaleFactor
  
  return {
    x: pdfX,
    y: pdfY,
    width: pdfWidth,
    height: pdfHeight
  }
}