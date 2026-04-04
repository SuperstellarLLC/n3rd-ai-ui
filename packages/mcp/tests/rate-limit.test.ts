import { describe, it, expect, vi } from 'vitest'
import { createRateLimiter } from '../src/rate-limit/index.js'
import type { IncomingMessage } from 'node:http'

function mockReq(ip: string = '127.0.0.1'): IncomingMessage {
  return {
    headers: {},
    socket: { remoteAddress: ip },
  } as unknown as IncomingMessage
}

function mockReqWithForwarded(ip: string): IncomingMessage {
  return {
    headers: { 'x-forwarded-for': ip },
    socket: { remoteAddress: '10.0.0.1' },
  } as unknown as IncomingMessage
}

describe('createRateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = createRateLimiter({ max: 5, windowMs: 60_000 })
    const result = limiter.check(mockReq())
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
    expect(result.limit).toBe(5)
  })

  it('blocks requests exceeding limit', () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 })
    const req = mockReq()

    limiter.check(req) // 2 remaining
    limiter.check(req) // 1 remaining
    limiter.check(req) // 0 remaining
    const result = limiter.check(req) // blocked

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('tracks clients independently by IP', () => {
    const limiter = createRateLimiter({ max: 2, windowMs: 60_000 })

    limiter.check(mockReq('10.0.0.1'))
    limiter.check(mockReq('10.0.0.1'))
    const blocked = limiter.check(mockReq('10.0.0.1'))
    const allowed = limiter.check(mockReq('10.0.0.2'))

    expect(blocked.allowed).toBe(false)
    expect(allowed.allowed).toBe(true)
  })

  it('ignores x-forwarded-for by default (trustProxy: false)', () => {
    const limiter = createRateLimiter({ max: 2, windowMs: 60_000 })

    // Two different X-Forwarded-For, same socket IP
    limiter.check(mockReqWithForwarded('203.0.113.1'))
    limiter.check(mockReqWithForwarded('203.0.113.2'))
    const result = limiter.check(mockReqWithForwarded('203.0.113.3'))

    // Should be blocked because all map to same socket.remoteAddress (10.0.0.1)
    expect(result.allowed).toBe(false)
  })

  it('uses x-forwarded-for when trustProxy is true', () => {
    const limiter = createRateLimiter({ max: 2, windowMs: 60_000, trustProxy: true })

    limiter.check(mockReqWithForwarded('203.0.113.1'))
    limiter.check(mockReqWithForwarded('203.0.113.1'))
    const blocked = limiter.check(mockReqWithForwarded('203.0.113.1'))
    const allowed = limiter.check(mockReqWithForwarded('203.0.113.2'))

    expect(blocked.allowed).toBe(false)
    expect(allowed.allowed).toBe(true)
  })

  it('uses custom key generator', () => {
    const limiter = createRateLimiter({
      max: 1,
      windowMs: 60_000,
      keyGenerator: () => 'global',
    })

    limiter.check(mockReq('10.0.0.1'))
    const result = limiter.check(mockReq('10.0.0.2'))

    expect(result.allowed).toBe(false)
  })

  it('resets a specific key', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 })
    const req = mockReq()

    limiter.check(req)
    const blocked = limiter.check(req)
    expect(blocked.allowed).toBe(false)

    limiter.reset('127.0.0.1')
    const allowed = limiter.check(req)
    expect(allowed.allowed).toBe(true)
  })

  it('returns resetSeconds', () => {
    const limiter = createRateLimiter({ max: 5, windowMs: 30_000 })
    const result = limiter.check(mockReq())
    expect(result.resetSeconds).toBeGreaterThan(0)
  })

  it('defaults to 120 max and 60s window', () => {
    const limiter = createRateLimiter({})
    const result = limiter.check(mockReq())
    expect(result.limit).toBe(120)
    expect(result.resetSeconds).toBe(60)
  })

  it('emits warning when trustProxy is enabled', () => {
    const warn = vi.fn()
    createRateLimiter({ trustProxy: true }, { logger: { warning: warn } })
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('trustProxy')
  })

  it('does not warn when trustProxy is disabled', () => {
    const warn = vi.fn()
    createRateLimiter({ trustProxy: false }, { logger: { warning: warn } })
    expect(warn).not.toHaveBeenCalled()
  })

  it('throws on max <= 0', () => {
    expect(() => createRateLimiter({ max: 0, windowMs: 60_000 })).toThrow(
      'max must be greater than 0',
    )
  })

  it('throws on windowMs <= 0', () => {
    expect(() => createRateLimiter({ max: 10, windowMs: 0 })).toThrow(
      'windowMs must be greater than 0',
    )
  })
})
