import { sign } from './signer.js'
import type { AttestEvent, AttestOptions } from './types.js'

export interface AttestClient {
  send(events: AttestEvent[]): Promise<void>
}

const DEFAULT_ENDPOINT = 'https://api.n3rd.ai/v1/events'
const DEFAULT_TIMEOUT_MS = 10_000

export function createClient(
  options: Pick<AttestOptions, 'apiKey' | 'endpoint' | 'timeoutMs' | 'fetch'>,
): AttestClient {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const fetchImpl = options.fetch ?? fetch

  return {
    async send(events: AttestEvent[]): Promise<void> {
      if (events.length === 0) return

      const body = JSON.stringify({ events })
      const signature = sign(body, options.apiKey)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const res = await fetchImpl(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N3rd-Signature': `sha256=${signature}`,
            'X-N3rd-Api-Key': options.apiKey,
            'User-Agent': '@n3rd-ai/attest',
          },
          body,
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(`n3rd.ai ingestion rejected: ${res.status} ${res.statusText}`)
        }
      } finally {
        clearTimeout(timeout)
      }
    },
  }
}
