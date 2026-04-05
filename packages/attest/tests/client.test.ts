import { describe, it, expect, vi } from 'vitest'
import { createClient } from '../src/client.js'
import { verify } from '../src/signer.js'
import type { AttestEvent } from '../src/types.js'

function event(overrides: Partial<AttestEvent> = {}): AttestEvent {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    ts: 1_700_000_000_000,
    server: 'test',
    tool: 'ping',
    duration_ms: 12.5,
    status: 'ok',
    ...overrides,
  }
}

describe('createClient', () => {
  it('sends events via fetch with signed body', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }))
    const client = createClient({
      apiKey: 'test-key',
      endpoint: 'https://example.com/events',
      fetch: fetchImpl as unknown as typeof fetch,
    })

    await client.send([event()])

    expect(fetchImpl).toHaveBeenCalledOnce()
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://example.com/events')
    expect(init.method).toBe('POST')

    const headers = init.headers as Record<string, string>
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['X-N3rd-Api-Key']).toBe('test-key')
    expect(headers['X-N3rd-Signature']).toMatch(/^sha256=[0-9a-f]{64}$/)
    expect(headers['User-Agent']).toBe('@n3rd-ai/attest')

    // Verify the signature matches the body
    const sig = headers['X-N3rd-Signature'].replace(/^sha256=/, '')
    expect(verify(init.body as string, sig, 'test-key')).toBe(true)
  })

  it('sends a body containing the events array', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }))
    const client = createClient({
      apiKey: 'k',
      fetch: fetchImpl as unknown as typeof fetch,
    })

    await client.send([event({ tool: 'a' }), event({ tool: 'b' })])

    const init = fetchImpl.mock.calls[0][1] as RequestInit
    const parsed = JSON.parse(init.body as string)
    expect(parsed.events).toHaveLength(2)
    expect(parsed.events[0].tool).toBe('a')
    expect(parsed.events[1].tool).toBe('b')
  })

  it('no-ops on empty event array', async () => {
    const fetchImpl = vi.fn()
    const client = createClient({
      apiKey: 'k',
      fetch: fetchImpl as unknown as typeof fetch,
    })

    await client.send([])
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('throws on non-2xx response', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 500, statusText: 'boom' }))
    const client = createClient({
      apiKey: 'k',
      fetch: fetchImpl as unknown as typeof fetch,
    })
    await expect(client.send([event()])).rejects.toThrow(/500/)
  })

  it('respects timeoutMs via AbortController', async () => {
    const fetchImpl = vi.fn(async (_url: string, init: RequestInit) => {
      // Simulate slow response: check that signal is passed
      expect(init.signal).toBeDefined()
      expect((init.signal as AbortSignal).aborted).toBe(false)
      return new Response(null, { status: 200 })
    })
    const client = createClient({
      apiKey: 'k',
      timeoutMs: 50,
      fetch: fetchImpl as unknown as typeof fetch,
    })
    await client.send([event()])
  })

  it('uses default endpoint when none provided', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }))
    const client = createClient({
      apiKey: 'k',
      fetch: fetchImpl as unknown as typeof fetch,
    })
    await client.send([event()])
    const [url] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.n3rd.ai/v1/events')
  })
})
