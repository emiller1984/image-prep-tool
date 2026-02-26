import { useState, useCallback, useMemo } from 'react'
import StepIndicator from './StepIndicator'
import PresetSelector from './PresetSelector'
import ImageUploader from './ImageUploader'
import Editor from './Editor'
import ExportResult from './ExportResult'
import useImageLoader from '../hooks/useImageLoader'
import usePresets from '../hooks/usePresets'
import resolvePresetDimensions from '../utils/resolvePresetDimensions'

const STEPS = { SELECT: 1, EDIT: 2, EXPORT: 3 }

export default function MainApp() {
  const [step, setStep] = useState(STEPS.SELECT)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [exportTransforms, setExportTransforms] = useState(null)
  const { image, imageInfo, error, loading, loadImage, clearImage } = useImageLoader()
  const { presets, loading: presetsLoading } = usePresets()

  const resolvedPreset = useMemo(() => {
    if (!selectedPreset || !image) return selectedPreset
    if (selectedPreset.sizeMode !== 'widthOnly') return selectedPreset
    const { targetWidth, targetHeight } = resolvePresetDimensions(selectedPreset, image)
    return { ...selectedPreset, width: targetWidth, height: targetHeight }
  }, [selectedPreset, image])

  const handlePresetSelect = useCallback((preset) => {
    if (step === STEPS.EDIT && selectedPreset?.id !== preset.id) {
      if (!window.confirm('Changing the preset will reset your current edits. Continue?')) {
        return
      }
    }
    setSelectedPreset(preset)
  }, [step, selectedPreset])

  const handleImageLoad = useCallback((file) => {
    loadImage(file)
  }, [loadImage])

  const handleContinueToEditor = useCallback(() => {
    if (selectedPreset && image) {
      setStep(STEPS.EDIT)
    }
  }, [selectedPreset, image])

  const handleExport = useCallback((transforms) => {
    setExportTransforms(transforms)
    setStep(STEPS.EXPORT)
  }, [])

  const handleBackToEditor = useCallback(() => {
    setStep(STEPS.EDIT)
  }, [])

  const handleBackToSelect = useCallback(() => {
    setStep(STEPS.SELECT)
  }, [])

  const handleNewImage = useCallback(() => {
    clearImage()
    setSelectedPreset(null)
    setExportTransforms(null)
    setStep(STEPS.SELECT)
  }, [clearImage])

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[760px] mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-[26px] font-bold text-text-primary text-center mb-2">
          Email Image Resizer
        </h1>
        <p className="text-sm text-text-muted text-center mb-6">
          Resize and position images for email templates
        </p>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          {step === STEPS.SELECT && (
            <div className="space-y-6">
              {presetsLoading ? (
                <div className="text-sm text-text-muted text-center py-8">Loading presets...</div>
              ) : (
                <PresetSelector
                  presets={presets}
                  selectedPreset={selectedPreset}
                  onSelect={handlePresetSelect}
                />
              )}

              <ImageUploader
                onImageLoad={handleImageLoad}
                imageInfo={imageInfo}
                error={error}
                loading={loading}
              />

              {selectedPreset && image && (
                <div className="flex justify-end">
                  <button
                    onClick={handleContinueToEditor}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Continue to Editor
                  </button>
                </div>
              )}
            </div>
          )}

          {step === STEPS.EDIT && image && resolvedPreset && (
            <Editor
              image={image}
              preset={resolvedPreset}
              onExport={handleExport}
              onBack={handleBackToSelect}
            />
          )}

          {step === STEPS.EXPORT && image && resolvedPreset && exportTransforms && (
            <ExportResult
              image={image}
              imageInfo={imageInfo}
              preset={resolvedPreset}
              transforms={exportTransforms}
              onBackToEditor={handleBackToEditor}
              onNewImage={handleNewImage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
