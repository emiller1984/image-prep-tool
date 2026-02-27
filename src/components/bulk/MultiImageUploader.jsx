import { useState, useRef, useCallback } from 'react'
import formatFileSize from '../../utils/formatFileSize'

export default function MultiImageUploader({ images, onAddFiles, onRemoveImage }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      onAddFiles(imageFiles)
    }
  }, [onAddFiles])

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const loadedImages = images.filter(img => !img.loading && !img.error)
  const loadingImages = images.filter(img => img.loading)

  return (
    <div>
      <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted mb-4">
        Upload Images
      </h2>

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 ${
          isDragging
            ? 'border-primary bg-primary-lighter'
            : 'border-border bg-surface hover:border-gray-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload image files"
        />

        <div className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDragging ? 'bg-primary/10' : 'bg-gray-100'
          }`}>
            <svg className={`w-5 h-5 ${isDragging ? 'text-primary' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">
              {isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              or click to browse &middot; Select multiple files
            </p>
          </div>
        </div>

        {loadingImages.length > 0 && (
          <div className="mt-3 text-sm text-primary font-medium">
            Loading {loadingImages.length} image{loadingImages.length !== 1 ? 's' : ''}...
          </div>
        )}
      </div>

      {loadedImages.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {loadedImages.map((img) => (
            <div key={img.id} className="flex items-center gap-3 p-2 bg-gray-50 border border-border rounded-lg">
              <img
                src={img.image.src}
                alt={img.info.name}
                className="w-10 h-10 object-cover rounded border border-border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-secondary truncate">{img.info.name}</div>
                <div className="text-[11px] text-text-muted">
                  {img.info.width} &times; {img.info.height} &middot; {formatFileSize(img.info.size)}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveImage(img.id) }}
                className="p-1 text-text-muted hover:text-error transition-colors flex-shrink-0"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {images.some(img => img.error) && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error">
          {images.filter(img => img.error).map(img => (
            <div key={img.id}>Failed to load: {img.file.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}
