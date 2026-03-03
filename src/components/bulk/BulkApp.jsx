import { useReducer, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import BulkStepIndicator from './BulkStepIndicator'
import BulkUploadStep from './BulkUploadStep'
import BulkReviewStep from './BulkReviewStep'
import BulkEditorModal from './BulkEditorModal'
import BulkExportStep from './BulkExportStep'
import usePresets from '../../hooks/usePresets'
import useBulkExport from '../../hooks/useBulkExport'
import { calculateFillScale } from '../../utils/calculateTransforms'
import resolvePresetDimensions from '../../utils/resolvePresetDimensions'

const STEPS = { UPLOAD: 1, REVIEW: 2, EXPORT: 3 }

// --- Reducer ---

const initialState = {
  images: [],
  imagePresetSelections: {},  // { [imageId]: [presetId, ...] }
  transforms: {},
  editedCells: [],
}

function bulkReducer(state, action) {
  switch (action.type) {
    case 'ADD_IMAGES': {
      const { files, defaultPresetIds } = action.payload
      const newEntries = files.map(file => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        image: null,
        info: null,
        loading: true,
        error: null,
      }))
      const newSelections = { ...state.imagePresetSelections }
      for (const entry of newEntries) {
        newSelections[entry.id] = [...defaultPresetIds]
      }
      return { ...state, images: [...state.images, ...newEntries], imagePresetSelections: newSelections }
    }

    case 'IMAGE_LOADED': {
      const { id, image, info } = action.payload
      return {
        ...state,
        images: state.images.map(e =>
          e.id === id ? { ...e, image, info, loading: false } : e
        ),
      }
    }

    case 'IMAGE_LOAD_ERROR': {
      const { id } = action.payload
      return {
        ...state,
        images: state.images.map(e =>
          e.id === id ? { ...e, loading: false, error: 'Failed to load' } : e
        ),
      }
    }

    case 'REMOVE_IMAGE': {
      const id = action.payload
      const entry = state.images.find(e => e.id === id)
      if (entry?.image?.src) URL.revokeObjectURL(entry.image.src)
      const newTransforms = { ...state.transforms }
      const newEdited = [...state.editedCells]
      for (const key of Object.keys(newTransforms)) {
        if (key.startsWith(`${id}::`)) {
          delete newTransforms[key]
        }
      }
      const { [id]: _removed, ...remainingSelections } = state.imagePresetSelections
      return {
        ...state,
        images: state.images.filter(e => e.id !== id),
        transforms: newTransforms,
        editedCells: newEdited.filter(k => !k.startsWith(`${id}::`)),
        imagePresetSelections: remainingSelections,
      }
    }

    case 'TOGGLE_IMAGE_PRESET': {
      const { imageId, presetId } = action.payload
      const current = state.imagePresetSelections[imageId] || []
      const index = current.indexOf(presetId)
      const updated = [...current]
      if (index >= 0) updated.splice(index, 1)
      else updated.push(presetId)
      return {
        ...state,
        imagePresetSelections: { ...state.imagePresetSelections, [imageId]: updated },
      }
    }

    case 'SET_IMAGE_PRESETS': {
      const { imageId, presetIds } = action.payload
      return {
        ...state,
        imagePresetSelections: { ...state.imagePresetSelections, [imageId]: presetIds },
      }
    }

    case 'APPLY_PRESETS_TO_ALL': {
      const presetIds = action.payload
      const newSelections = { ...state.imagePresetSelections }
      for (const img of state.images) {
        if (img.image && !img.loading && !img.error) {
          newSelections[img.id] = [...presetIds]
        }
      }
      return { ...state, imagePresetSelections: newSelections }
    }

    case 'REMOVE_PRESET_FROM_ALL': {
      const presetId = action.payload
      const newSelections = { ...state.imagePresetSelections }
      for (const id of Object.keys(newSelections)) {
        newSelections[id] = newSelections[id].filter(pid => pid !== presetId)
      }
      return { ...state, imagePresetSelections: newSelections }
    }

    case 'INIT_COMBINATIONS': {
      const { allPresets, images, imagePresetSelections } = action.payload
      const presetMap = Object.fromEntries(allPresets.map(p => [p.id, p]))
      const newTransforms = { ...state.transforms }
      for (const img of images) {
        if (!img.image) continue
        const presetIds = imagePresetSelections[img.id] || []
        for (const presetId of presetIds) {
          const preset = presetMap[presetId]
          if (!preset) continue
          const key = `${img.id}::${preset.id}`
          if (newTransforms[key]) continue
          const { targetWidth, targetHeight } = resolvePresetDimensions(preset, img.image)
          const fillScale = calculateFillScale(
            img.image.naturalWidth, img.image.naturalHeight,
            targetWidth, targetHeight, 0
          )
          newTransforms[key] = {
            scale: fillScale,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            flipH: false,
            flipV: false,
          }
        }
      }
      return { ...state, transforms: newTransforms }
    }

    case 'UPDATE_TRANSFORMS': {
      const { key, transforms } = action.payload
      return {
        ...state,
        transforms: { ...state.transforms, [key]: transforms },
        editedCells: state.editedCells.includes(key)
          ? state.editedCells
          : [...state.editedCells, key],
      }
    }

    case 'RESET': {
      state.images.forEach(e => {
        if (e.image?.src) URL.revokeObjectURL(e.image.src)
      })
      return { ...initialState }
    }

    default:
      return state
  }
}

