import CombinationThumbnail from './CombinationThumbnail'
import resolvePresetDimensions from '../../utils/resolvePresetDimensions'

export default function BulkReviewStep({ images, selectedPresets, transforms, editedCells, onEditCell, onBack, onExport }) {
  const totalCombinations = images.length * selectedPresets.length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-2 py-1"
        >
          &larr; Back to Upload
        </button>
        <button
          onClick={onExport}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Export All ({totalCombinations} image{totalCombinations !== 1 ? 's' : ''})
        </button>
      </div>

      <p className="text-xs text-text-muted mb-4">
        Click any thumbnail to fine-tune positioning. All images are auto-filled by default.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[11px] uppercase font-semibold tracking-wider text-text-muted p-2 sticky left-0 bg-surface z-10">
                Image
              </th>
              {selectedPresets.map(preset => (
                <th key={preset.id} className="text-center text-[11px] uppercase font-semibold tracking-wider text-text-muted p-2 min-w-[180px]">
                  <div>{preset.name}</div>
                  <div className="font-normal normal-case">
                    {preset.sizeMode === 'widthOnly' ? `${preset.width}w` : `${preset.width}\u00d7${preset.height}`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id} className="border-t border-border">
                <td className="p-2 sticky left-0 bg-surface z-10">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <img
                      src={img.image.src}
                      alt={img.info.name}
                      className="w-8 h-8 object-cover rounded border border-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs text-text-secondary truncate max-w-[100px]" title={img.info.name}>
                        {img.info.name}
                      </div>
                      <div className="text-[10px] text-text-faint">
                        {img.info.width}&times;{img.info.height}
                      </div>
                    </div>
                  </div>
                </td>
                {selectedPresets.map(preset => {
                  const key = `${img.id}::${preset.id}`
                  const { targetWidth, targetHeight } = resolvePresetDimensions(preset, img.image)
                  return (
                    <td key={preset.id} className="p-2 text-center">
                      <div className="inline-block">
                        <CombinationThumbnail
                          image={img.image}
                          transforms={transforms[key]}
                          targetWidth={targetWidth}
                          targetHeight={targetHeight}
                          isEdited={editedCells.has(key)}
                          onClick={() => onEditCell(key)}
                        />
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 pt-4 border-t border-border">
        <button
          onClick={onExport}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Export All ({totalCombinations} image{totalCombinations !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  )
}
