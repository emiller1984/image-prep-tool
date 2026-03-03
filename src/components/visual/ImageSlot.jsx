import { useState, useCallback } from 'react'

/**
 * A single image drop target within the email template.
 * Shows a placeholder when empty, or a center-cropped preview when filled.
 */
export default function ImageSlot({ slot, imageData, fitMode = 'fit', onImageDrop, onImageRemove, onFitModeChange }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onImageDrop(slot.id, file)
      }
    }
  }, [slot.id, onImageDrop])

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        onImageDrop(slot.id, file)
      }
    }
    input.click()
  }, [slot.id, onImageDrop])

  const handleRemove = useCallback((e) => {
    e.stopPropagation()
    onImageRemove(slot.id)
  }, [slot.id, onImageRemove])

  const aspectRatio = slot.renderWidth / slot.renderHeight

  const handleFitModeToggle = useCallback((e, mode) => {
    e.stopPropagation()
    onFitModeChange(slot.id, mode)
  }, [slot.id, onFitModeChange])

  if (imageData) {
    return (
      <div
        className="relative group overflow-hidden bg-white"
        style={{
          width: `${slot.renderWidth}px`,
          aspectRatio: aspectRatio,
          maxWidth: '100%',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img
          src={imageData.objectUrl}
          alt={slot.label}
          className={`w-full h-full ${fitMode === 'fill' ? 'object-cover' : 'object-contain'}`}
          draggable={false}
        />

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove image"
        >
          &times;
        </button>

        {/* Fit / Fill toggle */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex rounded overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity shadow">
          <button
            onClick={(e) => handleFitModeToggle(e, 'fit')}
            className={`px-2 py-0.5 text-[10px] font-semibold ${fitMode === 'fit' ? 'bg-primary text-white' : 'bg-black/50 text-white/80 hover:bg-black/70'}`}
          >
            Fit
          </button>
          <button
            onClick={(e) => handleFitModeToggle(e, 'fill')}
            className={`px-2 py-0.5 text-[10px] font-semibold ${fitMode === 'fill' ? 'bg-primary text-white' : 'bg-black/50 text-white/80 hover:bg-black/70'}`}
          >
            Fill
          </button>
        </div>

        {dragOver && (
          <div className="absolute inset-0 bg-blue-500/30 border-2 border-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-blue-500 px-2 py-1 rounded">Replace</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        flex flex-col items-center justify-center cursor-pointer transition-colors
        ${dragOver
          ? 'bg-blue-50 border-blue-400'
          : 'bg-gray-100 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }
        border-2 border-dashed rounded
      `}
      style={{
        width: `${slot.renderWidth}px`,
        aspectRatio: aspectRatio,
        maxWidth: '100%',
      }}
    >
      <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-xs font-medium text-gray-500 text-center px-2">{slot.label}</span>
      <span className="text-[10px] text-gray-400 mt-0.5">{slot.exportWidth} &times; {slot.exportHeight}</span>
    </div>
  )
}
