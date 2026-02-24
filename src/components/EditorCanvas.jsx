import { useRef, useEffect, useCallback } from 'react'
import useCanvasRenderer from '../hooks/useCanvasRenderer'

export default function EditorCanvas({ image, transforms, targetWidth, targetHeight, onPan, onZoom }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const { render } = useCanvasRenderer()
  const isDraggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  // Calculate display size to fit within the container
  const maxDisplayWidth = 680
  const maxDisplayHeight = 500
  const displayScale = Math.min(
    maxDisplayWidth / targetWidth,
    maxDisplayHeight / targetHeight,
    1 // Don't scale up small presets
  )
  const displayWidth = Math.round(targetWidth * displayScale)
  const displayHeight = Math.round(targetHeight * displayScale)

  // Render canvas on every transform change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    // Use a higher resolution for crisp rendering on retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Clear
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    ctx.save()

    // Translate to center + user offset, scaled to display
    ctx.translate(
      displayWidth / 2 + transforms.offsetX * displayScale,
      displayHeight / 2 + transforms.offsetY * displayScale
    )

    // Rotate
    ctx.rotate((transforms.rotation * Math.PI) / 180)

    // Flip
    ctx.scale(transforms.flipH ? -1 : 1, transforms.flipV ? -1 : 1)

    // Draw image centered at origin
    const drawW = image.naturalWidth * transforms.scale * displayScale
    const drawH = image.naturalHeight * transforms.scale * displayScale
    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH)

    ctx.restore()
  }, [image, transforms, displayWidth, displayHeight, displayScale])

  // Pointer handlers for panning
  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true
    lastPosRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    const dx = (e.clientX - lastPosRef.current.x) / displayScale
    const dy = (e.clientY - lastPosRef.current.y) / displayScale
    lastPosRef.current = { x: e.clientX, y: e.clientY }
    onPan(dx, dy)
  }, [displayScale, onPan])

  const handlePointerUp = useCallback((e) => {
    isDraggingRef.current = false
    e.currentTarget.style.cursor = 'grab'
  }, [])

  // Scroll wheel for zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    onZoom(delta)
  }, [onZoom])

  return (
    <div ref={containerRef} className="flex justify-center">
      <div className="checkerboard rounded-lg p-1 inline-block">
        <canvas
          ref={canvasRef}
          style={{ cursor: 'grab', display: 'block' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        />
        {/* Center crosshair overlay */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ width: displayWidth, height: displayHeight, position: 'relative', marginTop: `-${displayHeight + 4}px`, marginLeft: '4px' }}
        >
          <div className="absolute w-full h-px bg-black/5" />
          <div className="absolute h-full w-px bg-black/5" />
        </div>
      </div>
    </div>
  )
}
