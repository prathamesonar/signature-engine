import { useState, useRef, useEffect } from 'react'
import PDFViewer from '../components/PDFViewer'
import FieldPalette from '../components/FieldPalette'
import Canvas from '../components/Canvas'
import { convertToPdfCoords } from '../utils/coordinateHelper'

export default function Editor() {
  const [fields, setFields] = useState([])
  const [selected, setSelected] = useState(null)
  const [draggedField, setDraggedField] = useState(null)
  const [pdfScale, setPdfScale] = useState(1)
  const [pdfDims, setPdfDims] = useState({ width: 0, height: 0 })
  const [signature, setSignature] = useState(null)
  const canvasRef = useRef(null)

  const handleFieldDragStart = (fieldType) => {
    setDraggedField(fieldType)
  }

  const handleCanvasDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedField) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      return
    }

    const newField = {
      id: Date.now(),
      type: draggedField,
      x: x,
      y: y,
      width: 120,
      height: 40,
      label: draggedField.charAt(0).toUpperCase() + draggedField.slice(1),
      value: ''
    }

    setFields([...fields, newField])
    setDraggedField(null)
    setSelected(newField.id)
  }

  const handleFieldUpdate = (id, updates) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const handleDelete = () => {
    if (selected) {
      setFields(fields.filter(f => f.id !== selected))
      setSelected(null)
    }
  }

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSignature(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!signature) {
      alert('Please upload a signature image')
      return
    }

    if (fields.length === 0) {
      alert('Please add at least one field')
      return
    }

    const pdfCoords = fields.map(field => {
      const pdfCoord = convertToPdfCoords(
        field.x,
        field.y,
        field.width,
        field.height,
        pdfScale,
        pdfDims
      )
      return {
        ...field,
        pdfCoord
      }
    })

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      console.log('Sending to:', apiUrl + '/sign-pdf')
      console.log('Fields:', pdfCoords)

      const response = await fetch(`${apiUrl}/sign-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature: signature,
          fields: pdfCoords
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'signed_document.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert('PDF signed and downloaded successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Error signing PDF: ' + error.message)
    }
  }

  return (
    <div className="editor-container">
      <FieldPalette onDragStart={handleFieldDragStart} />
      
      <div className="main-content">
        <div className="toolbar">
          <span>Drag fields onto the PDF</span>
          <button onClick={handleSubmit}>Sign PDF</button>
          {selected && <button onClick={handleDelete}>Delete</button>}
        </div>
        
        <div className="pdf-container">
          <div 
            className="pdf-wrapper" 
            ref={canvasRef}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
          >
            <PDFViewer 
              onScale={setPdfScale}
              onDims={setPdfDims}
            />
            <Canvas
              fields={fields}
              selected={selected}
              onSelect={setSelected}
              onUpdate={handleFieldUpdate}
              pdfDims={pdfDims}
            />
          </div>
        </div>
      </div>

      <div className="properties-panel">
        <div className="upload-section">
          <label className="property-label">Upload Signature</label>
          <input
            type="file"
            id="sig-upload"
            className="file-input"
            accept="image/*"
            onChange={handleSignatureUpload}
          />
          <button 
            className="upload-button"
            onClick={() => document.getElementById('sig-upload').click()}
          >
            Choose Image
          </button>
          {signature && (
            <img src={signature} className="signature-preview" alt="Signature" />
          )}
        </div>

        {selected && (
          <div>
            <div className="property-group">
              <label className="property-label">Field Type</label>
              <input
                type="text"
                className="property-input"
                disabled
                value={fields.find(f => f.id === selected)?.type || ''}
              />
            </div>
            <div className="property-group">
              <label className="property-label">Field Label</label>
              <input
                type="text"
                className="property-input"
                value={fields.find(f => f.id === selected)?.label || ''}
                onChange={(e) => handleFieldUpdate(selected, { label: e.target.value })}
              />
            </div>
            <div className="property-group">
              <label className="property-label">Position X</label>
              <input
                type="number"
                className="property-input"
                value={Math.round(fields.find(f => f.id === selected)?.x || 0)}
                onChange={(e) => handleFieldUpdate(selected, { x: parseInt(e.target.value) })}
              />
            </div>
            <div className="property-group">
              <label className="property-label">Position Y</label>
              <input
                type="number"
                className="property-input"
                value={Math.round(fields.find(f => f.id === selected)?.y || 0)}
                onChange={(e) => handleFieldUpdate(selected, { y: parseInt(e.target.value) })}
              />
            </div>
            <div className="property-group">
              <label className="property-label">Width</label>
              <input
                type="number"
                className="property-input"
                value={Math.round(fields.find(f => f.id === selected)?.width || 0)}
                onChange={(e) => handleFieldUpdate(selected, { width: parseInt(e.target.value) })}
              />
            </div>
            <div className="property-group">
              <label className="property-label">Height</label>
              <input
                type="number"
                className="property-input"
                value={Math.round(fields.find(f => f.id === selected)?.height || 0)}
                onChange={(e) => handleFieldUpdate(selected, { height: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}