// --- Component ---

export default function BulkApp() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { presets, loading: presetsLoading } = usePresets()
  const [state, dispatch] = useReducer(bulkReducer, initialState)
  const [editingKey, setEditingKey] = useState(null)
  const { progress, result, error: exportError, startExport, reset: resetExport } = useBulkExport()
  const loadingIdsRef = useRef(new Set())
  const defaultPresetIdsRef = useRef([])

  // Step derivation from URL
  const urlStep = parseInt(searchParams.get('step') || '1', 10)
  const loadedImages = useMemo(() => state.images.filter(img => img.image && !img.loading && !img.error), [state.images])

  // Per-image derived values
  const totalCombinations = useMemo(() =>
    loadedImages.reduce((sum, img) => sum + (state.imagePresetSelections[img.id]?.length || 0), 0),
    [loadedImages, state.imagePresetSelections]
  )
  const allAssignedPresetIds = useMemo(() => {
    const ids = new Set()
    for (const presetIds of Object.values(state.imagePresetSelections)) {
      for (const id of presetIds) ids.add(id)
    }
    return ids
  }, [state.imagePresetSelections])
  const allAssignedPresets = useMemo(() =>
    (presets || []).filter(p => allAssignedPresetIds.has(p.id)),
    [presets, allAssignedPresetIds]
  )

  // Validate step
  const step = useMemo(() => {
    if (urlStep === STEPS.REVIEW && (loadedImages.length === 0 || totalCombinations === 0)) return STEPS.UPLOAD
    if (urlStep === STEPS.EXPORT && (loadedImages.length === 0 || totalCombinations === 0)) return STEPS.UPLOAD
    if ([STEPS.UPLOAD, STEPS.REVIEW, STEPS.EXPORT].includes(urlStep)) return urlStep
    return STEPS.UPLOAD
  }, [urlStep, loadedImages.length, totalCombinations])

  // Fix URL if step was corrected
  useEffect(() => {
    if (step !== urlStep) {
      setSearchParams(step === STEPS.UPLOAD ? {} : { step: String(step) }, { replace: true })
    }
  }, [step, urlStep, setSearchParams])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      state.images.forEach(e => {
        if (e.image?.src) URL.revokeObjectURL(e.image.src)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // --- Image loading side effects ---

  const handleAddFiles = useCallback((files) => {
    dispatch({ type: 'ADD_IMAGES', payload: { files, defaultPresetIds: defaultPresetIdsRef.current } })
  }, [])

  // Load images after they're added to state
  useEffect(() => {
    const pending = state.images.filter(e => e.loading && e.file && !e.image && !loadingIdsRef.current.has(e.id))
    pending.forEach(entry => {
      loadingIdsRef.current.add(entry.id)
      const img = new Image()
      const url = URL.createObjectURL(entry.file)
      img.onload = () => {
        loadingIdsRef.current.delete(entry.id)
        dispatch({
          type: 'IMAGE_LOADED',
          payload: {
            id: entry.id,
            image: img,
            info: {
              name: entry.file.name,
              width: img.naturalWidth,
              height: img.naturalHeight,
              size: entry.file.size,
              type: entry.file.type,
            },
          },
        })
      }
      img.onerror = () => {
        loadingIdsRef.current.delete(entry.id)
        URL.revokeObjectURL(url)
        dispatch({ type: 'IMAGE_LOAD_ERROR', payload: { id: entry.id } })
      }
      img.src = url
    })
  }, [state.images])

  // --- Handlers ---

  const handleRemoveImage = useCallback((id) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: id })
  }, [])

  const handleToggleImagePreset = useCallback((imageId, presetId) => {
    dispatch({ type: 'TOGGLE_IMAGE_PRESET', payload: { imageId, presetId } })
  }, [])

  const handleSetImagePresets = useCallback((imageId, presetIds) => {
    dispatch({ type: 'SET_IMAGE_PRESETS', payload: { imageId, presetIds } })
  }, [])

  const handleApplyPresetsToAll = useCallback((presetIds) => {
    dispatch({ type: 'APPLY_PRESETS_TO_ALL', payload: presetIds })
  }, [])

  const handleSetDefaultPresets = useCallback((presetIds) => {
    defaultPresetIdsRef.current = presetIds
  }, [])

  const handleContinueToReview = useCallback(() => {
    dispatch({
      type: 'INIT_COMBINATIONS',
      payload: { allPresets: presets, images: loadedImages, imagePresetSelections: state.imagePresetSelections },
    })
    setSearchParams({ step: '2' })
  }, [presets, loadedImages, state.imagePresetSelections, setSearchParams])

  const handleBackToUpload = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const handleEditCell = useCallback((key) => {
    setEditingKey(key)
  }, [])

  const handleApplyEdit = useCallback((key, transforms) => {
    dispatch({ type: 'UPDATE_TRANSFORMS', payload: { key, transforms } })
    setEditingKey(null)
  }, [])

  const handleExportAll = useCallback(() => {
    resetExport()
    setSearchParams({ step: '3' })
    setTimeout(() => {
      startExport(loadedImages, presets, state.imagePresetSelections, state.transforms)
    }, 0)
  }, [loadedImages, presets, state.imagePresetSelections, state.transforms, startExport, resetExport, setSearchParams])

  const handleNewBatch = useCallback(() => {
    dispatch({ type: 'RESET' })
    resetExport()
    setSearchParams({}, { replace: true })
  }, [resetExport, setSearchParams])

  // --- Resolve editing modal data ---
  const editingData = useMemo(() => {
    if (!editingKey) return null
    const [imgId, presetId] = editingKey.split('::')
    const img = loadedImages.find(i => i.id === imgId)
    const preset = (presets || []).find(p => p.id === presetId)
    if (!img || !preset) return null
    const { targetWidth, targetHeight } = resolvePresetDimensions(preset, img.image)
    return {
      image: img.image,
      preset: { ...preset, width: targetWidth, height: targetHeight },
      transforms: state.transforms[editingKey],
    }
  }, [editingKey, loadedImages, presets, state.transforms])

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[26px] font-bold text-text-primary">
            Bulk Image Prep
          </h1>
          <Link
            to="/"
            className="text-sm text-primary hover:text-blue-600 transition-colors"
          >
            &larr; Single Image
          </Link>
        </div>
        <p className="text-sm text-text-muted mb-6">
          Process multiple images across multiple presets at once
        </p>

        <BulkStepIndicator currentStep={step} />

        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          {step === STEPS.UPLOAD && (
            <BulkUploadStep
              images={state.images}
              imagePresetSelections={state.imagePresetSelections}
              presets={presetsLoading ? [] : (presets || [])}
              onAddFiles={handleAddFiles}
              onRemoveImage={handleRemoveImage}
              onToggleImagePreset={handleToggleImagePreset}
              onSetImagePresets={handleSetImagePresets}
              onApplyPresetsToAll={handleApplyPresetsToAll}
              onSetDefaultPresets={handleSetDefaultPresets}
              onContinue={handleContinueToReview}
            />
          )}

          {step === STEPS.REVIEW && (
            <BulkReviewStep
              images={loadedImages}
              allPresets={allAssignedPresets}
              imagePresetSelections={state.imagePresetSelections}
              transforms={state.transforms}
              editedCells={new Set(state.editedCells)}
              onEditCell={handleEditCell}
              onBack={handleBackToUpload}
              onExport={handleExportAll}
            />
          )}

          {step === STEPS.EXPORT && (
            <BulkExportStep
              progress={progress}
              result={result}
              error={exportError}
              onNewBatch={handleNewBatch}
            />
          )}
        </div>

        {/* Editor Modal */}
        {editingKey && editingData && (
          <BulkEditorModal
            image={editingData.image}
            preset={editingData.preset}
            transforms={editingData.transforms}
            onApply={(transforms) => handleApplyEdit(editingKey, transforms)}
            onClose={() => setEditingKey(null)}
          />
        )}
      </div>
    </div>
  )
}
