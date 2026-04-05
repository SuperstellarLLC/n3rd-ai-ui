/**
 * A single attestation event — one tool invocation on an MCP server.
 * Signed in batches and shipped to n3rd.ai for reputation scoring.
 */
export interface AttestEvent {
  /** Unique event id (UUID v4) */
  id: string
  /** Unix epoch milliseconds */
  ts: number
  /** MCP server name (from ServerInfo) */
  server: string
  /** Tool name */
  tool: string
  /** Execution time in milliseconds */
  duration_ms: number
  /** Outcome of the tool call */
  status: 'ok' | 'error'
  /** Truncated error message (first 200 chars), if status is error */
  error?: string
}

export interface AttestOptions {
  /** Your n3rd.ai API key (starts with `n3rd_`) */
  apiKey: string
  /**
   * Endpoint URL for event ingestion.
   * @default 'https://api.n3rd.ai/v1/events'
   */
  endpoint?: string
  /**
   * Max events per batch before auto-flush.
   * @default 100
   */
  batchSize?: number
  /**
   * Max time between flushes in milliseconds.
   * @default 5000
   */
  flushIntervalMs?: number
  /**
   * Request timeout for event delivery in milliseconds.
   * @default 10000
   */
  timeoutMs?: number
  /**
   * Disable all network activity. Events are computed but never sent.
   * Useful for tests and local development.
   * @default false
   */
  disabled?: boolean
  /**
   * Callback invoked when event delivery fails. Silent by default —
   * never breaks the MCP server.
   */
  onError?: (error: Error) => void
  /**
   * Override the fetch implementation. Defaults to global `fetch`.
   * Useful for testing and custom HTTP clients.
   */
  fetch?: typeof fetch
  /**
   * Override the process-exit handler registration.
   * Useful for testing — pass `false` to skip.
   * @default true
   */
  registerExitHandler?: boolean
}
