import { describe, it, expect } from 'vitest'
import { buildHealthHandler, buildReadyHandler } from '../src/health/index.js'

describe('buildHealthHandler', () => {
  it('returns ok status', () => {
    const handler = buildHealthHandler()
    const result = handler()
    expect(result.status).toBe('ok')
  })

  it('omits uptime by default', () => {
    const handler = buildHealthHandler()
    const result = handler()
    expect(result.uptime).toBeUndefined()
  })

  it('includes uptime when verbose', () => {
    const handler = buildHealthHandler(true)
    const result = handler()
    expect(result.uptime).toBeGreaterThanOrEqual(0)
  })
})

describe('buildReadyHandler', () => {
  it('returns minimal response by default (non-verbose)', async () => {
    const handler = buildReadyHandler({})
    const result = await handler()
    expect(result.status).toBe('ready')
    expect(result.uptime).toBeUndefined()
    expect(result.checks).toBeUndefined()
  })

  it('includes memory check when verbose', async () => {
    const handler = buildReadyHandler({}, true)
    const result = await handler()
    expect(result.status).toBe('ready')
    expect(result.checks?.memory).toBeDefined()
    expect(result.uptime).toBeGreaterThanOrEqual(0)
  })

  it('returns ready when all checks pass', async () => {
    const handler = buildReadyHandler({
      database: async () => ({ status: 'ok', latency_ms: 2 }),
      cache: async () => ({ status: 'ok', latency_ms: 1 }),
    })
    const result = await handler()
    expect(result.status).toBe('ready')
    expect(result.checks?.database.status).toBe('ok')
    expect(result.checks?.cache.status).toBe('ok')
  })

  it('returns not_ready when a check fails', async () => {
    const handler = buildReadyHandler({
      database: async () => ({ status: 'error', details: 'connection refused' }),
    })
    const result = await handler()
    expect(result.status).toBe('not_ready')
    expect(result.checks?.database.status).toBe('error')
  })

  it('handles check that throws', async () => {
    const handler = buildReadyHandler({
      database: async () => {
        throw new Error('connection timeout')
      },
    })
    const result = await handler()
    expect(result.status).toBe('not_ready')
    expect(result.checks?.database.status).toBe('error')
    expect(result.checks?.database.details).toBe('connection timeout')
  })

  it('measures check latency', async () => {
    const handler = buildReadyHandler({
      slow: async () => {
        await new Promise((r) => setTimeout(r, 10))
        return { status: 'ok' }
      },
    })
    const result = await handler()
    expect(result.checks?.slow.latency_ms).toBeGreaterThanOrEqual(0)
  })

  it('includes memory check when verbose with custom checks', async () => {
    const handler = buildReadyHandler(
      {
        custom: async () => ({ status: 'ok' }),
      },
      true,
    )
    const result = await handler()
    expect(result.checks?.memory).toBeDefined()
  })

  it('omits memory check when non-verbose with custom checks', async () => {
    const handler = buildReadyHandler({
      custom: async () => ({ status: 'ok' }),
    })
    const result = await handler()
    expect(result.checks?.memory).toBeUndefined()
    expect(result.checks?.custom.status).toBe('ok')
  })
})
