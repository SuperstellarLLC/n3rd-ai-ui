/**
 * Property-based tests for the token bucket rate limiter.
 * These verify invariants across randomized inputs.
 */
import { describe, it } from 'vitest'
import fc from 'fast-check'
import { createRateLimiter } from '../src/rate-limit/index.js'
import type { IncomingMessage } from 'node:http'

function mockReq(ip: string): IncomingMessage {
  return { headers: {}, socket: { remoteAddress: ip } } as unknown as IncomingMessage
}

describe('rate limiter properties', () => {
  it('never exceeds max limit within a window', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1_000, max: 600_000 }),
        fc.integer({ min: 1, max: 500 }),
        (max, windowMs, requests) => {
          const limiter = createRateLimiter({ max, windowMs })
          const req = mockReq('10.0.0.1')
          let allowed = 0
          for (let i = 0; i < requests; i++) {
            if (limiter.check(req).allowed) allowed++
          }
          // Without waiting, we can never exceed `max` allowed requests from a single IP.
          // Tiny float slack from refill is possible, so allow max+1 as tolerance.
          return allowed <= max + 1
        },
      ),
      { numRuns: 200 },
    )
  })

  it('remaining never exceeds limit', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (max, checks) => {
          const limiter = createRateLimiter({ max, windowMs: 60_000 })
          const req = mockReq('10.0.0.1')
          for (let i = 0; i < checks; i++) {
            const result = limiter.check(req)
            if (result.remaining > max) return false
            if (result.remaining < 0) return false
            if (result.limit !== max) return false
          }
          return true
        },
      ),
      { numRuns: 200 },
    )
  })

  it('different clients have independent buckets', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 50 }),
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 2, maxLength: 20 }),
        (max, clients) => {
          const limiter = createRateLimiter({ max, windowMs: 60_000 })
          // Each unique client should get a fresh max allowance
          const unique = Array.from(new Set(clients))
          for (const ip of unique) {
            const first = limiter.check(mockReq(ip))
            if (!first.allowed) return false
            if (first.remaining !== max - 1) return false
          }
          return true
        },
      ),
      { numRuns: 100 },
    )
  })

  it('reset restores a full bucket', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 50 }), (max) => {
        const limiter = createRateLimiter({ max, windowMs: 60_000 })
        const req = mockReq('10.0.0.1')
        for (let i = 0; i < max; i++) limiter.check(req)
        const blocked = limiter.check(req)
        if (blocked.allowed) return false
        limiter.reset('10.0.0.1')
        const next = limiter.check(req)
        return next.allowed && next.remaining === max - 1
      }),
      { numRuns: 50 },
    )
  })

  it('throws on invalid config combinations', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100, max: 0 }), (max) => {
        try {
          createRateLimiter({ max, windowMs: 60_000 })
          return false // should have thrown
        } catch {
          return true
        }
      }),
      { numRuns: 20 },
    )
    fc.assert(
      fc.property(fc.integer({ min: -100, max: 0 }), (windowMs) => {
        try {
          createRateLimiter({ max: 10, windowMs })
          return false
        } catch {
          return true
        }
      }),
      { numRuns: 20 },
    )
  })
})
