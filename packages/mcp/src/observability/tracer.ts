/**
 * Minimal tracer interface compatible with OpenTelemetry.
 * Consumers can pass an OTel tracer directly, or a no-op for zero overhead.
 */

export interface Span {
  setAttribute(key: string, value: string | number | boolean): void
  setStatus(status: { code: 'OK' | 'ERROR'; message?: string }): void
  recordException(error: Error): void
  end(): void
}

export interface Tracer {
  startSpan(name: string, attributes?: Record<string, string | number | boolean>): Span
}

export const noopSpan: Span = {
  setAttribute: () => {},
  setStatus: () => {},
  recordException: () => {},
  end: () => {},
}

export const noopTracer: Tracer = {
  startSpan: () => noopSpan,
}

/**
 * Adapter that wraps an OpenTelemetry tracer to match the minimal `Tracer` interface.
 * Accepts any object with a `startSpan` method that returns an OTel-compatible span.
 */
export function adaptOtelTracer(otelTracer: {
  startSpan(
    name: string,
    options?: unknown,
  ): {
    setAttribute(key: string, value: unknown): unknown
    setStatus(status: { code: number; message?: string }): unknown
    recordException(error: Error): unknown
    end(): void
  }
}): Tracer {
  return {
    startSpan(name, attributes) {
      const span = otelTracer.startSpan(name, attributes ? { attributes } : undefined)
      return {
        setAttribute(key, value) {
          span.setAttribute(key, value)
        },
        setStatus(status) {
          // OTel SpanStatusCode: OK=1, ERROR=2
          span.setStatus({ code: status.code === 'OK' ? 1 : 2, message: status.message })
        },
        recordException(error) {
          span.recordException(error)
        },
        end() {
          span.end()
        },
      }
    },
  }
}
