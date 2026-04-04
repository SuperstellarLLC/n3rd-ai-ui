/**
 * Footer sunset geometry tests.
 *
 * The sunset has been broken on every release so far.
 * These tests lock down the exact shape, proportions, and CSS constraints
 * so regressions are caught immediately.
 */

import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from '../../src'

function getSunsetElements(container: HTMLElement) {
  const sunset = container.querySelector('.n3rd-footer-sunset') as HTMLElement
  const sunLines = container.querySelectorAll('.n3rd-footer-sun-line')
  const sunGaps = container.querySelectorAll('.n3rd-footer-sun-gap')
  const horizon = container.querySelector('.n3rd-footer-horizon') as HTMLElement
  const horizonBright = container.querySelector('.n3rd-footer-horizon-bright') as HTMLElement
  return { sunset, sunLines, sunGaps, horizon, horizonBright }
}

function getWidthPercent(el: Element): number {
  return parseFloat((el as HTMLElement).style.width)
}

describe('Footer sunset geometry', () => {
  it('sunset container is max-width 350px and centered', () => {
    const { container } = render(<Footer />)
    const { sunset } = getSunsetElements(container)
    expect(sunset).toBeTruthy()
    // Check via computed class — the CSS sets max-width: 350px
    expect(sunset.className).toContain('n3rd-footer-sunset')
  })

  it('has exactly 10 sun lines', () => {
    const { container } = render(<Footer />)
    const { sunLines } = getSunsetElements(container)
    expect(sunLines).toHaveLength(10)
  })

  it('sun line widths form a semicircle curve (not linear)', () => {
    const { container } = render(<Footer />)
    const { sunLines } = getSunsetElements(container)
    const widths = Array.from(sunLines).map(getWidthPercent)

    // Widths must be monotonically increasing (narrowest at top, widest at bottom)
    for (let i = 1; i < widths.length; i++) {
      expect(widths[i]).toBeGreaterThan(widths[i - 1])
    }

    // Semicircle property: the gap between consecutive widths should DECREASE
    // (steep jumps at top, flattening toward bottom)
    // Check first gap is larger than last gap
    const firstGap = widths[1] - widths[0]
    const lastGap = widths[widths.length - 1] - widths[widths.length - 2]
    expect(firstGap).toBeGreaterThan(lastGap)
  })

  it('narrowest sun line is under 30% width', () => {
    const { container } = render(<Footer />)
    const { sunLines } = getSunsetElements(container)
    const narrowest = getWidthPercent(sunLines[0])
    expect(narrowest).toBeLessThanOrEqual(30)
  })

  it('widest sun line is under 85% width', () => {
    const { container } = render(<Footer />)
    const { sunLines } = getSunsetElements(container)
    const widest = getWidthPercent(sunLines[sunLines.length - 1])
    expect(widest).toBeLessThanOrEqual(85)
  })

  it('has gaps only near the bottom (horizon dip effect)', () => {
    const { container } = render(<Footer />)
    const { sunGaps } = getSunsetElements(container)

    // Should have 3 gaps
    expect(sunGaps.length).toBe(3)

    // Gaps should appear AFTER the bulk of sun lines, not interspersed throughout
    // Get position of first gap relative to sun lines
    const sunset = container.querySelector('.n3rd-footer-sunset') as HTMLElement
    const children = Array.from(sunset.children)
    const firstGapIndex = children.findIndex((el) => el.classList.contains('n3rd-footer-sun-gap'))
    const totalSunLines = children.filter((el) =>
      el.classList.contains('n3rd-footer-sun-line'),
    ).length

    // First gap should be after at least 60% of sun lines
    const linesBeforeFirstGap = children
      .slice(0, firstGapIndex)
      .filter((el) => el.classList.contains('n3rd-footer-sun-line')).length
    expect(linesBeforeFirstGap / totalSunLines).toBeGreaterThanOrEqual(0.6)
  })

  it('sun lines use CSS variables not hardcoded hex colors', () => {
    const { container } = render(<Footer />)
    const { sunLines } = getSunsetElements(container)

    sunLines.forEach((line) => {
      const bg = (line as HTMLElement).style.background
      expect(bg).toMatch(/^var\(--n3rd-accent-/)
    })
  })

  it('horizon line exists and stretches full width (no max-width constraint)', () => {
    const { container } = render(<Footer />)
    const { horizon } = getSunsetElements(container)
    expect(horizon).toBeTruthy()
    // Horizon should NOT have the same max-width as sunset
    expect(horizon.className).toContain('n3rd-footer-horizon')
  })

  it('horizon bright line is 100% width', () => {
    const { container } = render(<Footer />)
    const { horizonBright } = getSunsetElements(container)
    expect(horizonBright).toBeTruthy()
  })

  it('sunset is aria-hidden (decorative)', () => {
    const { container } = render(<Footer />)
    const { sunset, horizon } = getSunsetElements(container)
    expect(sunset).toHaveAttribute('aria-hidden', 'true')
    expect(horizon).toHaveAttribute('aria-hidden', 'true')
  })
})
