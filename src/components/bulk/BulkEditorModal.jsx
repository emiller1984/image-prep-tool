import { useState, useEffect, useCallback } from 'react'
import EditorCanvas from '../EditorCanvas'
import EditorControls from '../EditorControls'
import { calculateFitScale, calculateFillScale } from '../../utils/calculateTransforms'

export default function BulkEditorModal({ image, preset, transforms, onApply, onClose }) {
  const { width: targetWidth, height: targetHeight } = preset
  const [localTransforms, setLocalTransforms] = useState(transforms)

  // Prevent background scrolling
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keyboard: Escape closes the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [onClose])

  // Pan/zoom handlers matching Editor.jsx patterns
  const handlePan = useCallback((dx, dy) => {
    setLocalTransforms(prev => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy,
    }))
  }, [])

  const handleZoom = useCallback((delta) => {
    setLocalTransforms(prev => {
      const fitScale = calculateFitScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, prev.rotation)
      const minScale = fitScale * 0.05
      const maxScale = fitScale * 10
      const newScale = Math.min(maxScale, Math.max(minScale, prev.scale + delta * fitScale))
      return { ...prev, scale: newScale }
    })
  }, [image, targetWidth, targetHeight])

  // Keyboard shortcuts for pan/zoom/rotate (matching Editor.jsx)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') return // Handled above
      const step = e.shiftKey ? 10 : 1
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlePan(-step, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          handlePan(step, 0)
          break
        case 'ArrowUp':
          e.preventDefault()
          handlePan(0, -step)
          break
        case 'ArrowDown':
          e.preventDefault()
          handlePan(0, step)
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoom(0.05)
          break
        case '-':
          e.preventDefault()
          handleZoom(-0.05)
          break
        case 'r':
        case 'R':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            setLocalTransforms(prev => {
              let newRotation = prev.rotation + 90
              if (newRotation > 180) newRotation -= 360
              return { ...prev, rotation: newRotation }
            })
          }
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePan, handleZoom])

  const handleResetToFill = () => {
    const fillScale = calculateFillScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, 0)
    setLocalTransforms({
      scale: fillScale,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      flipH: false,
      flipV: false,
    })
  }

  const handleApply = () => {
    onApply(localTransforms)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-surface rounded-xl shadow-xl max-w-[800px] w-full mx-4 max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Edit: {preset.name} ({targetWidth}&times;{targetHeight})
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary transition-colors rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <EditorCanvas
          image={image}
          transforms={localTransforms}
          targetWidth={targetWidth}
          targetHeight={targetHeight}
          onPan={handlePan}
          onZoom={handleZoom}
        />

        <EditorControls
          image={image}
          transforms={localTransforms}
          setTransforms={setLocalTransforms}
          targetWidth={targetWidth}
          targetHeight={targetHeight}
        />

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={handleResetToFill}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-red-50 hover:border-red-200 hover:text-error text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            Reset to Auto-Fill
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Apply &amp; Close
            </button>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-text-faint text-center">
          Shortcuts: Arrow keys to nudge (Shift+Arrow for 10px) &middot; +/- to zoom &middot; R to rotate 90&deg; &middot; Esc to close
        </div>
      </div>
    </div>
  )
}
