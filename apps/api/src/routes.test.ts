import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createDB, type DB } from './db.js'
import { createApp } from './routes.js'
import type { Hono } from 'hono'
import { sign } from '@n3rd-ai/attest'

let db: DB
let app: Hono

beforeEach(() => {
  db = createDB(':memory:')
  db.migrate()
  app = createApp(db)
})

afterEach(() => {
  db.close()
})

async function request(method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
  const init: RequestInit = { method, headers: { ...headers } }
  if (body) {
    const bodyStr = JSON.stringify(body)
    init.body = bodyStr
    ;(init.headers as Record<string, string>)['Content-Type'] = 'application/json'
  }
  return app.request(`http://localhost${path}`, init)
}

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request('GET', '/health')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
  })
})

describe('POST /v1/keys', () => {
  it('creates a temporary API key', async () => {
    const res = await request('POST', '/v1/keys', { owner: 'alice', name: 'weather' })
    expect(res.status).toBe(200)
    const body = await res.json() as { apiKey: string; serverId: string }
    expect(body.apiKey).toMatch(/^n3rd_/)
    expect(body.serverId).toBe('alice/weather')
  })

  it('rejects missing fields', async () => {
    const res = await request('POST', '/v1/keys', { owner: 'alice' })
    expect(res.status).toBe(400)
  })
})

describe('POST /v1/waitlist', () => {
  it('stores a waitlist entry', async () => {
    const res = await request('POST', '/v1/waitlist', {
      email: 'hello@example.com',
      useCase: 'Comparing apartments side by side',
      source: 'landing-page',
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { ok: boolean; duplicate: boolean }
    expect(body.ok).toBe(true)
    expect(body.duplicate).toBe(false)
    expect(db.getWaitlistEntry('hello@example.com')?.use_case).toContain('apartments')
  })

  it('deduplicates repeated submissions', async () => {
    await request('POST', '/v1/waitlist', { email: 'repeat@example.com' })
    const res = await request('POST', '/v1/waitlist', {
      email: 'repeat@example.com',
      useCase: 'Code review',
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { duplicate: boolean }
    expect(body.duplicate).toBe(true)
    expect(db.getWaitlistEntry('repeat@example.com')?.use_case).toBe('Code review')
  })

  it('rejects invalid emails', async () => {
    const res = await request('POST', '/v1/waitlist', { email: 'not-an-email' })
    expect(res.status).toBe(400)
  })
})

describe('POST /v1/events', () => {
  it('accepts signed events', async () => {
    // Create a key first
    const keyRes = await request('POST', '/v1/keys', { owner: 'bob', name: 'tools' })
    const { apiKey } = await keyRes.json() as { apiKey: string }

    const events = {
      events: [
        { id: '1', ts: Date.now(), server: 'tools', tool: 'search', duration_ms: 42, status: 'ok' },
        { id: '2', ts: Date.now(), server: 'tools', tool: 'search', duration_ms: 55, status: 'ok' },
      ],
    }
    const body = JSON.stringify(events)
    const sig = sign(body, apiKey)

    // Use app.request directly to control the raw body (request() would double-stringify)
    const rawRes = await app.request('http://localhost/v1/events', {
      method: 'POST',
      headers: {
        'X-N3rd-Api-Key': apiKey,
        'X-N3rd-Signature': `sha256=${sig}`,
        'Content-Type': 'application/json',
      },
      body,
    })
    expect(rawRes.status).toBe(200)
    const result = await rawRes.json() as { accepted: number }
    expect(result.accepted).toBe(2)
  })

  it('rejects requests without API key', async () => {
    const res = await request('POST', '/v1/events', { events: [] })
    expect(res.status).toBe(401)
  })

  it('rejects invalid API key', async () => {
    const res = await app.request('http://localhost/v1/events', {
      method: 'POST',
      headers: {
        'X-N3rd-Api-Key': 'n3rd_invalid',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: [{ id: '1', ts: 1, server: 'x', tool: 'y', duration_ms: 1, status: 'ok' }] }),
    })
    expect(res.status).toBe(403)
  })
})

describe('GET /v1/servers/:owner/:name', () => {
  it('returns server profile', async () => {
    await request('POST', '/v1/keys', { owner: 'test', name: 'srv' })
    const res = await request('GET', '/v1/servers/test/srv')
    expect(res.status).toBe(200)
    const body = await res.json() as { id: string; tools: unknown[] }
    expect(body.id).toBe('test/srv')
    expect(body.tools).toEqual([])
  })

  it('returns 404 for unknown server', async () => {
    const res = await request('GET', '/v1/servers/nobody/nothing')
    expect(res.status).toBe(404)
  })
})

describe('GET /v1/servers', () => {
  it('returns leaderboard sorted by score', async () => {
    await request('POST', '/v1/keys', { owner: 'a', name: 's1' })
    await request('POST', '/v1/keys', { owner: 'b', name: 's2' })
    const res = await request('GET', '/v1/servers')
    expect(res.status).toBe(200)
    const body = await res.json() as { servers: unknown[]; total: number }
    expect(body.servers).toHaveLength(2)
    expect(body.total).toBe(2)
  })

  it('supports search', async () => {
    await request('POST', '/v1/keys', { owner: 'alice', name: 'weather' })
    await request('POST', '/v1/keys', { owner: 'bob', name: 'github' })
    const res = await request('GET', '/v1/servers?search=weather')
    const body = await res.json() as { servers: Array<{ name: string }> }
    expect(body.servers).toHaveLength(1)
    expect(body.servers[0].name).toBe('weather')
  })
})

describe('GET /v1/badge/:owner/:name', () => {
  it('returns SVG for known server', async () => {
    await request('POST', '/v1/keys', { owner: 'test', name: 'srv' })
    const res = await request('GET', '/v1/badge/test/srv')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/svg+xml')
    const svg = await res.text()
    expect(svg).toContain('<svg')
    expect(svg).toContain('n3rd')
  })

  it('returns unverified SVG for unknown server', async () => {
    const res = await request('GET', '/v1/badge/nobody/nothing')
    expect(res.status).toBe(200)
    const svg = await res.text()
    expect(svg).toContain('unverified')
  })

  it('sets cache headers', async () => {
    const res = await request('GET', '/v1/badge/nobody/nothing')
    expect(res.headers.get('cache-control')).toContain('max-age=300')
  })
})
