import { describe, it, expect } from 'vitest'
import resolvePresetDimensions from './resolvePresetDimensions'

describe('resolvePresetDimensions', () => {
  it('returns preset dimensions as-is for fixed presets', () => {
    const preset = { width: 600, height: 400, sizeMode: 'fixed' }
    expect(resolvePresetDimensions(preset, { naturalWidth: 800, naturalHeight: 600 }))
      .toEqual({ targetWidth: 600, targetHeight: 400 })
  })

  it('returns preset dimensions as-is when sizeMode is absent', () => {
    const preset = { width: 600, height: 400 }
    expect(resolvePresetDimensions(preset, { naturalWidth: 800, naturalHeight: 600 }))
      .toEqual({ targetWidth: 600, targetHeight: 400 })
  })

  it('derives height from image aspect ratio for widthOnly presets', () => {
    const preset = { width: 600, sizeMode: 'widthOnly' }
    expect(resolvePresetDimensions(preset, { naturalWidth: 800, naturalHeight: 600 }))
      .toEqual({ targetWidth: 600, targetHeight: 450 })
  })

  it('rounds derived height to a whole pixel', () => {
    const preset = { width: 100, sizeMode: 'widthOnly' }
    // 100 * (2/3) = 66.67 → 67
    expect(resolvePresetDimensions(preset, { naturalWidth: 3, naturalHeight: 2 }))
      .toEqual({ targetWidth: 100, targetHeight: 67 })
  })

  it('falls back to preset dimensions for widthOnly without an image', () => {
    const preset = { width: 600, height: 400, sizeMode: 'widthOnly' }
    expect(resolvePresetDimensions(preset, null))
      .toEqual({ targetWidth: 600, targetHeight: 400 })
  })
})
