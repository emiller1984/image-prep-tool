import { useState, useRef, useCallback } from 'react'
import formatFileSize from '../utils/formatFileSize'

export default function ImageUploader({ onImageLoad, imageInfo, error: externalError, loading }) {
  const [isDragging, setIsDragging] = useState(false)
  const [warning, setWarning] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    setWarning(null)
    if (file.size > 10 * 1024 * 1024) {
      setWarning('This file is over 10MB. You may want to reduce the source file size for better performance.')
    }
    onImageLoad(file)
  }, [onImageLoad])

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
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const error = externalError

  return (
    <div>
      <h2 className="text-xs uppercase font-semibold tracking-wider text-text-muted mb-4">
        Upload Image
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
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-150 ${
          isDragging
            ? 'border-primary bg-primary-lighter'
            : 'border-border bg-surface hover:border-gray-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload image file"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDragging ? 'bg-primary/10' : 'bg-gray-100'
          }`}>
            <svg className={`w-6 h-6 ${isDragging ? 'text-primary' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">
              {isDragging ? 'Drop your image here' : 'Drag & drop an image here'}
            </p>
            <p className="text-xs text-text-muted mt-1">
              or click to browse &middot; JPG, PNG, WebP, GIF, SVG, BMP, AVIF, TIFF
            </p>
          </div>
        </div>

        {loading && (
          <div className="mt-4 text-sm text-primary font-medium">Loading image...</div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {warning && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700" role="alert">
          {warning}
        </div>
      )}

      {imageInfo && (
        <div className="mt-3 p-3 bg-gray-50 border border-border rounded-lg">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
            <span title="Filename">{imageInfo.name}</span>
            <span>{imageInfo.width} &times; {imageInfo.height}</span>
            <span>{formatFileSize(imageInfo.size)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
