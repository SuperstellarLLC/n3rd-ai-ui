import { describe, it, expect } from 'vitest'
import { drawBox, formatTable } from '../src/utils'

describe('drawBox', () => {
  it('draws single border', () => {
    const result = drawBox('hello')
    expect(result).toContain('┌')
    expect(result).toContain('┐')
    expect(result).toContain('└')
    expect(result).toContain('┘')
    expect(result).toContain('hello')
  })

  it('draws double border', () => {
    const result = drawBox('hi', { border: 'double' })
    expect(result).toContain('╔')
    expect(result).toContain('╗')
  })

  it('draws with title', () => {
    const result = drawBox('content', { title: 'Title' })
    expect(result).toContain('Title')
  })

  it('returns raw content for none border', () => {
    const result = drawBox('raw', { border: 'none' })
    expect(result).toBe('raw')
  })

  it('handles multi-line content', () => {
    const result = drawBox('line1\nline2')
    expect(result).toContain('line1')
    expect(result).toContain('line2')
  })

  it('handles empty content', () => {
    const result = drawBox('')
    expect(result).toContain('┌')
  })
})

describe('formatTable', () => {
  it('formats with single border', () => {
    const result = formatTable(['name', 'age'], [['Alice', '30']])
    expect(result).toContain('┌')
    expect(result).toContain('name')
    expect(result).toContain('Alice')
    expect(result).toContain('30')
  })

  it('formats with double border', () => {
    const result = formatTable(['a'], [['b']], { border: 'double' })
    expect(result).toContain('╔')
  })

  it('formats without border', () => {
    const result = formatTable(['a', 'b'], [['1', '2']], { border: 'none' })
    expect(result).toContain('a\tb')
    expect(result).toContain('1\t2')
  })

  it('handles empty rows', () => {
    const result = formatTable(['col1'], [])
    expect(result).toContain('col1')
  })

  it('pads columns correctly', () => {
    const result = formatTable(['short', 'longer_header'], [['a', 'b']])
    const lines = result.split('\n')
    // All lines should have equal length (padded)
    const widths = lines.map((l) => l.length)
    expect(new Set(widths).size).toBe(1)
  })
})
