import { useState, useRef, useCallback } from 'react'

export default function MultiImageUploader({ onAddFiles, loadingCount }) {
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

  return (
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

      {loadingCount > 0 && (
        <div className="mt-3 text-sm text-primary font-medium">
          Loading {loadingCount} image{loadingCount !== 1 ? 's' : ''}...
        </div>
      )}
    </div>
  )
}
