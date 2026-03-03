import { useState, useCallback, useEffect } from 'react'

export default function PresetMultiSelector({ presets, onApplyToAll, onSetDefaults }) {
  const [selectedIds, setSelectedIds] = useState([])

  // Keep parent in sync with defaults
  useEffect(() => {
    onSetDefaults(selectedIds)
  }, [selectedIds, onSetDefaults])

  const handleToggle = useCallback((presetId) => {
    setSelectedIds(prev => {
      const index = prev.indexOf(presetId)
      if (index >= 0) return prev.filter(id => id !== presetId)
      return [...prev, presetId]
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedIds(presets.map(p => p.id))
  }, [presets])

  const handleClear = useCallback(() => {
    setSelectedIds([])
  }, [])

  const handleApplyToAll = useCallback(() => {
    onApplyToAll(selectedIds)
  }, [selectedIds, onApplyToAll])

  const allSelected = presets.length > 0 && presets.every(p => selectedIds.includes(p.id))
  const noneSelected = selectedIds.length === 0

  return (
    <div className="bg-gray-50 border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
            Default Presets
          </h2>
          <p className="text-[10px] text-text-faint mt-0.5">
            Auto-assigned to new uploads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            disabled={allSelected}
            className="text-[11px] text-primary hover:text-blue-600 disabled:text-text-faint transition-colors"
          >
            Select all
          </button>
          <span className="text-[11px] text-text-faint">/</span>
          <button
            onClick={handleClear}
            disabled={noneSelected}
            className="text-[11px] text-primary hover:text-blue-600 disabled:text-text-faint transition-colors"
          >
            Clear
          </button>
          <span className="text-[11px] text-text-faint">|</span>
          <button
            onClick={handleApplyToAll}
            disabled={noneSelected}
            className="text-[11px] text-primary hover:text-blue-600 disabled:text-text-faint transition-colors font-medium"
          >
            Apply to all images
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map(preset => {
          const isActive = selectedIds.includes(preset.id)
          const isWidthOnly = preset.sizeMode === 'widthOnly'
          return (
            <button
              key={preset.id}
              onClick={() => handleToggle(preset.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                isActive
                  ? 'border-primary bg-primary/5 text-primary font-medium shadow-[0_0_0_2px_rgba(59,130,246,0.1)]'
                  : 'border-border bg-white text-text-secondary hover:border-gray-300'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
              }`}>
                {isActive && (
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span>{preset.name}</span>
              <span className="text-[10px] opacity-60">
                {isWidthOnly ? `${preset.width}w` : `${preset.width}\u00d7${preset.height}`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
