/**
 * Resolve the effective target dimensions for a preset.
 * For 'widthOnly' presets, targetHeight is derived from the image's natural aspect ratio.
 * For 'fixed' presets (or any preset without sizeMode), returns preset.width and preset.height as-is.
 */
export default function resolvePresetDimensions(preset, image) {
  if (preset.sizeMode === 'widthOnly' && image) {
    const targetWidth = preset.width
    const targetHeight = Math.round(preset.width * (image.naturalHeight / image.naturalWidth))
    return { targetWidth, targetHeight }
  }
  return { targetWidth: preset.width, targetHeight: preset.height }
}
