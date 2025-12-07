import { useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

export default function PDFViewer({ onScale, onDims }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const initPdf = async () => {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
        
        const pdf = await pdfjsLib.getDocument('/sample.pdf').promise
        const page = await pdf.getPage(1)
        
        const scale = 1.5
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        
        if (!canvas) return
        
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        const renderTask = page.render({
          canvasContext: context,
          viewport: viewport
        })
        
        await renderTask.promise
        
        onScale(scale)
        onDims({ width: viewport.width, height: viewport.height })
      } catch (error) {
        console.error('PDF load error:', error)
      }
    }

    initPdf()
  }, [onScale, onDims])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
