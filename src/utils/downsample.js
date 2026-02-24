/**
 * Pre-scale an image using stepped downsampling for high-quality results.
 *
 * The Canvas API uses bilinear interpolation which produces jagged artifacts
 * when downscaling by large factors. This function scales the image down in
 * multiple 50% steps (similar to Photoshop's bicubic approach), producing
 * much smoother results.
 *
 * Returns an offscreen canvas containing the pre-scaled image.
 */
export default function downsample(image, targetDrawWidth, targetDrawHeight) {
  let currentWidth = image.naturalWidth
  let currentHeight = image.naturalHeight
  const targetW = Math.round(targetDrawWidth)
  const targetH = Math.round(targetDrawHeight)

  // Only downsample if we're actually scaling down
  if (targetW >= currentWidth && targetH >= currentHeight) {
    return null // No pre-scaling needed, caller should draw directly
  }

  // Step 1: Draw the full-size image onto a working canvas
  let srcCanvas = document.createElement('canvas')
  srcCanvas.width = currentWidth
  srcCanvas.height = currentHeight
  let srcCtx = srcCanvas.getContext('2d')
  srcCtx.imageSmoothingEnabled = true
  srcCtx.imageSmoothingQuality = 'high'
  srcCtx.drawImage(image, 0, 0)

  // Step 2: Halve dimensions repeatedly until within 2x of the target
  while (currentWidth / 2 > targetW && currentHeight / 2 > targetH) {
    const halfW = Math.round(currentWidth / 2)
    const halfH = Math.round(currentHeight / 2)

    const stepCanvas = document.createElement('canvas')
    stepCanvas.width = halfW
    stepCanvas.height = halfH
    const stepCtx = stepCanvas.getContext('2d')
    stepCtx.imageSmoothingEnabled = true
    stepCtx.imageSmoothingQuality = 'high'
    stepCtx.drawImage(srcCanvas, 0, 0, halfW, halfH)

    srcCanvas = stepCanvas
    currentWidth = halfW
    currentHeight = halfH
  }

  // Step 3: Final scale to exact target dimensions
  const finalCanvas = document.createElement('canvas')
  finalCanvas.width = targetW
  finalCanvas.height = targetH
  const finalCtx = finalCanvas.getContext('2d')
  finalCtx.imageSmoothingEnabled = true
  finalCtx.imageSmoothingQuality = 'high'
  finalCtx.drawImage(srcCanvas, 0, 0, targetW, targetH)

  return finalCanvas
}
