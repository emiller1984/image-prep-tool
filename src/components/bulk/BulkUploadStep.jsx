import MultiImageUploader from './MultiImageUploader'
import PresetMultiSelector from './PresetMultiSelector'

export default function BulkUploadStep({ images, selectedPresetIds, presets, onAddFiles, onRemoveImage, onTogglePreset, onSelectAll, onDeselectAll, onContinue }) {
  const loadedCount = images.filter(img => !img.loading && !img.error).length
  const presetCount = selectedPresetIds.size
  const combinationCount = loadedCount * presetCount
  const canContinue = loadedCount > 0 && presetCount > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MultiImageUploader
          images={images}
          onAddFiles={onAddFiles}
          onRemoveImage={onRemoveImage}
        />
        <PresetMultiSelector
          presets={presets}
          selectedPresetIds={selectedPresetIds}
          onTogglePreset={onTogglePreset}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-sm text-text-muted">
          {loadedCount > 0 && presetCount > 0 ? (
            <>
              {loadedCount} image{loadedCount !== 1 ? 's' : ''} &times; {presetCount} preset{presetCount !== 1 ? 's' : ''} = <span className="font-semibold text-text-secondary">{combinationCount} combination{combinationCount !== 1 ? 's' : ''}</span>
            </>
          ) : (
            <>Select images and presets to continue</>
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
