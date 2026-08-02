import { describe, it, expect } from 'vitest'
import formatFileSize from './formatFileSize'

describe('formatFileSize', () => {
  it('handles zero', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('shows bytes without decimals', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('shows one decimal for KB and above', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1048576)).toBe('1.0 MB')
    expect(formatFileSize(5 * 1024 ** 3)).toBe('5.0 GB')
  })

  it('stays in bytes just below 1 KB', () => {
    expect(formatFileSize(1023)).toBe('1023 B')
  })
})
