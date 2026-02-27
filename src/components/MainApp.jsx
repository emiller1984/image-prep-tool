import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [exportTransforms, setExportTransforms] = useState(null)
  const { image, imageInfo, error, loading, loadImage, clearImage } = useImageLoader()
  const { presets, loading: presetsLoading } = usePresets()

  // Derive step from URL search params
  const urlStep = parseInt(searchParams.get('step') || '1', 10)

  // Validate: can't be on step 2/3 without required data
  const step = useMemo(() => {
    if (urlStep === STEPS.EDIT && (!image || !selectedPreset)) return STEPS.SELECT
    if (urlStep === STEPS.EXPORT && (!image || !selectedPreset || !exportTransforms)) return STEPS.SELECT
    if ([STEPS.SELECT, STEPS.EDIT, STEPS.EXPORT].includes(urlStep)) return urlStep
    return STEPS.SELECT
  }, [urlStep, image, selectedPreset, exportTransforms])

  // Fix URL if step was corrected due to missing data
  useEffect(() => {
    if (step !== urlStep) {
      setSearchParams(step === STEPS.SELECT ? {} : { step: String(step) }, { replace: true })
    }
  }, [step, urlStep, setSearchParams])

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
      setSearchParams({ step: '2' })
    }
  }, [selectedPreset, image, setSearchParams])

  const handleExport = useCallback((transforms) => {
    setExportTransforms(transforms)
    setSearchParams({ step: '3' })
  }, [setSearchParams])

  const handleBackToEditor = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleBackToSelect = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleNewImage = useCallback(() => {
    clearImage()
    setSelectedPreset(null)
    setExportTransforms(null)
    setSearchParams({}, { replace: true })
  }, [clearImage, setSearchParams])

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[760px] mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-[26px] font-bold text-text-primary text-center mb-2">
          Email Image Resizer
        </h1>
        <p className="text-sm text-text-muted text-center mb-1">
          Resize and position images for email templates
        </p>
        <div className="text-center mb-6">
          <Link to="/bulk" className="text-sm text-primary hover:text-blue-600 transition-colors">
            Bulk Mode &rarr;
          </Link>
        </div>

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
