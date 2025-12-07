import { useState } from 'react'

export default function Canvas({ fields, selected, onSelect, onUpdate, pdfDims }) {
  const [dragging, setDragging] = useState(null)
  const [resizing, setResizing] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e, fieldId, isResize = false) => {
    e.stopPropagation()
    onSelect(fieldId)
    
    if (isResize) {
      setResizing(fieldId)
    } else {
      setDragging(fieldId)
      const field = fields.find(f => f.id === fieldId)
      setOffset({
        x: e.clientX - field.x,
        y: e.clientY - field.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (dragging) {
      const field = fields.find(f => f.id === dragging)
      onUpdate(dragging, {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      })
    }

    if (resizing) {
      const field = fields.find(f => f.id === resizing)
      onUpdate(resizing, {
        width: Math.max(50, e.clientX - field.x),
        height: Math.max(50, e.clientY - field.y)
      })
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
    setResizing(null)
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {fields.map(field => (
        <div
          key={field.id}
          className={`field-box ${selected === field.id ? 'selected' : ''}`}
          style={{
            left: `${field.x}px`,
            top: `${field.y}px`,
            width: `${field.width}px`,
            height: `${field.height}px`
          }}
          onMouseDown={(e) => handleMouseDown(e, field.id)}
        >
          {field.label}
          {selected === field.id && (
            <div
              className="resize-handle"
              onMouseDown={(e) => handleMouseDown(e, field.id, true)}
            />
          )}
        </div>
      ))}
    </div>
  )
}