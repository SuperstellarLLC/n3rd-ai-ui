import { describe, it, expect } from 'vitest'
import { renderBadgeSvg } from '../src/badge.js'

describe('renderBadgeSvg', () => {
  it('returns valid SVG string', () => {
    const svg = renderBadgeSvg({ server: 'weather', score: 94, band: 'excellent' })
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
  })

  it('includes the score as text', () => {
    const svg = renderBadgeSvg({ server: 'weather', score: 94, band: 'excellent' })
    expect(svg).toContain('>94<')
  })

  it('includes the n3rd label', () => {
    const svg = renderBadgeSvg({ server: 'weather', score: 94, band: 'excellent' })
    expect(svg).toContain('>n3rd<')
  })

  it('uses green for excellent', () => {
    const svg = renderBadgeSvg({ server: 's', score: 95, band: 'excellent' })
    expect(svg).toContain('#22c55e')
  })

  it('uses blue for good', () => {
    const svg = renderBadgeSvg({ server: 's', score: 80, band: 'good' })
    expect(svg).toContain('#3b82f6')
  })

  it('uses yellow for fair', () => {
    const svg = renderBadgeSvg({ server: 's', score: 55, band: 'fair' })
    expect(svg).toContain('#eab308')
  })

  it('uses gray for unverified', () => {
    const svg = renderBadgeSvg({ server: 's', score: 30, band: 'unverified' })
    expect(svg).toContain('#6b7280')
  })

  it('shows "unverified" text when verified is false', () => {
    const svg = renderBadgeSvg({ server: 's', score: 94, band: 'excellent', verified: false })
    expect(svg).toContain('>unverified<')
    expect(svg).not.toContain('>94<')
  })

  it('has accessible title and aria-label', () => {
    const svg = renderBadgeSvg({ server: 's', score: 94, band: 'excellent' })
    expect(svg).toContain('<title>n3rd: 94</title>')
    expect(svg).toContain('aria-label="n3rd: 94"')
  })

  it('sets width based on content', () => {
    const svg = renderBadgeSvg({ server: 's', score: 94, band: 'excellent' })
    expect(svg).toMatch(/width="\d+"/)
  })
})
