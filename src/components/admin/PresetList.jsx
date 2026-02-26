const FORMAT_LABELS = { jpeg: 'JPG', png: 'PNG', webp: 'WebP' }

export default function PresetList({ presets, onEdit, onDelete, onAdd }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
          Presets ({presets.length})
        </h3>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          + Add Preset
        </button>
      </div>

      {presets.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">
          No presets yet. Add one to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {presets.map((preset) => {
            const isWidthOnly = preset.sizeMode === 'widthOnly'
            const aspectRatio = isWidthOnly ? 3 : preset.width / preset.height
            const thumbW = 40
            const thumbH = isWidthOnly ? 12 : thumbW / aspectRatio

            return (
              <div
                key={preset.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg bg-surface"
              >
                {/* Aspect ratio thumbnail */}
                <div
                  className="bg-gray-100 border border-gray-200 rounded-sm flex-shrink-0"
                  style={{
                    width: `${thumbW}px`,
                    height: `${Math.max(Math.min(thumbH, 40), 8)}px`,
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {preset.name}
                  </div>
                  <div className="text-xs text-text-muted">
                    {isWidthOnly ? (
                      <>{preset.width}w &middot; Auto height</>
                    ) : (
                      <>{preset.width} &times; {preset.height}</>
                    )}
                    <span className="mx-1">&middot;</span>
                    {FORMAT_LABELS[preset.fileType] || 'JPG'}
                    {preset.fileType !== 'png' && (
                      <span className="ml-1 text-text-faint">
                        {Math.round((preset.compression ?? 0.92) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-text-faint truncate">
                    {preset.description}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onEdit(preset)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(preset.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md border border-red-200 bg-surface hover:bg-red-50 text-error transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
