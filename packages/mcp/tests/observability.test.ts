import { describe, it, expect, vi } from 'vitest'
import { noopTracer, noopSpan, adaptOtelTracer } from '../src/observability/index.js'

describe('noopTracer', () => {
  it('returns a noop span that accepts all calls', () => {
    const span = noopTracer.startSpan('x')
    expect(() => {
      span.setAttribute('k', 'v')
      span.setStatus({ code: 'OK' })
      span.recordException(new Error('x'))
      span.end()
    }).not.toThrow()
    expect(span).toBe(noopSpan)
  })
})

describe('adaptOtelTracer', () => {
  it('forwards calls to OTel tracer with correct shape', () => {
    const setAttribute = vi.fn()
    const setStatus = vi.fn()
    const recordException = vi.fn()
    const end = vi.fn()
    const startSpan = vi.fn(() => ({ setAttribute, setStatus, recordException, end }))

    const adapted = adaptOtelTracer({ startSpan })
    const span = adapted.startSpan('my.op', { foo: 'bar' })
    span.setAttribute('key', 'val')
    span.setStatus({ code: 'OK' })
    span.setStatus({ code: 'ERROR', message: 'boom' })
    span.recordException(new Error('oops'))
    span.end()

    expect(startSpan).toHaveBeenCalledWith('my.op', { attributes: { foo: 'bar' } })
    expect(setAttribute).toHaveBeenCalledWith('key', 'val')
    // OTel codes: OK=1, ERROR=2
    expect(setStatus).toHaveBeenCalledWith({ code: 1, message: undefined })
    expect(setStatus).toHaveBeenCalledWith({ code: 2, message: 'boom' })
    expect(recordException).toHaveBeenCalled()
    expect(end).toHaveBeenCalled()
  })

  it('omits attributes option when none provided', () => {
    const startSpan = vi.fn(() => ({
      setAttribute: vi.fn(),
      setStatus: vi.fn(),
      recordException: vi.fn(),
      end: vi.fn(),
    }))
    const adapted = adaptOtelTracer({ startSpan })
    adapted.startSpan('op')
    expect(startSpan).toHaveBeenCalledWith('op', undefined)
  })
})
