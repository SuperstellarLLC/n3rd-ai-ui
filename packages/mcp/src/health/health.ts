import type { HealthCheckResult } from '../server/types.js'

export interface HealthResponse {
  status: 'ok'
  uptime?: number
}

export interface ReadyResponse {
  status: 'ready' | 'not_ready'
  uptime?: number
  checks?: Record<string, HealthCheckResult>
}

export function buildHealthHandler(verbose = false): () => HealthResponse {
  const startTime = Date.now()

  return () => {
    const res: HealthResponse = { status: 'ok' }
    if (verbose) res.uptime = Math.floor((Date.now() - startTime) / 1000)
    return res
  }
}

export function buildReadyHandler(
  checks: Record<string, () => Promise<HealthCheckResult>>,
  verbose = false,
): () => Promise<ReadyResponse> {
  const startTime = Date.now()

  return async () => {
    const results: Record<string, HealthCheckResult> = {}
    let allOk = true

    const entries = Object.entries(checks)

    if (entries.length === 0 && !verbose) {
      return { status: 'ready' }
    }

    if (entries.length === 0) {
      return {
        status: 'ready',
        uptime: Math.floor((Date.now() - startTime) / 1000),
        checks: { memory: getMemoryCheck() },
      }
    }

    await Promise.allSettled(
      entries.map(async ([name, check]) => {
        const start = Date.now()
        try {
          const result = await check()
          results[name] = { ...result, latency_ms: Date.now() - start }
          if (result.status !== 'ok') allOk = false
        } catch (err) {
          results[name] = {
            status: 'error',
            latency_ms: Date.now() - start,
            details: err instanceof Error ? err.message : String(err),
          }
          allOk = false
        }
      }),
    )

    if (verbose) {
      results.memory = getMemoryCheck()
    }

    const res: ReadyResponse = {
      status: allOk ? 'ready' : 'not_ready',
    }
    if (verbose) res.uptime = Math.floor((Date.now() - startTime) / 1000)
    if (Object.keys(results).length > 0) res.checks = results
    return res
  }
}

function getMemoryCheck(): HealthCheckResult {
  const usage = process.memoryUsage()
  const heapPercent = Math.round((usage.heapUsed / usage.heapTotal) * 100)
  return {
    status: heapPercent < 90 ? 'ok' : 'error',
    details: `heap ${heapPercent}% (${Math.round(usage.heapUsed / 1024 / 1024)}MB / ${Math.round(usage.heapTotal / 1024 / 1024)}MB)`,
  }
}
