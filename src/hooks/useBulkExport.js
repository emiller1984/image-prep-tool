import { useState, useCallback, useRef } from 'react'
import JSZip from 'jszip'
import exportImage, { dataUrlToBlob } from '../utils/exportImage'
import resolvePresetDimensions from '../utils/resolvePresetDimensions'
import generateFilename from '../utils/generateFilename'

export default function useBulkExport() {
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: 'idle' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const abortRef = useRef(false)

  const startExport = useCallback(async (images, presets, transforms) => {
    abortRef.current = false
    setError(null)
    setResult(null)

    // Build the list of all combinations
    const combinations = []
    for (const img of images) {
      for (const preset of presets) {
        const key = `${img.id}::${preset.id}`
        const { targetWidth, targetHeight } = resolvePresetDimensions(preset, img.image)
        combinations.push({
          key,
          image: img.image,
          imageName: img.info.name,
          preset: { ...preset, width: targetWidth, height: targetHeight },
          transforms: transforms[key],
        })
      }
    }

    setProgress({ current: 0, total: combinations.length, phase: 'rendering' })

    const zip = new JSZip()
    const usedNames = new Set()

    for (let i = 0; i < combinations.length; i++) {
      if (abortRef.current) return

      const combo = combinations[i]
      const fileType = combo.preset.fileType || 'jpeg'
      const compression = combo.preset.compression ?? 0.92

      // Render using existing exportImage utility
      const dataUrl = exportImage(
        combo.image,
        combo.preset.width,
        combo.preset.height,
        combo.transforms,
        fileType,
        compression
      )

      const blob = dataUrlToBlob(dataUrl)
      const filename = generateFilename(combo.imageName, combo.preset, usedNames)
      usedNames.add(filename)

      zip.file(filename, blob)

      setProgress({ current: i + 1, total: combinations.length, phase: 'rendering' })

      // Yield to the main thread between renders for UI responsiveness
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    if (abortRef.current) return

    // Generate ZIP
    setProgress(prev => ({ ...prev, phase: 'zipping' }))

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const zipFilename = `bulk-export-${new Date().toISOString().slice(0, 10)}.zip`
      setResult({ blob: zipBlob, filename: zipFilename, size: zipBlob.size })
      setProgress(prev => ({ ...prev, phase: 'done' }))
    } catch (err) {
      setError(`ZIP generation failed: ${err.message}`)
      setProgress(prev => ({ ...prev, phase: 'error' }))
    }
  }, [])

  const abort = useCallback(() => { abortRef.current = true }, [])

  const reset = useCallback(() => {
    setProgress({ current: 0, total: 0, phase: 'idle' })
    setResult(null)
    setError(null)
  }, [])

  return { progress, result, error, startExport, abort, reset }
}
