import { describe, it, expect } from 'vitest'
import { calculateFitScale, calculateFillScale } from './calculateTransforms'

describe('calculateFitScale', () => {
  it('fits a wide image inside a square frame by the limiting axis', () => {
    expect(calculateFitScale(2000, 1000, 1000, 1000)).toBe(0.5)
  })

  it('fits a tall image inside a square frame by the limiting axis', () => {
    expect(calculateFitScale(1000, 2000, 1000, 1000)).toBe(0.5)
  })

  it('scales up small images to fit the frame', () => {
    expect(calculateFitScale(100, 50, 600, 400)).toBe(6)
  })

  it('swaps effective dimensions at 90° rotation', () => {
    // 1200x400 image in 600x400 frame: fit normally limited by width
    expect(calculateFitScale(1200, 400, 600, 400)).toBe(0.5)
    // rotated 90° the image occupies 400x1200, limited by height
    expect(calculateFitScale(1200, 400, 600, 400, 90)).toBeCloseTo(1 / 3, 10)
  })

  it('treats -90° and 270° like 90°', () => {
    expect(calculateFitScale(1200, 400, 600, 400, -90)).toBeCloseTo(1 / 3, 10)
    expect(calculateFitScale(1200, 400, 600, 400, 270)).toBeCloseTo(1 / 3, 10)
  })

  it('treats 180° like 0°', () => {
    expect(calculateFitScale(1200, 400, 600, 400, 180)).toBeCloseTo(0.5, 10)
  })
})

describe('calculateFillScale', () => {
  it('fills the frame using the larger axis ratio', () => {
    expect(calculateFillScale(2000, 1000, 1000, 1000)).toBe(1)
  })

  it('is never smaller than the fit scale', () => {
    const fit = calculateFitScale(800, 600, 640, 480)
    const fill = calculateFillScale(800, 600, 640, 480)
    expect(fill).toBeGreaterThanOrEqual(fit)
  })

  it('swaps effective dimensions at 90° rotation', () => {
    expect(calculateFillScale(1200, 400, 600, 400)).toBe(1)
    expect(calculateFillScale(1200, 400, 600, 400, 90)).toBeCloseTo(1.5, 10)
  })

  it('equals fit scale when aspect ratios match', () => {
    expect(calculateFillScale(1600, 800, 800, 400)).toBe(calculateFitScale(1600, 800, 800, 400))
  })
})
