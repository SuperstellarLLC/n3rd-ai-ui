/**
 * End-to-end tests: full MCP protocol flow over HTTP using the SDK's real Client.
 * initialize → tools/list → tools/call → DELETE session
 * Plus: /metrics endpoint integration, tool span tracing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { z } from 'zod'
import { createN3rdServer } from '../src/server/index.js'
import type { N3rdServer } from '../src/server/types.js'
import type { Tracer, Span } from '../src/observability/index.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

let server: N3rdServer | undefined

afterEach(async () => {
  if (server) {
    await server.stop()
    server = undefined
  }
})

function port(s: N3rdServer): number {
  const a = s.address()
  if (!a) throw new Error('not listening')
  return a.port
}

describe('E2E MCP protocol flow over HTTP', () => {
  it('completes initialize → list → call → close round-trip', async () => {
    server = createN3rdServer(
      {
        server: { name: 'e2e-server', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool(
          'echo',
          {
            description: 'Echo the input',
            inputSchema: { message: z.string() },
          },
          (args) => ({
            content: [{ type: 'text', text: `echo: ${args.message}` }],
          }),
        )
      },
    )
    await server.start()

    const url = new URL(`http://127.0.0.1:${port(server)}/mcp`)
    const client = new Client({ name: 'e2e-client', version: '1.0.0' })
    const transport = new StreamableHTTPClientTransport(url)
    await client.connect(transport)

    const tools = await client.listTools()
    expect(tools.tools).toHaveLength(1)
    expect(tools.tools[0].name).toBe('echo')

    const result = await client.callTool({ name: 'echo', arguments: { message: 'hi' } })
    const content = result.content as Array<{ type: string; text?: string }>
    expect(content[0].text).toBe('echo: hi')

    await client.close()
  })

  it('increments tool call metrics on each invocation', async () => {
    server = createN3rdServer(
      {
        server: { name: 'metrics-server', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool('ping', { description: 'ping' }, () => ({
          content: [{ type: 'text', text: 'pong' }],
        }))
      },
    )
    await server.start()

    const url = new URL(`http://127.0.0.1:${port(server)}/mcp`)
    const client = new Client({ name: 'c', version: '1.0.0' })
    await client.connect(new StreamableHTTPClientTransport(url))

    await client.callTool({ name: 'ping' })
    await client.callTool({ name: 'ping' })
    await client.close()

    const output = server.metrics.registry.render()
    expect(output).toContain('mcp_tool_calls_total{tool="ping"} 2')
    expect(output).toContain('mcp_tool_duration_seconds_count{tool="ping"} 2')
  })

  it('records tool errors in metrics', async () => {
    server = createN3rdServer(
      {
        server: { name: 'err-server', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool('boom', { description: 'explodes' }, () => ({
          content: [{ type: 'text', text: 'error message' }],
          isError: true,
        }))
      },
    )
    await server.start()

    const url = new URL(`http://127.0.0.1:${port(server)}/mcp`)
    const client = new Client({ name: 'c', version: '1.0.0' })
    await client.connect(new StreamableHTTPClientTransport(url))
    await client.callTool({ name: 'boom' })
    await client.close()

    const output = server.metrics.registry.render()
    expect(output).toContain('mcp_tool_errors_total{kind="soft",tool="boom"} 1')
  })

  it('tracks active sessions via gauge', async () => {
    server = createN3rdServer(
      {
        server: { name: 'session-server', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool('ping', { description: 'ping' }, () => ({
          content: [{ type: 'text', text: 'pong' }],
        }))
      },
    )
    await server.start()

    const url = new URL(`http://127.0.0.1:${port(server)}/mcp`)
    const c1 = new Client({ name: 'c1', version: '1.0.0' })
    const c2 = new Client({ name: 'c2', version: '1.0.0' })
    await c1.connect(new StreamableHTTPClientTransport(url))
    await c2.connect(new StreamableHTTPClientTransport(url))

    const output = server.metrics.registry.render()
    expect(output).toContain('mcp_sessions_active 2')

    await c1.close()
    await c2.close()
  })

  it('serves /metrics endpoint with Prometheus format', async () => {
    server = createN3rdServer(
      {
        server: { name: 's', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()

    const res = await fetch(`http://127.0.0.1:${port(server)}/metrics`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/plain')
    const body = await res.text()
    expect(body).toContain('# TYPE mcp_tool_calls_total counter')
    expect(body).toContain('# TYPE mcp_sessions_active gauge')
  })
})

describe('Tracer integration', () => {
  it('creates and ends a span per tool call', async () => {
    const spans: Array<{
      name: string
      attributes: Record<string, string | number | boolean>
      status?: { code: string; message?: string }
      ended: boolean
    }> = []

    const tracer: Tracer = {
      startSpan: (name, attributes) => {
        const entry = { name, attributes: { ...(attributes ?? {}) }, ended: false } as {
          name: string
          attributes: Record<string, string | number | boolean>
          status?: { code: string; message?: string }
          ended: boolean
        }
        spans.push(entry)
        const span: Span = {
          setAttribute(k, v) {
            entry.attributes[k] = v
          },
          setStatus(s) {
            entry.status = s
          },
          recordException: vi.fn(),
          end() {
            entry.ended = true
          },
        }
        return span
      },
    }

    server = createN3rdServer(
      {
        server: { name: 'trace', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
        observability: { tracer },
      },
      (mcp) => {
        mcp.registerTool('traced', { description: 't' }, () => ({
          content: [{ type: 'text', text: 'ok' }],
        }))
      },
    )
    await server.start()

    const url = new URL(`http://127.0.0.1:${port(server)}/mcp`)
    const client = new Client({ name: 'c', version: '1.0.0' })
    await client.connect(new StreamableHTTPClientTransport(url))
    await client.callTool({ name: 'traced' })
    await client.close()

    const toolSpan = spans.find((s) => s.name === 'mcp.tool/traced')
    expect(toolSpan).toBeDefined()
    if (!toolSpan) return
    expect(toolSpan.attributes['mcp.tool.name']).toBe('traced')
    expect(toolSpan.attributes['mcp.server.name']).toBe('trace')
    expect(toolSpan.ended).toBe(true)
    expect(toolSpan.status?.code).toBe('OK')
  })
})
