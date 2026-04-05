/**
 * Minimal Prometheus-compatible metrics registry.
 * Zero dependencies. Thread-safe for single-process Node.js.
 */

export interface MetricLabels {
  [key: string]: string | number
}

interface CounterState {
  type: 'counter'
  help: string
  values: Map<string, number>
}

interface GaugeState {
  type: 'gauge'
  help: string
  values: Map<string, number>
}

interface HistogramState {
  type: 'histogram'
  help: string
  buckets: number[]
  values: Map<
    string,
    {
      sum: number
      count: number
      bucketCounts: number[]
      labels: MetricLabels
    }
  >
}

type MetricState = CounterState | GaugeState | HistogramState

export interface Counter {
  inc(labels?: MetricLabels, value?: number): void
}

export interface Gauge {
  set(value: number, labels?: MetricLabels): void
  inc(labels?: MetricLabels, value?: number): void
  dec(labels?: MetricLabels, value?: number): void
}

export interface Histogram {
  observe(value: number, labels?: MetricLabels): void
}

export interface MetricsRegistry {
  counter(name: string, help: string): Counter
  gauge(name: string, help: string): Gauge
  histogram(name: string, help: string, buckets?: number[]): Histogram
  render(): string
  reset(): void
}

const DEFAULT_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]

function labelKey(labels: MetricLabels | undefined): string {
  if (!labels) return ''
  return Object.keys(labels)
    .sort()
    .map((k) => `${k}="${escapeLabelValue(String(labels[k]))}"`)
    .join(',')
}

function escapeLabelValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
}

function formatLabels(labels: MetricLabels | undefined): string {
  const key = labelKey(labels)
  return key ? `{${key}}` : ''
}

export function createMetricsRegistry(): MetricsRegistry {
  const metrics = new Map<string, MetricState>()

  function register<T extends MetricState>(name: string, state: T): T {
    if (metrics.has(name)) {
      const existing = metrics.get(name)
      if (existing && existing.type === state.type) return existing as T
      throw new Error(`Metric ${name} already registered with different type`)
    }
    metrics.set(name, state)
    return state
  }

  return {
    counter(name: string, help: string): Counter {
      const state = register(name, { type: 'counter', help, values: new Map() })
      return {
        inc(labels, value = 1) {
          const key = labelKey(labels)
          state.values.set(key, (state.values.get(key) ?? 0) + value)
        },
      }
    },

    gauge(name: string, help: string): Gauge {
      const state = register(name, { type: 'gauge', help, values: new Map() })
      return {
        set(value, labels) {
          state.values.set(labelKey(labels), value)
        },
        inc(labels, value = 1) {
          const key = labelKey(labels)
          state.values.set(key, (state.values.get(key) ?? 0) + value)
        },
        dec(labels, value = 1) {
          const key = labelKey(labels)
          state.values.set(key, (state.values.get(key) ?? 0) - value)
        },
      }
    },

    histogram(name: string, help: string, buckets = DEFAULT_BUCKETS): Histogram {
      const state = register(name, {
        type: 'histogram',
        help,
        buckets: [...buckets].sort((a, b) => a - b),
        values: new Map(),
      })
      return {
        observe(value, labels) {
          const key = labelKey(labels)
          let entry = state.values.get(key)
          if (!entry) {
            entry = {
              sum: 0,
              count: 0,
              bucketCounts: new Array(state.buckets.length).fill(0),
              labels: labels ?? {},
            }
            state.values.set(key, entry)
          }
          entry.sum += value
          entry.count += 1
          for (let i = 0; i < state.buckets.length; i++) {
            if (value <= state.buckets[i]) entry.bucketCounts[i] += 1
          }
        },
      }
    },

    render(): string {
      const lines: string[] = []
      for (const [name, state] of metrics) {
        lines.push(`# HELP ${name} ${state.help}`)
        lines.push(`# TYPE ${name} ${state.type}`)

        if (state.type === 'counter' || state.type === 'gauge') {
          for (const [key, value] of state.values) {
            lines.push(`${name}${key ? `{${key}}` : ''} ${value}`)
          }
        } else {
          for (const [, entry] of state.values) {
            const base = formatLabels(entry.labels)
            for (let i = 0; i < state.buckets.length; i++) {
              const bucketLabels = { ...entry.labels, le: String(state.buckets[i]) }
              lines.push(`${name}_bucket${formatLabels(bucketLabels)} ${entry.bucketCounts[i]}`)
            }
            const infLabels = { ...entry.labels, le: '+Inf' }
            lines.push(`${name}_bucket${formatLabels(infLabels)} ${entry.count}`)
            lines.push(`${name}_sum${base} ${entry.sum}`)
            lines.push(`${name}_count${base} ${entry.count}`)
          }
        }
      }
      return lines.join('\n') + '\n'
    },

    reset() {
      metrics.clear()
    },
  }
}

export interface ServerMetrics {
  registry: MetricsRegistry
  toolCalls: Counter
  toolDuration: Histogram
  toolErrors: Counter
  sessionsActive: Gauge
  requestsTotal: Counter
}

export function createServerMetrics(registry?: MetricsRegistry): ServerMetrics {
  const reg = registry ?? createMetricsRegistry()
  return {
    registry: reg,
    toolCalls: reg.counter('mcp_tool_calls_total', 'Total MCP tool invocations'),
    toolDuration: reg.histogram('mcp_tool_duration_seconds', 'MCP tool execution time in seconds'),
    toolErrors: reg.counter('mcp_tool_errors_total', 'Total MCP tool errors'),
    sessionsActive: reg.gauge('mcp_sessions_active', 'Number of active MCP sessions'),
    requestsTotal: reg.counter('mcp_requests_total', 'Total HTTP requests to the MCP server'),
  }
}
