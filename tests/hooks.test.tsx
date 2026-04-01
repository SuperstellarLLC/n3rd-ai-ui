import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTypewriter } from '../src/hooks/useTypewriter'
import { useKeyboard } from '../src/hooks/useKeyboard'

describe('useTypewriter', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts with empty string', () => {
    const { result } = renderHook(() => useTypewriter({ text: 'Hello' }))
    expect(result.current.displayed).toBe('')
    expect(result.current.done).toBe(false)
  })

  it('types progressively', () => {
    const { result } = renderHook(() => useTypewriter({ text: 'AB', speed: 10 }))
    act(() => vi.advanceTimersByTime(15))
    expect(result.current.displayed).toBe('A')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current.displayed).toBe('AB')
    // One more tick to trigger the done check
    act(() => vi.advanceTimersByTime(10))
    expect(result.current.done).toBe(true)
  })

  it('respects delay', () => {
    const { result } = renderHook(() => useTypewriter({ text: 'X', speed: 10, delay: 100 }))
    act(() => vi.advanceTimersByTime(50))
    expect(result.current.displayed).toBe('')
    act(() => vi.advanceTimersByTime(65))
    expect(result.current.displayed).toBe('X')
  })

  it('calls onComplete', () => {
    const fn = vi.fn()
    renderHook(() => useTypewriter({ text: 'A', speed: 10, onComplete: fn }))
    // First tick types 'A', second tick detects done
    act(() => vi.advanceTimersByTime(25))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('restarts when text changes', () => {
    const { result, rerender } = renderHook(
      ({ text }: { text: string }) => useTypewriter({ text, speed: 10 }),
      { initialProps: { text: 'OLD' } },
    )
    act(() => vi.advanceTimersByTime(40))
    expect(result.current.displayed).toBe('OLD')
    expect(result.current.done).toBe(true)

    rerender({ text: 'NEW' })
    expect(result.current.done).toBe(false)
    act(() => vi.advanceTimersByTime(40))
    expect(result.current.displayed).toBe('NEW')
  })
})

describe('useKeyboard', () => {
  it('fires handler on matching key', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'k', ctrl: true, handler }]))
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    document.dispatchEvent(event)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not fire on non-matching key', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'k', ctrl: true, handler }]))
    const event = new KeyboardEvent('keydown', { key: 'j', ctrlKey: true })
    document.dispatchEvent(event)
    expect(handler).not.toHaveBeenCalled()
  })

  it('does not fire without required modifier', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'k', ctrl: true, handler }]))
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: false })
    document.dispatchEvent(event)
    expect(handler).not.toHaveBeenCalled()
  })

  it('supports meta key separately from ctrl', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'k', meta: true, handler }]))
    // Ctrl should NOT match meta
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(handler).not.toHaveBeenCalled()
    // Meta should match
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('supports shift and alt', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'a', shift: true, alt: true, handler }]))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', shiftKey: true, altKey: true }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('prevents default on match', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'k', handler }]))
    const event = new KeyboardEvent('keydown', { key: 'k', cancelable: true })
    const spy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    expect(spy).toHaveBeenCalled()
  })

  it('cleans up listener on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useKeyboard([{ key: 'k', handler }]))
    unmount()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }))
    expect(handler).not.toHaveBeenCalled()
  })
})
