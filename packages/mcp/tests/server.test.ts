import { describe, it, expect, afterEach } from 'vitest'
import { createBoumServer } from '../src/server/index.js'
import type { BoumServer } from '../src/server/types.js'

let server: BoumServer | undefined

afterEach(async () => {
  if (server) {
    await server.stop()
    server = undefined
  }
})

function getPort(s: BoumServer): number {
  const addr = s.address()
  if (!addr) throw new Error('Server not listening')
  return addr.port
}

describe('createBoumServer', () => {
  it('creates a server with required fields', () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0 } },
      },
      () => {},
    )
    expect(server.info.name).toBe('test')
    expect(server.info.version).toBe('1.0.0')
  })

  it('provides a logger', () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0 } },
      },
      () => {},
    )
    expect(server.logger).toBeDefined()
    expect(typeof server.logger.info).toBe('function')
    expect(typeof server.logger.error).toBe('function')
    expect(typeof server.logger.critical).toBe('function')
  })

  it('setLogLevel changes the log level', () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0 } },
      },
      () => {},
    )
    server.setLogLevel('debug')
    server.setLogLevel('error')
  })

  it('address() returns null before start', () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0 } },
      },
      () => {},
    )
    expect(server.address()).toBeNull()
  })

  it('address() returns bound address after start', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const addr = server.address()
    expect(addr).not.toBeNull()
    expect(addr?.port).toBeGreaterThan(0)
    expect(addr?.address).toBe('127.0.0.1')
  })

  it('starts and stops HTTP server', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool('ping', { description: 'Ping' }, () => ({
          content: [{ type: 'text', text: 'pong' }],
        }))
      },
    )
    await server.start()
    await server.stop()
    server = undefined
  })

  it('stop is idempotent', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    await server.stop()
    await server.stop()
    server = undefined
  })
})

describe('HTTP server endpoints', () => {
  it('responds to CORS preflight', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/mcp`, { method: 'OPTIONS' })
    expect(res.status).toBe(204)
    // Default CORS reflects request origin or '*' when no Origin header
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy()
    expect(res.headers.get('access-control-allow-methods')).toContain('POST')
  })

  it('uses custom CORS origin', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: {
          type: 'http',
          options: { port: 0, host: '127.0.0.1', cors: { origin: 'https://app.example.com' } },
        },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/mcp`, { method: 'OPTIONS' })
    expect(res.headers.get('access-control-allow-origin')).toBe('https://app.example.com')
  })

  it('sets security headers', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/health`)
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 413 for oversized body', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const largeBody = 'x'.repeat(5 * 1024 * 1024) // 5 MB
    const res = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: largeBody,
    })
    expect(res.status).toBe(413)
  })

  it('returns 404 for unknown paths', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/unknown`)
    expect(res.status).toBe(404)
  })

  it('serves health endpoint at /health', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        health: { enabled: true },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/health`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
    // Non-verbose: no uptime exposed
    expect(body.uptime).toBeUndefined()
  })

  it('serves ready endpoint at /ready', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        health: { enabled: true },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/ready`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ready')
    // Non-verbose: no memory/uptime exposed
    expect(body.checks).toBeUndefined()
  })

  it('rejects POST with wrong Content-Type', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '{}',
    })
    expect(res.status).toBe(415)
  })

  it('applies rate limiting headers', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        rateLimit: { enabled: true, max: 100, windowMs: 60_000 },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool('test', { description: 'test' }, () => ({
          content: [{ type: 'text', text: 'ok' }],
        }))
      },
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'test', version: '0.0.0' },
        },
      }),
    })
    expect(res.headers.get('ratelimit-limit')).toBe('100')
  })

  it('serves protected resource metadata', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        auth: {
          enabled: true,
          resourceUrl: 'http://127.0.0.1',
          authorizationServers: ['https://auth.example.com'],
          scopesSupported: ['read'],
          validateToken: async () => ({ sub: 'test', scopes: ['read'] }),
        },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/.well-known/oauth-protected-resource`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.resource).toBe('http://127.0.0.1')
    expect(body.authorization_servers).toEqual(['https://auth.example.com'])
  })

  it('returns 401 for unauthenticated MCP request when auth enabled', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: { type: 'http', options: { port: 0, host: '127.0.0.1' } },
        auth: {
          enabled: true,
          resourceUrl: 'http://127.0.0.1',
          authorizationServers: ['https://auth.example.com'],
          validateToken: async () => ({ sub: 'test', scopes: [] }),
        },
        logger: { level: 'error' },
      },
      () => {},
    )
    await server.start()
    const port = getPort(server)

    const res = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'initialize', id: 1, params: {} }),
    })
    expect(res.status).toBe(401)
    expect(res.headers.get('www-authenticate')).toContain('Bearer')
  })

  it('returns 503 when max sessions reached', async () => {
    server = createBoumServer(
      {
        server: { name: 'test', version: '1.0.0' },
        transport: {
          type: 'http',
          options: { port: 0, host: '127.0.0.1', maxSessions: 1, sessionTtlMs: 60_000 },
        },
        logger: { level: 'error' },
      },
      (mcp) => {
        mcp.registerTool('ping', { description: 'Ping' }, () => ({
          content: [{ type: 'text', text: 'pong' }],
        }))
      },
    )
    await server.start()
    const port = getPort(server)

    const initBody = JSON.stringify({
      jsonrpc: '2.0',
      method: 'initialize',
      id: 1,
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'test', version: '0.0.0' },
      },
    })

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    }

    // First session — should succeed
    const res1 = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: 'POST',
      headers,
      body: initBody,
    })
    expect(res1.status).toBe(200)

    // Second session — should get 503
    const res2 = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: 'POST',
      headers,
      body: initBody,
    })
    expect(res2.status).toBe(503)
    expect(res2.headers.get('retry-after')).toBe('30')
  })
})
