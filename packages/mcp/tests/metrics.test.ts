import { describe, it, expect } from 'vitest'
import { createMetricsRegistry, createServerMetrics } from '../src/metrics/index.js'

describe('createMetricsRegistry', () => {
  it('creates a counter and increments', () => {
    const reg = createMetricsRegistry()
    const c = reg.counter('http_requests_total', 'Total HTTP requests')
    c.inc()
    c.inc({ method: 'GET' })
    c.inc({ method: 'GET' }, 3)
    const out = reg.render()
    expect(out).toContain('# HELP http_requests_total Total HTTP requests')
    expect(out).toContain('# TYPE http_requests_total counter')
    expect(out).toContain('http_requests_total 1')
    expect(out).toContain('http_requests_total{method="GET"} 4')
  })

  it('creates a gauge with set/inc/dec', () => {
    const reg = createMetricsRegistry()
    const g = reg.gauge('active_connections', 'Active connections')
    g.set(10)
    g.inc()
    g.dec({ pool: 'db' }, 2)
    const out = reg.render()
    expect(out).toContain('# TYPE active_connections gauge')
    expect(out).toContain('active_connections 11')
    expect(out).toContain('active_connections{pool="db"} -2')
  })

  it('creates a histogram with buckets', () => {
    const reg = createMetricsRegistry()
    const h = reg.histogram('request_duration_seconds', 'Request duration', [0.1, 0.5, 1])
    h.observe(0.05, { route: '/a' })
    h.observe(0.3, { route: '/a' })
    h.observe(0.8, { route: '/a' })
    const out = reg.render()
    expect(out).toContain('# TYPE request_duration_seconds histogram')
    expect(out).toContain('request_duration_seconds_bucket{le="0.1",route="/a"} 1')
    expect(out).toContain('request_duration_seconds_bucket{le="0.5",route="/a"} 2')
    expect(out).toContain('request_duration_seconds_bucket{le="1",route="/a"} 3')
    expect(out).toContain('request_duration_seconds_bucket{le="+Inf",route="/a"} 3')
    expect(out).toContain('request_duration_seconds_count{route="/a"} 3')
  })

  it('sorts labels for stable keys', () => {
    const reg = createMetricsRegistry()
    const c = reg.counter('ordered', 'ordered labels')
    c.inc({ b: '2', a: '1' })
    c.inc({ a: '1', b: '2' })
    const out = reg.render()
    expect(out).toContain('ordered{a="1",b="2"} 2')
  })

  it('escapes quotes and backslashes in label values', () => {
    const reg = createMetricsRegistry()
    const c = reg.counter('escaped', 'test')
    c.inc({ path: 'a"b\\c' })
    const out = reg.render()
    expect(out).toContain('a\\"b\\\\c')
  })

  it('throws on metric type conflict', () => {
    const reg = createMetricsRegistry()
    reg.counter('dup', 'dup help')
    expect(() => reg.gauge('dup', 'dup help')).toThrow(/different type/)
  })

  it('returns same instance for duplicate registration with same type', () => {
    const reg = createMetricsRegistry()
    const a = reg.counter('c', 'help')
    const b = reg.counter('c', 'help')
    a.inc()
    b.inc()
    expect(reg.render()).toContain('c 2')
  })

  it('reset clears all metrics', () => {
    const reg = createMetricsRegistry()
    reg.counter('c', 'h').inc()
    reg.reset()
    expect(reg.render()).toBe('\n')
  })
})

describe('createServerMetrics', () => {
  it('exposes standard MCP metrics', () => {
    const sm = createServerMetrics()
    sm.toolCalls.inc({ tool: 'search' })
    sm.toolDuration.observe(0.15, { tool: 'search' })
    sm.toolErrors.inc({ tool: 'search', kind: 'throw' })
    sm.sessionsActive.set(7)
    sm.requestsTotal.inc({ method: 'POST' })
    const out = sm.registry.render()
    expect(out).toContain('mcp_tool_calls_total{tool="search"} 1')
    expect(out).toContain('mcp_tool_duration_seconds_sum{tool="search"}')
    expect(out).toContain('mcp_tool_errors_total{kind="throw",tool="search"} 1')
    expect(out).toContain('mcp_sessions_active 7')
    expect(out).toContain('mcp_requests_total{method="POST"} 1')
  })

  it('accepts a shared registry', () => {
    const reg = createMetricsRegistry()
    const sm = createServerMetrics(reg)
    sm.toolCalls.inc()
    // Same registry instance
    expect(sm.registry).toBe(reg)
    expect(reg.render()).toContain('mcp_tool_calls_total')
  })
})
