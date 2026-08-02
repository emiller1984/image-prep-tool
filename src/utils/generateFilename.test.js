import { describe, it, expect } from 'vitest'
import generateFilename from './generateFilename'

const preset = { name: 'Hero Banner', width: 600, height: 400 }

describe('generateFilename', () => {
  it('builds {base}_{presetSlug}_{w}x{h}.{ext}', () => {
    expect(generateFilename('photo.jpg', preset, new Set()))
      .toBe('photo_hero_banner_600x400.jpg')
  })

  it('strips only the final extension from the original name', () => {
    expect(generateFilename('archive.backup.png', preset, new Set()))
      .toBe('archive_backup_hero_banner_600x400.jpg')
  })

  it('sanitizes unsafe characters in name and preset slug', () => {
    expect(generateFilename('my photo (1).png', preset, new Set()))
      .toBe('my_photo__1__hero_banner_600x400.jpg')
  })

  it('uses the preset fileType extension', () => {
    expect(generateFilename('photo.jpg', { ...preset, fileType: 'png' }, new Set()))
      .toBe('photo_hero_banner_600x400.png')
    expect(generateFilename('photo.jpg', { ...preset, fileType: 'webp' }, new Set()))
      .toBe('photo_hero_banner_600x400.webp')
  })

  it('falls back to jpg for unknown file types', () => {
    expect(generateFilename('photo.jpg', { ...preset, fileType: 'tiff' }, new Set()))
      .toBe('photo_hero_banner_600x400.jpg')
  })

  it('appends a counter when the name is already used', () => {
    const used = new Set(['photo_hero_banner_600x400.jpg'])
    expect(generateFilename('photo.jpg', preset, used))
      .toBe('photo_hero_banner_600x400_2.jpg')
  })

  it('increments the counter past existing duplicates', () => {
    const used = new Set([
      'photo_hero_banner_600x400.jpg',
      'photo_hero_banner_600x400_2.jpg',
    ])
    expect(generateFilename('photo.jpg', preset, used))
      .toBe('photo_hero_banner_600x400_3.jpg')
  })
})
