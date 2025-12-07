const fieldTypes = [
    'signature',
    'text',
    'date',
    'checkbox',
    'radio',
    'image'
  ]
  
  export default function FieldPalette({ onDragStart }) {
    return (
      <div className="palette">
        <div className="palette-title">Add Fields</div>
        {fieldTypes.map(type => (
          <button
            key={type}
            className="field-button"
            draggable
            onDragStart={() => onDragStart(type)}
          >
            + {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    )
  }