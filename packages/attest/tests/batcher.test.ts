import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createBatcher } from '../src/batcher.js'
import type { AttestClient } from '../src/client.js'
import type { AttestEvent } from '../src/types.js'

function event(overrides: Partial<AttestEvent> = {}): AttestEvent {
  return {
    id: Math.random().toString(36).slice(2),
    ts: Date.now(),
    server: 'test',
    tool: 'ping',
    duration_ms: 1,
    status: 'ok',
    ...overrides,
  }
}

function mockClient() {
  const sent: AttestEvent[][] = []
  const client: AttestClient = {
    async send(events) {
      sent.push(events)
    },
  }
  return { client, sent }
}

describe('createBatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('queues events without sending when below batchSize', () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { batchSize: 3, flushIntervalMs: 1000, registerExitHandler: false },
    })
    batcher.add(event())
    batcher.add(event())
    expect(sent).toHaveLength(0)
    expect(batcher.size()).toBe(2)
  })

  it('auto-flushes when batchSize is reached', async () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { batchSize: 2, flushIntervalMs: 1000, registerExitHandler: false },
    })
    batcher.add(event({ tool: 'a' }))
    batcher.add(event({ tool: 'b' }))
    await vi.runOnlyPendingTimersAsync()
    // Give the microtask queue a tick
    await Promise.resolve()
    expect(sent).toHaveLength(1)
    expect(sent[0]).toHaveLength(2)
  })

  it('flushes on interval', async () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { batchSize: 100, flushIntervalMs: 1000, registerExitHandler: false },
    })
    batcher.add(event())
    batcher.add(event())
    expect(sent).toHaveLength(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(sent).toHaveLength(1)
    expect(sent[0]).toHaveLength(2)
  })

  it('close flushes remaining events', async () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { batchSize: 100, flushIntervalMs: 10_000, registerExitHandler: false },
    })
    batcher.add(event())
    await batcher.close()
    expect(sent).toHaveLength(1)
    expect(sent[0]).toHaveLength(1)
  })

  it('close is idempotent', async () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { batchSize: 100, flushIntervalMs: 10_000, registerExitHandler: false },
    })
    batcher.add(event())
    await batcher.close()
    await batcher.close()
    expect(sent).toHaveLength(1)
  })

  it('drops events added after close', async () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { batchSize: 100, flushIntervalMs: 10_000, registerExitHandler: false },
    })
    await batcher.close()
    batcher.add(event())
    await batcher.flush()
    expect(sent).toHaveLength(0)
  })

  it('calls onError when client fails', async () => {
    const failingClient: AttestClient = {
      async send() {
        throw new Error('network down')
      },
    }
    const onError = vi.fn()
    const batcher = createBatcher({
      client: failingClient,
      options: {
        batchSize: 1,
        flushIntervalMs: 1000,
        onError,
        registerExitHandler: false,
      },
    })
    batcher.add(event())
    await vi.runOnlyPendingTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    expect((onError.mock.calls[0][0] as Error).message).toContain('network down')
  })

  it('never throws even if onError throws', async () => {
    const failingClient: AttestClient = {
      async send() {
        throw new Error('fail')
      },
    }
    const batcher = createBatcher({
      client: failingClient,
      options: {
        batchSize: 1,
        onError: () => {
          /* deliberately silent */
        },
        registerExitHandler: false,
      },
    })
    batcher.add(event())
    // Should not throw despite both send and onError happening
    await expect(vi.runOnlyPendingTimersAsync()).resolves.not.toThrow()
  })

  it('disabled mode drops all events silently', async () => {
    const { client, sent } = mockClient()
    const batcher = createBatcher({
      client,
      options: { disabled: true, registerExitHandler: false },
    })
    batcher.add(event())
    batcher.add(event())
    await batcher.flush()
    expect(sent).toHaveLength(0)
    expect(batcher.size()).toBe(0)
  })

  it('flush resolves on empty queue', async () => {
    const { client } = mockClient()
    const batcher = createBatcher({
      client,
      options: { registerExitHandler: false },
    })
    await expect(batcher.flush()).resolves.toBeUndefined()
  })
})
