import formatFileSize from '../../utils/formatFileSize'

export default function BulkExportStep({ progress, result, error, onNewBatch }) {
  const handleDownload = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const link = document.createElement('a')
    link.href = url
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const percentage = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  return (
    <div>
      <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted mb-6">
        {progress.phase === 'done' ? 'Export Complete' : 'Exporting'}
      </h2>

      {/* Progress */}
      {(progress.phase === 'rendering' || progress.phase === 'zipping') && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
                {progress.phase === 'rendering'
                  ? `Rendering image ${progress.current} of ${progress.total}...`
                  : 'Creating ZIP archive...'
                }
              </span>
              {progress.phase === 'rendering' && (
                <span className="text-sm font-mono text-text-muted">{percentage}%</span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: progress.phase === 'zipping' ? '100%' : `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {progress.phase === 'error' && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-error mb-4">
          {error}
        </div>
      )}

      {/* Complete */}
      {progress.phase === 'done' && result && (
        <div className="space-y-4">
          <div className="bg-success-light border border-green-200 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-success mb-1">
              {progress.total} image{progress.total !== 1 ? 's' : ''} exported
            </div>
            <div className="text-sm text-text-muted">
              {formatFileSize(result.size)} total
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Download {result.filename} ({formatFileSize(result.size)})
            </button>
            <button
              onClick={onNewBatch}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              Start New Batch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
