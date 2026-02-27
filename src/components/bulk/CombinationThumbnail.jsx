import { useRef, useEffect } from 'react'
import downsample from '../../utils/downsample'

export default function CombinationThumbnail({ image, transforms, targetWidth, targetHeight, isEdited, onClick }) {
  const canvasRef = useRef(null)

  // Thumbnail display size: max 160px wide, proportional height
  const maxThumbWidth = 160
  const displayScale = Math.min(maxThumbWidth / targetWidth, 1)
  const displayWidth = Math.round(targetWidth * displayScale)
  const displayHeight = Math.round(targetHeight * displayScale)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image || !transforms) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.scale(dpr, dpr)

    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    // Pre-scale using stepped downsampling
    const drawW = image.naturalWidth * transforms.scale * displayScale
    const drawH = image.naturalHeight * transforms.scale * displayScale
    const preScaled = downsample(image, drawW, drawH)
    const source = preScaled || image
    const sourceW = preScaled ? preScaled.width : drawW
    const sourceH = preScaled ? preScaled.height : drawH

    ctx.save()
    ctx.translate(
      displayWidth / 2 + transforms.offsetX * displayScale,
      displayHeight / 2 + transforms.offsetY * displayScale
    )
    ctx.rotate((transforms.rotation * Math.PI) / 180)
    ctx.scale(transforms.flipH ? -1 : 1, transforms.flipV ? -1 : 1)
    ctx.drawImage(source, -sourceW / 2, -sourceH / 2, sourceW, sourceH)
    ctx.restore()
  }, [image, transforms, displayWidth, displayHeight, displayScale])

  return (
    <button
      onClick={onClick}
      className="group relative rounded-lg border-2 border-border bg-surface hover:border-primary hover:shadow-md transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 overflow-hidden"
      title="Click to edit"
    >
      <canvas ref={canvasRef} className="block" />
      {isEdited && (
        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-primary text-white text-[9px] font-semibold rounded-full">
          Edited
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 rounded-full p-1.5 shadow-sm">
            <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}
