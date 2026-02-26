import { useState, useCallback, useEffect } from 'react'
import EditorCanvas from './EditorCanvas'
import EditorControls from './EditorControls'
import { calculateFitScale } from '../utils/calculateTransforms'

export default function Editor({ image, preset, onExport, onBack }) {
  const { width: targetWidth, height: targetHeight } = preset

  const getInitialTransforms = useCallback(() => {
    const fitScale = calculateFitScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, 0)
    return {
      scale: fitScale,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      flipH: false,
      flipV: false,
    }
  }, [image, targetWidth, targetHeight])

  const [transforms, setTransforms] = useState(getInitialTransforms)

  // Reset transforms if the image or preset changes
  useEffect(() => {
    setTransforms(getInitialTransforms())
  }, [getInitialTransforms])

  const handlePan = useCallback((dx, dy) => {
    setTransforms(prev => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy,
    }))
  }, [])

  const handleZoom = useCallback((delta) => {
    setTransforms(prev => {
      const fitScale = calculateFitScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, prev.rotation)
      const minScale = fitScale * 0.05
      const maxScale = fitScale * 10
      const newScale = Math.min(maxScale, Math.max(minScale, prev.scale + delta * fitScale))
      return { ...prev, scale: newScale }
    })
  }, [image, targetWidth, targetHeight])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
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
            setTransforms(prev => {
              let newRotation = prev.rotation + 90
              if (newRotation > 180) newRotation -= 360
              return { ...prev, rotation: newRotation }
            })
          }
          break
        case 'Escape':
          e.preventDefault()
          setTransforms(getInitialTransforms())
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePan, handleZoom, getInitialTransforms])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
          Edit Image &mdash; {preset.name} ({targetWidth}&times;{targetHeight}{preset.sizeMode === 'widthOnly' ? ', auto height' : ''})
        </h2>
        <button
          onClick={onBack}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-2 py-1"
        >
          &larr; Change Size
        </button>
      </div>

      <EditorCanvas
        image={image}
        transforms={transforms}
        targetWidth={targetWidth}
        targetHeight={targetHeight}
        onPan={handlePan}
        onZoom={handleZoom}
      />

      <EditorControls
        image={image}
        transforms={transforms}
        setTransforms={setTransforms}
        targetWidth={targetWidth}
        targetHeight={targetHeight}
      />

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => onExport(transforms)}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Export Image
        </button>
      </div>

      <div className="mt-3 text-[11px] text-text-faint text-center">
        Shortcuts: Arrow keys to nudge (Shift+Arrow for 10px) &middot; +/- to zoom &middot; R to rotate 90&deg; &middot; Esc to reset
      </div>
    </div>
  )
}
