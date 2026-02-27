import { EXTENSIONS } from './exportImage'

/**
 * Generate a unique filename for a bulk export ZIP entry.
 * Format: {baseName}_{presetSlug}_{width}x{height}.{ext}
 */
export default function generateFilename(originalName, preset, usedNames) {
  const baseName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  const presetSlug = preset.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  const ext = EXTENSIONS[preset.fileType || 'jpeg'] || 'jpg'

  let candidate = `${baseName}_${presetSlug}_${preset.width}x${preset.height}.${ext}`
  let counter = 2
  while (usedNames.has(candidate)) {
    candidate = `${baseName}_${presetSlug}_${preset.width}x${preset.height}_${counter}.${ext}`
    counter++
  }
  return candidate
}
