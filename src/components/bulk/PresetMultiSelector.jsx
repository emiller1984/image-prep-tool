function getAspectRatio(w, h) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

export default function PresetMultiSelector({ presets, selectedPresetIds, onTogglePreset, onSelectAll, onDeselectAll }) {
  const allSelected = presets.length > 0 && presets.every(p => selectedPresetIds.has(p.id))
  const noneSelected = presets.every(p => !selectedPresetIds.has(p.id))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
          Choose Presets
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={allSelected}
            className="text-[11px] text-primary hover:text-blue-600 disabled:text-text-faint transition-colors"
          >
            Select all
          </button>
          <span className="text-[11px] text-text-faint">/</span>
          <button
            onClick={onDeselectAll}
            disabled={noneSelected}
            className="text-[11px] text-primary hover:text-blue-600 disabled:text-text-faint transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {presets.map((preset) => {
          const isActive = selectedPresetIds.has(preset.id)
          const isWidthOnly = preset.sizeMode === 'widthOnly'
          const aspectRatio = isWidthOnly ? 3 : preset.width / preset.height
          const thumbW = 50
          const thumbH = isWidthOnly ? 14 : thumbW / aspectRatio

          return (
            <button
              key={preset.id}
              onClick={() => onTogglePreset(preset.id)}
              className={`relative p-2.5 rounded-lg border-2 text-left transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                isActive
                  ? 'border-primary bg-primary-lighter shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                  : 'border-border bg-surface hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Checkbox indicator */}
              <div className={`absolute top-2 right-2 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                isActive ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
              }`}>
                {isActive && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Aspect ratio thumbnail */}
              <div className="flex justify-center mb-1.5">
                {isWidthOnly ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className={`rounded-sm ${
                        isActive ? 'bg-primary/20 border-primary/40' : 'bg-gray-100 border-gray-200'
                      } border`}
                      style={{ width: `${thumbW}px`, height: '14px' }}
                    />
                    <div className="text-[9px] text-text-faint">auto height</div>
                  </div>
                ) : (
                  <div
                    className={`rounded-sm ${
                      isActive ? 'bg-primary/20 border-primary/40' : 'bg-gray-100 border-gray-200'
                    } border`}
                    style={{
                      width: `${thumbW}px`,
                      height: `${Math.max(thumbH, 10)}px`,
                      maxHeight: '40px',
                    }}
                  />
                )}
              </div>
              <div className="text-xs font-medium text-text-primary truncate pr-5">
                {preset.name}
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                {isWidthOnly ? (
                  <>{preset.width}w &middot; Auto height</>
                ) : (
                  <>
                    {preset.width} &times; {preset.height}
                    <span className="ml-1 opacity-60">&middot; {getAspectRatio(preset.width, preset.height)}</span>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
