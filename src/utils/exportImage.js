/**
 * Render the image to a canvas at the exact target dimensions and return a JPEG blob.
 */
export default function exportImage(image, targetWidth, targetHeight, transforms) {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, targetWidth, targetHeight)

  // Apply transforms: translate → rotate → flip → draw
  ctx.save()
  ctx.translate(targetWidth / 2 + transforms.offsetX, targetHeight / 2 + transforms.offsetY)
  ctx.rotate((transforms.rotation * Math.PI) / 180)
  ctx.scale(transforms.flipH ? -1 : 1, transforms.flipV ? -1 : 1)
  ctx.drawImage(
    image,
    (-image.naturalWidth * transforms.scale) / 2,
    (-image.naturalHeight * transforms.scale) / 2,
    image.naturalWidth * transforms.scale,
    image.naturalHeight * transforms.scale
  )
  ctx.restore()

  const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
  return dataUrl
}

/**
 * Convert a data URL to a Blob.
 */
export function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',')
  const mime = parts[0].match(/:(.*?);/)[1]
  const binary = atob(parts[1])
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  return new Blob([array], { type: mime })
}
