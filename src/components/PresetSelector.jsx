function getAspectRatio(w, h) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

export default function PresetSelector({ presets, selectedPreset, onSelect }) {
  return (
    <div>
      <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted mb-4">
        Choose Target Size
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {presets.map((preset) => {
          const isActive = selectedPreset?.id === preset.id
          const isWidthOnly = preset.sizeMode === 'widthOnly'
          const aspectRatio = isWidthOnly ? 3 : preset.width / preset.height
          // Thumbnail dimensions: max 60px wide, scaled by aspect ratio
          const thumbW = Math.min(60, 60)
          const thumbH = isWidthOnly ? 16 : thumbW / aspectRatio

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={`relative p-3 rounded-lg border-2 text-left transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive
                  ? 'border-primary bg-primary-lighter shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                  : 'border-border bg-surface hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Aspect ratio thumbnail */}
              <div className="flex justify-center mb-2">
                {isWidthOnly ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className={`rounded-sm ${
                        isActive ? 'bg-primary/20 border-primary/40' : 'bg-gray-100 border-gray-200'
                      } border`}
                      style={{ width: `${thumbW}px`, height: '16px' }}
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
                      height: `${Math.max(thumbH, 12)}px`,
                      maxHeight: '48px',
                    }}
                  />
                )}
              </div>
              <div className="text-sm font-medium text-text-primary truncate">
                {preset.name}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {isWidthOnly ? (
                  <>{preset.width}w &middot; Auto height</>
                ) : (
                  <>
                    {preset.width} &times; {preset.height}
                    <span className="ml-1 opacity-60">&middot; {getAspectRatio(preset.width, preset.height)}</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-text-faint mt-0.5 truncate">
                {preset.description}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
