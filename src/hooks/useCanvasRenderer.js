import { useCallback } from 'react'

/**
 * Provides a render function to draw an image onto a canvas with transforms.
 */
export default function useCanvasRenderer() {
  const render = useCallback((canvas, image, transforms, targetWidth, targetHeight) => {
    if (!canvas || !image) return
    const ctx = canvas.getContext('2d')
    const displayScale = canvas.width / targetWidth

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.save()

    // Translate to canvas center + user offset
    ctx.translate(
      (canvas.width / 2) + (transforms.offsetX * displayScale),
      (canvas.height / 2) + (transforms.offsetY * displayScale)
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
  }, [])

  return { render }
}
