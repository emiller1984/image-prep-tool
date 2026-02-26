import { useState, useEffect } from 'react'

const FILE_TYPE_OPTIONS = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
]

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function PresetForm({ preset, existingIds, onSave, onCancel }) {
  const isEditing = !!preset
  const [name, setName] = useState(preset?.name || '')
  const [description, setDescription] = useState(preset?.description || '')
  const [sizeMode, setSizeMode] = useState(preset?.sizeMode || 'fixed')
  const [width, setWidth] = useState(preset?.width || 600)
  const [height, setHeight] = useState(preset?.height || 400)
  const [fileType, setFileType] = useState(preset?.fileType || 'jpeg')
  const [compression, setCompression] = useState(preset?.compression ?? 0.92)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (fileType === 'png') setCompression(1)
  }, [fileType])

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!description.trim()) errs.description = 'Description is required'
    if (!width || width < 1 || width > 5000) errs.width = '1–5000'
    if (sizeMode === 'fixed' && (!height || height < 1 || height > 5000)) errs.height = '1–5000'

    if (!isEditing) {
      const id = slugify(name)
      if (!id) errs.name = 'Name must contain letters or numbers'
      else if (existingIds.includes(id)) errs.name = 'A preset with this name already exists'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const id = isEditing ? preset.id : slugify(name)
    const presetData = {
      id,
      name: name.trim(),
      description: description.trim(),
      sizeMode,
      width: Number(width),
      fileType,
      compression: fileType === 'png' ? 1 : compression,
    }
    if (sizeMode === 'fixed') {
      presetData.height = Number(height)
    }
    onSave(presetData)
  }

  // Aspect ratio thumbnail
  const isWidthOnly = sizeMode === 'widthOnly'
  const aspectRatio = !isWidthOnly && width && height ? width / height : 3
  const thumbW = Math.min(80, 80)
  const thumbH = isWidthOnly ? 20 : thumbW / aspectRatio

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
        {isEditing ? 'Edit Preset' : 'Add Preset'}
      </h3>

      {/* Aspect ratio preview */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="bg-primary/10 border border-primary/30 rounded-sm"
          style={{
            width: `${thumbW}px`,
            height: `${Math.max(Math.min(thumbH, 80), 12)}px`,
          }}
        />
        {isWidthOnly && <div className="text-[10px] text-text-faint">auto height</div>}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.name ? 'border-error' : 'border-border'}`}
          placeholder="e.g. Hero Banner"
        />
        {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.description ? 'border-error' : 'border-border'}`}
          placeholder="e.g. Full-width hero section"
        />
        {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
      </div>

      {/* Sizing Mode */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Sizing Mode</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSizeMode('fixed')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              sizeMode === 'fixed'
                ? 'border-primary bg-primary-lighter text-primary'
                : 'border-border bg-surface hover:bg-gray-50 text-text-secondary'
            }`}
          >
            Fixed Dimensions
          </button>
          <button
            type="button"
            onClick={() => setSizeMode('widthOnly')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              sizeMode === 'widthOnly'
                ? 'border-primary bg-primary-lighter text-primary'
                : 'border-border bg-surface hover:bg-gray-50 text-text-secondary'
            }`}
          >
            Width Only
          </button>
        </div>
        {isWidthOnly && (
          <p className="text-xs text-text-faint mt-1">Height will be determined by the source image&rsquo;s aspect ratio</p>
        )}
      </div>

      {/* Dimensions */}
      <div className={isWidthOnly ? '' : 'grid grid-cols-2 gap-3'}>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min={1}
            max={5000}
            className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.width ? 'border-error' : 'border-border'}`}
          />
          {errors.width && <p className="text-xs text-error mt-1">{errors.width}</p>}
        </div>
        {!isWidthOnly && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min={1}
              max={5000}
              className={`w-full px-3 py-2 text-sm border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.height ? 'border-error' : 'border-border'}`}
            />
            {errors.height && <p className="text-xs text-error mt-1">{errors.height}</p>}
          </div>
        )}
      </div>

      {/* File Type */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">File Type</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {FILE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {fileType === 'webp' && (
          <p className="text-xs text-text-faint mt-1">WebP may not display in all email clients</p>
        )}
      </div>

      {/* Compression */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Compression Quality {fileType !== 'png' && <span className="text-text-faint">({Math.round(compression * 100)}%)</span>}
        </label>
        {fileType === 'png' ? (
          <p className="text-xs text-text-faint">PNG uses lossless compression (not adjustable)</p>
        ) : (
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={compression}
            onChange={(e) => setCompression(parseFloat(e.target.value))}
            className="w-full"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isEditing ? 'Save Changes' : 'Add Preset'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
