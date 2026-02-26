import presets from '../config/presets'

function getAspectRatio(width, height) {
  let a = width, b = height
  while (b) { [a, b] = [b, a % b] }
  return `${width / a}:${height / a}`
}

export default function PresetSelector({ selectedPreset, onSelect }) {
  return (
    <div>
      <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted mb-4">
        Choose Target Size
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {presets.map((preset) => {
          const isActive = selectedPreset?.id === preset.id
          const aspectRatio = preset.width / preset.height
          // Thumbnail dimensions: max 60px wide, scaled by aspect ratio
          const thumbW = Math.min(60, 60)
          const thumbH = thumbW / aspectRatio

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
              </div>
              <div className="text-sm font-medium text-text-primary truncate">
                {preset.label}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {preset.width} &times; {preset.height}
                <span className="ml-1 text-text-faint">({getAspectRatio(preset.width, preset.height)})</span>
              </div>
              <div className="text-[11px] text-text-faint mt-0.5 truncate">
                {preset.useCase}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
