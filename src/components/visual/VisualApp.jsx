import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import JSZip from 'jszip'
import { dedicatedTemplate } from '../../config/templates'
import DedicatedTemplate from './DedicatedTemplate'
import exportImage, { dataUrlToBlob } from '../../utils/exportImage'
import { calculateFitScale, calculateFillScale } from '../../utils/calculateTransforms'

export default function VisualApp() {
  const [slotImages, setSlotImages] = useState({})
  const [slotFitModes, setSlotFitModes] = useState({}) // 'fit' | 'fill' per slot, default 'fit'
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 })
  const abortRef = useRef(false)

  const filledCount = Object.keys(slotImages).length
  const totalSlots = dedicatedTemplate.slots.length

  const handleImageDrop = useCallback((slotId, file) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setSlotImages(prev => {
        // Revoke old URL if replacing
        if (prev[slotId]) {
          URL.revokeObjectURL(prev[slotId].objectUrl)
        }
        return {
          ...prev,
          [slotId]: { file, objectUrl, image: img },
        }
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
    }
    img.src = objectUrl
  }, [])

  const handleFitModeChange = useCallback((slotId, mode) => {
    setSlotFitModes(prev => ({ ...prev, [slotId]: mode }))
  }, [])

  const handleImageRemove = useCallback((slotId) => {
    setSlotImages(prev => {
      if (prev[slotId]) {
        URL.revokeObjectURL(prev[slotId].objectUrl)
      }
      const next = { ...prev }
      delete next[slotId]
      return next
    })
  }, [])

  const handleExport = useCallback(async () => {
    abortRef.current = false
    setExporting(true)

    const filledSlots = dedicatedTemplate.slots.filter(slot => slotImages[slot.id])
    setExportProgress({ current: 0, total: filledSlots.length })

    const zip = new JSZip()

    for (let i = 0; i < filledSlots.length; i++) {
      if (abortRef.current) break

      const slot = filledSlots[i]
      const { image } = slotImages[slot.id]
      const fitMode = slotFitModes[slot.id] || 'fit'

      const scale = fitMode === 'fill'
        ? calculateFillScale(image.naturalWidth, image.naturalHeight, slot.exportWidth, slot.exportHeight)
        : calculateFitScale(image.naturalWidth, image.naturalHeight, slot.exportWidth, slot.exportHeight)

      const transforms = {
        scale,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        flipH: false,
        flipV: false,
      }

      const dataUrl = exportImage(
        image,
        slot.exportWidth,
        slot.exportHeight,
        transforms,
        'jpeg',
        0.92
      )

      const blob = dataUrlToBlob(dataUrl)
      zip.file(`${slot.id}.jpg`, blob)

      setExportProgress({ current: i + 1, total: filledSlots.length })

      // Yield to main thread for UI responsiveness
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    if (!abortRef.current) {
      try {
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const filename = `visual-export-${new Date().toISOString().slice(0, 10)}.zip`

        // Trigger download
        const url = URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('ZIP generation failed:', err)
      }
    }

    setExporting(false)
  }, [slotImages, slotFitModes])

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-[760px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-primary hover:text-blue-600 transition-colors"
          >
            &larr; Back
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-text-primary">Visual Mode</h1>
            <p className="text-xs text-text-muted">
              {filledCount} of {totalSlots} images placed
            </p>
          </div>
          <div className="w-[60px]" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Template area */}
      <div className="overflow-x-auto py-8">
        <div className="min-w-[620px] px-4">
          <DedicatedTemplate
            slotImages={slotImages}
            slotFitModes={slotFitModes}
            onImageDrop={handleImageDrop}
            onImageRemove={handleImageRemove}
            onFitModeChange={handleFitModeChange}
          />
        </div>
      </div>

      {/* Sticky export bar */}
      <div className="sticky bottom-0 z-10 bg-surface border-t border-border">
        <div className="max-w-[760px] mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            {filledCount === 0
              ? 'Drag images onto the placeholders above'
              : `${filledCount} image${filledCount !== 1 ? 's' : ''} ready to export`
            }
          </p>
          <button
            onClick={handleExport}
            disabled={filledCount === 0 || exporting}
            className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting
              ? `Exporting ${exportProgress.current}/${exportProgress.total}...`
              : `Export All (${filledCount})`
            }
          </button>
        </div>
      </div>
    </div>
  )
}
