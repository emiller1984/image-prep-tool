import { useMemo } from 'react'
import formatFileSize from '../utils/formatFileSize'
import exportImage, { dataUrlToBlob, EXTENSIONS, FORMAT_LABELS } from '../utils/exportImage'

export default function ExportResult({ image, imageInfo, preset, transforms, onBackToEditor, onNewImage }) {
  const fileType = preset.fileType || 'jpeg'
  const compression = preset.compression ?? 0.92
  const ext = EXTENSIONS[fileType] || 'jpg'
  const formatLabel = FORMAT_LABELS[fileType] || 'JPG'

  const { dataUrl, exportedSize } = useMemo(() => {
    const url = exportImage(image, preset.width, preset.height, transforms, fileType, compression)
    const blob = dataUrlToBlob(url)
    return { dataUrl: url, exportedSize: blob.size }
  }, [image, preset, transforms, fileType, compression])

  const baseName = imageInfo.name.replace(/\.[^.]+$/, '')
  const filename = `${baseName}_${preset.width}x${preset.height}.${ext}`

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted mb-4">
        Export Complete
      </h2>

      {/* Preview */}
      <div className="bg-surface border border-border rounded-lg p-4 mb-4">
        <div className="flex justify-center">
          <img
            src={dataUrl}
            alt="Exported preview"
            className="max-w-full border border-border rounded"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Original */}
        <div className="bg-gray-50 border border-border rounded-lg p-3">
          <div className="text-[11px] uppercase font-semibold tracking-wider text-text-muted mb-2">Original</div>
          <div className="space-y-1 text-sm text-text-secondary">
            <div className="truncate" title={imageInfo.name}>{imageInfo.name}</div>
            <div>{imageInfo.width} &times; {imageInfo.height}</div>
            <div>{formatFileSize(imageInfo.size)}</div>
          </div>
        </div>

        {/* Exported */}
        <div className="bg-success-light border border-green-200 rounded-lg p-3">
          <div className="text-[11px] uppercase font-semibold tracking-wider text-success mb-2">Exported</div>
          <div className="space-y-1 text-sm text-text-secondary">
            <div className="truncate" title={filename}>{filename}</div>
            <div>{preset.width} &times; {preset.height}</div>
            <div>{formatFileSize(exportedSize)} &middot; {formatLabel}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Download {filename}
        </button>
        <button
          onClick={onBackToEditor}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          Back to Editor
        </button>
        <button
          onClick={onNewImage}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          New Image
        </button>
      </div>
    </div>
  )
}
