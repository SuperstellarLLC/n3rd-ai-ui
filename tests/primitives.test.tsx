import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  Cursor,
  Typewriter,
  Scanline,
  BORDER_CHARS,
  getBorderChars,
  renderAsciiText,
  renderAsciiLines,
} from '../src'

describe('Cursor', () => {
  it('renders block cursor by default', () => {
    render(<Cursor />)
    expect(screen.getByText('█')).toBeInTheDocument()
  })

  it('renders line cursor', () => {
    render(<Cursor style="line" />)
    expect(screen.getByText('▎')).toBeInTheDocument()
  })

  it('renders underscore cursor', () => {
    render(<Cursor style="underscore" />)
    expect(screen.getByText('▁')).toBeInTheDocument()
  })

  it('is aria-hidden', () => {
    const { container } = render(<Cursor />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('has displayName', () => {
    expect(Cursor.displayName).toBe('Cursor')
  })
})

describe('Typewriter', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('types text progressively', () => {
    render(<Typewriter text="ABC" speed={10} />)
    act(() => vi.advanceTimersByTime(15))
    expect(screen.getByText(/A/)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(10))
    expect(screen.getByText(/AB/)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(10))
    expect(screen.getByText(/ABC/)).toBeInTheDocument()
  })

  it('respects delay', () => {
    render(<Typewriter text="X" speed={10} delay={100} />)
    act(() => vi.advanceTimersByTime(50))
    expect(screen.queryByText('X')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(60))
    // delay passed, first tick
    act(() => vi.advanceTimersByTime(15))
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('shows cursor while typing', () => {
    render(<Typewriter text="Hello" speed={10} cursor="block" />)
    expect(screen.getByText('█')).toBeInTheDocument()
  })

  it('hides cursor when done', () => {
    render(<Typewriter text="X" speed={10} />)
    // First tick types 'X', second tick detects done and hides cursor
    act(() => vi.advanceTimersByTime(25))
    expect(screen.queryByText('█')).not.toBeInTheDocument()
  })

  it('hides cursor when cursor=false', () => {
    render(<Typewriter text="X" speed={10} cursor={false} />)
    expect(screen.queryByText('█')).not.toBeInTheDocument()
  })

  it('calls onComplete', () => {
    const fn = vi.fn()
    render(<Typewriter text="AB" speed={10} onComplete={fn} />)
    act(() => vi.advanceTimersByTime(30))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('restarts when text changes', () => {
    const { rerender } = render(<Typewriter text="OLD" speed={10} />)
    act(() => vi.advanceTimersByTime(40))
    expect(screen.getByText('OLD')).toBeInTheDocument()

    rerender(<Typewriter text="NEW" speed={10} />)
    // After rerender, should reset and start typing NEW
    act(() => vi.advanceTimersByTime(15))
    expect(screen.getByText('N')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(25))
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('has displayName', () => {
    expect(Typewriter.displayName).toBe('Typewriter')
  })
})

describe('Scanline', () => {
  it('renders aria-hidden div', () => {
    const { container } = render(<Scanline />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('is fixed position', () => {
    const { container } = render(<Scanline />)
    expect(container.firstChild).toHaveStyle({ position: 'fixed' })
  })

  it('accepts custom opacity', () => {
    const { container } = render(<Scanline opacity={0.1} />)
    const bg = (container.firstChild as HTMLElement).style.background
    expect(bg).toContain('0.1')
  })

  it('has displayName', () => {
    expect(Scanline.displayName).toBe('Scanline')
  })
})

describe('getBorderChars', () => {
  it('returns single chars', () => {
    const c = getBorderChars('single')
    expect(c.topLeft).toBe('┌')
    expect(c.horizontal).toBe('─')
    expect(c.vertical).toBe('│')
  })

  it('returns double chars', () => {
    const c = getBorderChars('double')
    expect(c.topLeft).toBe('╔')
  })

  it('returns rounded chars', () => {
    const c = getBorderChars('rounded')
    expect(c.topLeft).toBe('╭')
  })

  it('returns dashed chars', () => {
    const c = getBorderChars('dashed')
    expect(c.horizontal).toBe('╌')
  })

  it('returns null for none', () => {
    expect(getBorderChars('none')).toBeNull()
  })

  it('exports BORDER_CHARS constant', () => {
    expect(BORDER_CHARS.single.topLeft).toBe('┌')
    expect(BORDER_CHARS.double.topLeft).toBe('╔')
    expect(BORDER_CHARS.rounded.topLeft).toBe('╭')
    expect(BORDER_CHARS.dashed.topLeft).toBe('┌')
  })
})

describe('renderAsciiText', () => {
  it('renders text as multi-line string', () => {
    const result = renderAsciiText('A')
    const lines = result.split('\n')
    expect(lines).toHaveLength(6)
  })

  it('includes block characters', () => {
    const result = renderAsciiText('A')
    expect(result).toContain('██')
  })

  it('handles unknown characters as space', () => {
    const result = renderAsciiText('~')
    // Should not crash, renders space glyph
    expect(result.split('\n')).toHaveLength(6)
  })

  it('handles empty string', () => {
    const result = renderAsciiText('')
    expect(result).toBeDefined()
  })

  it('converts to uppercase', () => {
    const lower = renderAsciiText('a')
    const upper = renderAsciiText('A')
    expect(lower).toBe(upper)
  })
})

describe('renderAsciiLines', () => {
  it('returns array of 6 lines', () => {
    const lines = renderAsciiLines('HI')
    expect(lines).toHaveLength(6)
    expect(Array.isArray(lines)).toBe(true)
  })

  it('each line is a string', () => {
    const lines = renderAsciiLines('X')
    lines.forEach((line) => expect(typeof line).toBe('string'))
  })
})
