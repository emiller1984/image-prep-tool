import downsample from './downsample'

/**
 * Render the image to a canvas at the exact target dimensions and return a JPEG blob.
 * Uses stepped downsampling for high-quality resampling when scaling down.
 */
export default function exportImage(image, targetWidth, targetHeight, transforms) {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, targetWidth, targetHeight)

  const drawW = image.naturalWidth * transforms.scale
  const drawH = image.naturalHeight * transforms.scale

  // Pre-scale the image using stepped downsampling for quality
  const preScaled = downsample(image, drawW, drawH)
  const source = preScaled || image
  const sourceW = preScaled ? preScaled.width : drawW
  const sourceH = preScaled ? preScaled.height : drawH

  // Apply transforms: translate → rotate → flip → draw
  ctx.save()
  ctx.translate(targetWidth / 2 + transforms.offsetX, targetHeight / 2 + transforms.offsetY)
  ctx.rotate((transforms.rotation * Math.PI) / 180)
  ctx.scale(transforms.flipH ? -1 : 1, transforms.flipV ? -1 : 1)
  ctx.drawImage(source, -sourceW / 2, -sourceH / 2, sourceW, sourceH)
  ctx.restore()

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
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
