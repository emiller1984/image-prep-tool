import formatFileSize from '../../utils/formatFileSize'
import PresetPickerDropdown from './PresetPickerDropdown'

export default function ImagePresetAssigner({
  image,
  allPresets,
  selectedPresetIds,
  onTogglePreset,
  onApplyToAll,
  onRemove,
}) {
  const { info } = image
  const hasPresets = selectedPresetIds.length > 0
  const presetMap = Object.fromEntries(allPresets.map(p => [p.id, p]))

  return (
    <div className="p-3 bg-gray-50 border border-border rounded-lg space-y-2">
      {/* Top row: thumbnail + info + remove */}
      <div className="flex items-center gap-3">
        <img
          src={image.image.src}
          alt={info.name}
          className="w-10 h-10 object-cover rounded border border-border flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-text-secondary truncate">{info.name}</div>
          <div className="text-[11px] text-text-muted">
            {info.width} &times; {info.height} &middot; {formatFileSize(info.size)}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-text-muted hover:text-error transition-colors flex-shrink-0"
          title="Remove image"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preset chips row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {selectedPresetIds.map(presetId => {
          const preset = presetMap[presetId]
          if (!preset) return null
          const isWidthOnly = preset.sizeMode === 'widthOnly'
          return (
            <span
              key={presetId}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full border border-primary/20"
            >
              <span className="truncate max-w-[120px]">{preset.name}</span>
              <span className="text-primary/50 text-[10px]">
                {isWidthOnly ? `${preset.width}w` : `${preset.width}\u00d7${preset.height}`}
              </span>
              <button
                onClick={() => onTogglePreset(presetId)}
                className="ml-0.5 hover:text-error transition-colors"
                title={`Remove ${preset.name}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )
        })}

        <PresetPickerDropdown
          presets={allPresets}
          selectedPresetIds={selectedPresetIds}
          onToggle={onTogglePreset}
        />

        {hasPresets && (
          <button
            onClick={() => onApplyToAll(selectedPresetIds)}
            className="text-[10px] text-text-muted hover:text-primary transition-colors ml-1"
            title="Apply this image's presets to all other images"
          >
            Apply to all
          </button>
        )}
      </div>

      {!hasPresets && (
        <div className="text-[11px] text-text-faint italic">No presets assigned</div>
      )}
    </div>
  )
}
