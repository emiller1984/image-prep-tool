import { useState, useRef, useEffect } from 'react'

export default function PresetPickerDropdown({ presets, selectedPresetIds, onToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-primary hover:text-blue-600 border border-dashed border-primary/40 hover:border-primary rounded-md transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 left-0 w-56 bg-surface border border-border rounded-lg shadow-lg py-1 max-h-64 overflow-y-auto">
          {presets.map(preset => {
            const isSelected = selectedPresetIds.includes(preset.id)
            const isWidthOnly = preset.sizeMode === 'widthOnly'
            return (
              <button
                key={preset.id}
                onClick={() => onToggle(preset.id)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-text-primary truncate">{preset.name}</div>
                  <div className="text-[10px] text-text-muted">
                    {isWidthOnly ? `${preset.width}w` : `${preset.width}\u00d7${preset.height}`}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
