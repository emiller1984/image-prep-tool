/**
 * Calculate the scale factor to fit the image within the target frame.
 */
export function calculateFitScale(imageWidth, imageHeight, targetWidth, targetHeight, rotationDeg = 0) {
  const { effectiveW, effectiveH } = getEffectiveDimensions(imageWidth, imageHeight, rotationDeg)
  return Math.min(targetWidth / effectiveW, targetHeight / effectiveH)
}

/**
 * Calculate the scale factor to fill the target frame completely (no white space).
 */
export function calculateFillScale(imageWidth, imageHeight, targetWidth, targetHeight, rotationDeg = 0) {
  const { effectiveW, effectiveH } = getEffectiveDimensions(imageWidth, imageHeight, rotationDeg)
  return Math.max(targetWidth / effectiveW, targetHeight / effectiveH)
}

/**
 * Get the effective bounding box dimensions of a rotated image.
 */
function getEffectiveDimensions(width, height, rotationDeg) {
  const rad = (rotationDeg * Math.PI) / 180
  const effectiveW = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad))
  const effectiveH = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad))
  return { effectiveW, effectiveH }
}
