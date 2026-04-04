import type { IncomingMessage } from 'node:http'
import type { RateLimitConfig } from '../server/types.js'

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetSeconds: number
}

interface TokenBucket {
  tokens: number
  lastRefill: number
}

export interface RateLimiter {
  check(req: IncomingMessage): RateLimitResult
  reset(key: string): void
}

export interface RateLimiterOptions {
  logger?: { warning: (msg: string, data?: Record<string, unknown>) => void }
}

export function createRateLimiter(
  config: RateLimitConfig,
  options?: RateLimiterOptions,
): RateLimiter {
  const windowMs = config.windowMs ?? 60_000
  const max = config.max ?? 120

  if (max <= 0) throw new Error('Rate limit max must be greater than 0')
  if (windowMs <= 0) throw new Error('Rate limit windowMs must be greater than 0')

  const trustProxy = config.trustProxy ?? false
  if (trustProxy && options?.logger) {
    options.logger.warning(
      'Rate limiter trustProxy is enabled — X-Forwarded-For will be trusted. Only use behind a reverse proxy that overwrites this header.',
    )
  }
  const keyGen =
    config.keyGenerator ??
    ((req: Parameters<NonNullable<RateLimitConfig['keyGenerator']>>[0]) =>
      defaultKeyGenerator(req, trustProxy))
  const maxBuckets = 100_000
  const buckets = new Map<string, TokenBucket>()

  // Periodic cleanup of stale buckets
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets) {
      if (now - bucket.lastRefill > windowMs * 2) {
        buckets.delete(key)
      }
    }
  }, windowMs)
  cleanupInterval.unref()

  function getBucket(key: string): TokenBucket {
    const now = Date.now()
    let bucket = buckets.get(key)

    if (!bucket) {
      // Evict oldest entry if at capacity
      if (buckets.size >= maxBuckets) {
        const firstKey = buckets.keys().next().value
        if (firstKey !== undefined) buckets.delete(firstKey)
      }
      bucket = { tokens: max, lastRefill: now }
      buckets.set(key, bucket)
      return bucket
    }

    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill
    if (elapsed > 0) {
      const refill = (elapsed / windowMs) * max
      bucket.tokens = Math.min(max, bucket.tokens + refill)
      bucket.lastRefill = now
    }

    return bucket
  }

  return {
    check(req: IncomingMessage): RateLimitResult {
      const key = keyGen(req as Parameters<NonNullable<RateLimitConfig['keyGenerator']>>[0])
      const bucket = getBucket(key)

      if (bucket.tokens >= 1) {
        bucket.tokens -= 1
        return {
          allowed: true,
          limit: max,
          remaining: Math.floor(bucket.tokens),
          resetSeconds: Math.ceil(windowMs / 1000),
        }
      }

      // Calculate time until one token is available
      const tokenRefillRate = windowMs / max
      const resetSeconds = Math.ceil(tokenRefillRate / 1000)

      return {
        allowed: false,
        limit: max,
        remaining: 0,
        resetSeconds,
      }
    },

    reset(key: string) {
      buckets.delete(key)
    },
  }
}

function defaultKeyGenerator(
  req: {
    headers: Record<string, string | string[] | undefined>
    socket?: { remoteAddress?: string }
  },
  trustProxy: boolean,
): string {
  if (trustProxy) {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
    if (Array.isArray(forwarded) && forwarded.length > 0) return forwarded[0].split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}
