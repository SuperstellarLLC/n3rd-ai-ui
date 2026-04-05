import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { attest } from '../src/attest.js'
import type { AttestEvent } from '../src/types.js'

describe('attest', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('throws when apiKey is missing and not disabled', () => {
    expect(() => attest({ apiKey: '' })).toThrow(/apiKey/)
  })

  it('does not throw when disabled without apiKey', () => {
    expect(() => attest({ apiKey: '', disabled: true })).not.toThrow()
  })

  it('emits an event on span end with correct shape', async () => {
    const sent: AttestEvent[] = []
    const fetchImpl = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string)
      sent.push(...body.events)
      return new Response(null, { status: 200 })
    })
    const tracer = attest({
      apiKey: 'k',
      batchSize: 1,
      fetch: fetchImpl as unknown as typeof fetch,
      registerExitHandler: false,
    })

    const span = tracer.startSpan('mcp.tool/search', {
      'mcp.tool.name': 'search',
      'mcp.server.name': 'my-server',
    })
    span.end()

    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()

    expect(sent).toHaveLength(1)
    expect(sent[0].tool).toBe('search')
    expect(sent[0].server).toBe('my-server')
    expect(sent[0].status).toBe('ok')
    expect(sent[0].duration_ms).toBeGreaterThanOrEqual(0)
    expect(sent[0].id).toMatch(/^[0-9a-f-]{36}$/)

    await tracer.close()
  })

  it('strips mcp.tool/ prefix if no explicit tool name', async () => {
    const sent: AttestEvent[] = []
    const tracer = attest({
      apiKey: 'k',
      disabled: false,
      batchSize: 1,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })
    tracer.startSpan('mcp.tool/prefixed').end()
    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    expect(sent[0].tool).toBe('prefixed')
    await tracer.close()
  })

  it('records error status from setStatus', async () => {
    const sent: AttestEvent[] = []
    const tracer = attest({
      apiKey: 'k',
      batchSize: 1,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })
    const span = tracer.startSpan('mcp.tool/fail', { 'mcp.tool.name': 'fail' })
    span.setStatus({ code: 'ERROR', message: 'database unreachable' })
    span.end()
    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    expect(sent[0].status).toBe('error')
    expect(sent[0].error).toBe('database unreachable')
    await tracer.close()
  })

  it('records error from recordException', async () => {
    const sent: AttestEvent[] = []
    const tracer = attest({
      apiKey: 'k',
      batchSize: 1,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })
    const span = tracer.startSpan('mcp.tool/throw', { 'mcp.tool.name': 'throw' })
    span.recordException(new Error('boom'))
    span.end()
    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    expect(sent[0].status).toBe('error')
    expect(sent[0].error).toBe('boom')
    await tracer.close()
  })

  it('truncates long error messages to 200 chars', async () => {
    const sent: AttestEvent[] = []
    const longMsg = 'x'.repeat(500)
    const tracer = attest({
      apiKey: 'k',
      batchSize: 1,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })
    const span = tracer.startSpan('mcp.tool/x', { 'mcp.tool.name': 'x' })
    span.recordException(new Error(longMsg))
    span.end()
    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    expect(sent[0].error?.length).toBe(200)
    await tracer.close()
  })

  it('end is idempotent — calling twice does not emit twice', async () => {
    const sent: AttestEvent[] = []
    const tracer = attest({
      apiKey: 'k',
      batchSize: 10,
      flushIntervalMs: 100,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })
    const span = tracer.startSpan('mcp.tool/x', { 'mcp.tool.name': 'x' })
    span.end()
    span.end()
    span.end()
    await tracer.flush()
    expect(sent).toHaveLength(1)
    await tracer.close()
  })

  it('pending() returns the current queue size', () => {
    const tracer = attest({
      apiKey: 'k',
      batchSize: 100,
      flushIntervalMs: 10_000,
      fetch: vi.fn() as unknown as typeof fetch,
      registerExitHandler: false,
    })
    tracer.startSpan('mcp.tool/a', { 'mcp.tool.name': 'a' }).end()
    tracer.startSpan('mcp.tool/b', { 'mcp.tool.name': 'b' }).end()
    expect(tracer.pending()).toBe(2)
  })

  it('setAttribute is a no-op', () => {
    const tracer = attest({
      apiKey: 'k',
      disabled: true,
      registerExitHandler: false,
    })
    const span = tracer.startSpan('mcp.tool/x', { 'mcp.tool.name': 'x' })
    expect(() => span.setAttribute('key', 'value')).not.toThrow()
  })

  it('falls back to "unknown" server name when not provided', async () => {
    const sent: AttestEvent[] = []
    const tracer = attest({
      apiKey: 'k',
      batchSize: 1,
      fetch: (async (_url: string, init: RequestInit) => {
        sent.push(...JSON.parse(init.body as string).events)
        return new Response(null, { status: 200 })
      }) as unknown as typeof fetch,
      registerExitHandler: false,
    })
    tracer.startSpan('mcp.tool/x').end()
    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    expect(sent[0].server).toBe('unknown')
    await tracer.close()
  })

  it('never throws from span.end() even if batcher is broken', () => {
    const tracer = attest({
      apiKey: 'k',
      disabled: true,
      registerExitHandler: false,
    })
    const span = tracer.startSpan('mcp.tool/x', { 'mcp.tool.name': 'x' })
    expect(() => span.end()).not.toThrow()
  })
})
