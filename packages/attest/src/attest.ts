import { randomUUID } from 'node:crypto'
import type { Tracer, Span } from '@n3rd-ai/mcp'
import { createBatcher, type Batcher } from './batcher.js'
import { createClient } from './client.js'
import type { AttestEvent, AttestOptions } from './types.js'

const TOOL_NAME_PREFIX = 'mcp.tool/'
const ERROR_MESSAGE_MAX_LEN = 200

export interface AttestTracer extends Tracer {
  /** Pending events in the buffer (for tests and introspection) */
  readonly pending: () => number
  /** Manually flush pending events */
  flush(): Promise<void>
  /** Stop the batcher and flush pending events */
  close(): Promise<void>
}

/**
 * Create a reputation tracer for an MCP server.
 *
 * Every tool invocation becomes a signed attestation event shipped to n3rd.ai.
 * Zero impact on your server — events are batched, flushed async, and delivery
 * failures are silent by default (pass `onError` to observe them).
 *
 * @example
 * ```ts
 * import { createN3rdServer } from '@n3rd-ai/mcp'
 * import { attest } from '@n3rd-ai/attest'
 *
 * createN3rdServer({
 *   server: { name: 'weather', version: '1.0.0' },
 *   transport: { type: 'http' },
 *   observability: { tracer: attest({ apiKey: process.env.N3RD_KEY! }) },
 * }, (mcp) => {
 *   // register your tools as usual
 * })
 * ```
 */
export function attest(options: AttestOptions): AttestTracer {
  if (!options.apiKey && !options.disabled) {
    throw new Error('attest: apiKey is required (or set disabled: true)')
  }

  const client = createClient(options)
  const batcher: Batcher = createBatcher({ client, options })

  return {
    startSpan(name: string, attributes) {
      const toolName =
        typeof attributes?.['mcp.tool.name'] === 'string'
          ? (attributes['mcp.tool.name'] as string)
          : stripPrefix(name)
      const serverName =
        typeof attributes?.['mcp.server.name'] === 'string'
          ? (attributes['mcp.server.name'] as string)
          : 'unknown'

      const startNs = process.hrtime.bigint()
      let status: 'ok' | 'error' = 'ok'
      let errorMessage: string | undefined
      let ended = false

      const span: Span = {
        setAttribute() {
          /* attest doesn't need arbitrary attributes */
        },
        setStatus(s) {
          if (s.code === 'ERROR') {
            status = 'error'
            if (s.message && !errorMessage) errorMessage = truncate(s.message)
          }
        },
        recordException(err) {
          status = 'error'
          if (!errorMessage) errorMessage = truncate(err.message)
        },
        end() {
          if (ended) return
          ended = true
          const durationMs = Number(process.hrtime.bigint() - startNs) / 1e6
          const event: AttestEvent = {
            id: randomUUID(),
            ts: Date.now(),
            server: serverName,
            tool: toolName,
            duration_ms: Math.round(durationMs * 1000) / 1000,
            status,
          }
          if (errorMessage) event.error = errorMessage
          // Never throw from span.end() — it would break user code
          try {
            batcher.add(event)
          } catch {
            /* swallow */
          }
        },
      }

      return span
    },

    pending: () => batcher.size(),
    flush: () => batcher.flush(),
    close: () => batcher.close(),
  }
}

function stripPrefix(name: string): string {
  return name.startsWith(TOOL_NAME_PREFIX) ? name.slice(TOOL_NAME_PREFIX.length) : name
}

function truncate(msg: string): string {
  return msg.length > ERROR_MESSAGE_MAX_LEN ? msg.slice(0, ERROR_MESSAGE_MAX_LEN) : msg
}
