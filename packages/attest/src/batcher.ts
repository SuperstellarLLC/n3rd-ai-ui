import type { AttestClient } from './client.js'
import type { AttestEvent, AttestOptions } from './types.js'

export interface Batcher {
  add(event: AttestEvent): void
  flush(): Promise<void>
  size(): number
  close(): Promise<void>
}

export interface BatcherDeps {
  client: AttestClient
  options: Pick<
    AttestOptions,
    'batchSize' | 'flushIntervalMs' | 'onError' | 'disabled' | 'registerExitHandler'
  >
}

const DEFAULT_BATCH_SIZE = 100
const DEFAULT_FLUSH_INTERVAL_MS = 5_000

export function createBatcher(deps: BatcherDeps): Batcher {
  const batchSize = deps.options.batchSize ?? DEFAULT_BATCH_SIZE
  const flushIntervalMs = deps.options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS
  const onError = deps.options.onError ?? (() => {})
  const disabled = deps.options.disabled ?? false
  const registerExit = deps.options.registerExitHandler ?? true

  let queue: AttestEvent[] = []
  let closed = false
  let timer: ReturnType<typeof setInterval> | undefined

  async function flush(): Promise<void> {
    if (queue.length === 0 || disabled) {
      queue = []
      return
    }
    const batch = queue
    queue = []
    try {
      await deps.client.send(batch)
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  function scheduleFlush(): void {
    if (timer || disabled) return
    timer = setInterval(() => {
      void flush()
    }, flushIntervalMs)
    timer.unref()
  }

  // Best-effort final flush on process exit
  const exitHandler = (): void => {
    if (queue.length > 0) void flush()
  }
  if (registerExit && !disabled) {
    process.once('beforeExit', exitHandler)
  }

  return {
    add(event: AttestEvent): void {
      if (closed || disabled) return
      queue.push(event)
      if (queue.length >= batchSize) {
        // Fire-and-forget: never block the caller
        void flush()
      }
      scheduleFlush()
    },

    flush,

    size(): number {
      return queue.length
    },

    async close(): Promise<void> {
      if (closed) return
      closed = true
      if (timer) {
        clearInterval(timer)
        timer = undefined
      }
      if (registerExit && !disabled) {
        process.removeListener('beforeExit', exitHandler)
      }
      await flush()
    },
  }
}
