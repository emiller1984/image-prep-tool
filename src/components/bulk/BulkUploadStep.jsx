import MultiImageUploader from './MultiImageUploader'
import PresetMultiSelector from './PresetMultiSelector'
import ImagePresetAssigner from './ImagePresetAssigner'

export default function BulkUploadStep({
  images,
  imagePresetSelections,
  presets,
  onAddFiles,
  onRemoveImage,
  onToggleImagePreset,
  onSetImagePresets,
  onApplyPresetsToAll,
  onSetDefaultPresets,
  onContinue,
}) {
  const loadedImages = images.filter(img => !img.loading && !img.error)
  const loadingCount = images.filter(img => img.loading).length

  const totalCombinations = loadedImages.reduce(
    (sum, img) => sum + (imagePresetSelections[img.id]?.length || 0), 0
  )
  const canContinue = loadedImages.length > 0 && totalCombinations > 0

  return (
    <div className="space-y-6">
      {/* Default presets bar */}
      <PresetMultiSelector
        presets={presets}
        onApplyToAll={onApplyPresetsToAll}
        onSetDefaults={onSetDefaultPresets}
      />

      {/* Upload zone */}
      <MultiImageUploader
        onAddFiles={onAddFiles}
        loadingCount={loadingCount}
      />

      {/* Error messages */}
      {images.some(img => img.error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error">
          {images.filter(img => img.error).map(img => (
            <div key={img.id}>Failed to load: {img.file.name}</div>
          ))}
        </div>
      )}

      {/* Per-image preset assignment cards */}
      {loadedImages.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
            Assign Presets ({loadedImages.length} image{loadedImages.length !== 1 ? 's' : ''})
          </h2>
          {loadedImages.map(img => (
            <ImagePresetAssigner
              key={img.id}
              image={img}
              allPresets={presets}
              selectedPresetIds={imagePresetSelections[img.id] || []}
              onTogglePreset={(presetId) => onToggleImagePreset(img.id, presetId)}
              onApplyToAll={onApplyPresetsToAll}
              onRemove={() => onRemoveImage(img.id)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-sm text-text-muted">
          {totalCombinations > 0 ? (
            <span className="font-semibold text-text-secondary">
              {totalCombinations} combination{totalCombinations !== 1 ? 's' : ''} to export
            </span>
          ) : (
            <>Upload images and assign presets to continue</>
          )}
        </div>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Review
        </button>
      </div>
    </div>
  )
}
