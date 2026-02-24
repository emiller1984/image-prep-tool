import { calculateFitScale, calculateFillScale } from '../utils/calculateTransforms'

export default function EditorControls({ image, transforms, setTransforms, targetWidth, targetHeight }) {
  const fitScale = calculateFitScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, transforms.rotation)
  const fillScale = calculateFillScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, transforms.rotation)

  const scalePercent = Math.round((transforms.scale / fitScale) * 100)

  const handleFit = () => {
    const newFitScale = calculateFitScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, transforms.rotation)
    setTransforms(prev => ({ ...prev, scale: newFitScale, offsetX: 0, offsetY: 0 }))
  }

  const handleFill = () => {
    const newFillScale = calculateFillScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, transforms.rotation)
    setTransforms(prev => ({ ...prev, scale: newFillScale, offsetX: 0, offsetY: 0 }))
  }

  const handleReset = () => {
    const resetScale = calculateFitScale(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight, 0)
    setTransforms({
      scale: resetScale,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      flipH: false,
      flipV: false,
    })
  }

  const handleScaleSlider = (e) => {
    const percent = Number(e.target.value)
    const newScale = (percent / 100) * fitScale
    setTransforms(prev => ({ ...prev, scale: newScale }))
  }

  const handleRotationSlider = (e) => {
    setTransforms(prev => ({ ...prev, rotation: Number(e.target.value) }))
  }

  const handleRotate90 = (direction) => {
    setTransforms(prev => {
      let newRotation = prev.rotation + direction
      // Wrap to -180..180 range
      if (newRotation > 180) newRotation -= 360
      if (newRotation < -180) newRotation += 360
      return { ...prev, rotation: newRotation }
    })
  }

  const handleFlipH = () => {
    setTransforms(prev => ({ ...prev, flipH: !prev.flipH }))
  }

  const handleFlipV = () => {
    setTransforms(prev => ({ ...prev, flipV: !prev.flipV }))
  }

  return (
    <div className="space-y-4 mt-5">
      {/* Scale */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted" htmlFor="scale-slider">
            Scale
          </label>
          <span className="text-xs font-mono text-text-muted">{scalePercent}%</span>
        </div>
        <input
          id="scale-slider"
          type="range"
          min="5"
          max="1000"
          value={scalePercent}
          onChange={handleScaleSlider}
          className="w-full"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleFit}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            Fit
          </button>
          <button
            onClick={handleFill}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            Fill
          </button>
        </div>
      </div>

      {/* Rotation */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted" htmlFor="rotation-slider">
            Rotation
          </label>
          <span className="text-xs font-mono text-text-muted">{transforms.rotation}&deg;</span>
        </div>
        <input
          id="rotation-slider"
          type="range"
          min="-180"
          max="180"
          value={transforms.rotation}
          onChange={handleRotationSlider}
          className="w-full"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleRotate90(-90)}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            title="Rotate 90° counter-clockwise"
          >
            -90&deg;
          </button>
          <button
            onClick={() => handleRotate90(90)}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-gray-50 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            title="Rotate 90° clockwise"
          >
            +90&deg;
          </button>
        </div>
      </div>

      {/* Flip + Reset */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleFlipH}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
            transforms.flipH
              ? 'border-primary bg-primary-lighter text-primary'
              : 'border-border bg-surface hover:bg-gray-50 text-text-secondary'
          }`}
          title="Flip horizontal"
        >
          Flip H
        </button>
        <button
          onClick={handleFlipV}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
            transforms.flipV
              ? 'border-primary bg-primary-lighter text-primary'
              : 'border-border bg-surface hover:bg-gray-50 text-text-secondary'
          }`}
          title="Flip vertical"
        >
          Flip V
        </button>
        <div className="flex-1" />
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-red-50 hover:border-red-200 hover:text-error text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
