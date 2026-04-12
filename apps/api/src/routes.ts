import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { verify } from '@n3rd-ai/attest'
import { computeScore, renderBadgeSvg } from '@n3rd-ai/score'
import type { EventRecord } from '@n3rd-ai/score'
import type { DB } from './db.js'

export function createApp(db: DB): Hono {
  const app = new Hono()

  app.use('*', cors({ origin: '*' }))

  // ─── Health ──────────────────────────────────────────────
  app.get('/health', (c) => c.json({ status: 'ok' }))

  // ─── Event ingestion ────────────────────────────────────
  app.post('/v1/events', async (c) => {
    const apiKey = c.req.header('X-N3rd-Api-Key')
    if (!apiKey) return c.json({ error: 'Missing X-N3rd-Api-Key header' }, 401)

    const serverId = db.validateApiKey(apiKey)
    if (!serverId) return c.json({ error: 'Invalid or expired API key' }, 403)

    // Verify signature
    const signature = c.req.header('X-N3rd-Signature')
    const body = await c.req.text()
    if (signature) {
      const sig = signature.replace(/^sha256=/, '')
      if (!verify(body, sig, apiKey)) {
        return c.json({ error: 'Invalid signature' }, 403)
      }
    }

    let parsed: { events: Array<{ id: string; ts: number; server: string; tool: string; duration_ms: number; status: string; error?: string }> }
    try {
      parsed = JSON.parse(body)
    } catch {
      return c.json({ error: 'Invalid JSON' }, 400)
    }

    if (!Array.isArray(parsed.events) || parsed.events.length === 0) {
      return c.json({ error: 'events array required' }, 400)
    }

    // Store events
    const now = Date.now()
    const records: EventRecord[] = parsed.events.map((e) => ({
      id: e.id,
      server_id: serverId,
      tool: e.tool,
      duration_ms: e.duration_ms,
      status: e.status === 'error' ? 'error' : 'ok',
      error: e.error ?? null,
      ts: e.ts,
      created_at: now,
    }))

    db.insertEvents(records)

    // Recompute score
    recomputeServerScore(db, serverId)

    return c.json({ accepted: records.length })
  })

  // ─── Instant API key (try-without-signup) ───────────────
  app.post('/v1/keys', async (c) => {
    const body = await c.req.json<{ owner: string; name: string }>()
    if (!body.owner || !body.name) {
      return c.json({ error: 'owner and name required' }, 400)
    }

    const serverId = `${body.owner}/${body.name}`
    const existing = db.getServer(serverId)
    if (!existing) {
      db.upsertServer({
        id: serverId,
        owner: body.owner,
        name: body.name,
        score: 0,
        uptime_pct: 0,
        error_rate: 0,
        p95_ms: 0,
        tool_count: 0,
        calls_total: 0,
        calls_24h: 0,
        last_event_at: null,
        claimed: 0,
        api_key_hash: null,
        source: 'claimed',
        description: null,
        repository_url: null,
        npm_package: null,
      })
    }

    const apiKey = db.createApiKey(serverId, { temporary: true, ttlMs: 24 * 60 * 60 * 1000 })

    return c.json({
      apiKey,
      serverId,
      expiresIn: '24h',
      profile: `https://n3rd.ai/@${body.owner}/${body.name}`,
    })
  })

  // ─── Waitlist capture ───────────────────────────────────
  app.post('/v1/waitlist', async (c) => {
    let body: Record<string, unknown>

    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }

    const email = normalizeEmail(body.email)
    if (!email || !EMAIL_RE.test(email)) {
      return c.json({ error: 'A valid email is required' }, 400)
    }

    const result = db.upsertWaitlistEntry({
      email,
      name: normalizeText(body.name, 120),
      company: normalizeText(body.company, 120),
      use_case: normalizeText(body.useCase, 1200),
      source: normalizeText(body.source, 80) ?? 'landing-page',
    })

    return c.json({ ok: true, duplicate: !result.created })
  })

  // ─── Server profile ─────────────────────────────────────
  app.get('/v1/servers/:owner/:name', (c) => {
    const id = `${c.req.param('owner')}/${c.req.param('name')}`
    const server = db.getServer(id)
    if (!server) return c.json({ error: 'Server not found' }, 404)

    const tools = db.getToolStats(id)
    const recentEvents = db.getEvents(id, { limit: 20 })

    return c.json({
      ...server,
      tools,
      recentEvents,
      badge: `https://n3rd.ai/@${server.owner}/${server.name}/badge.svg`,
    })
  })

  // ─── Server list / leaderboard ──────────────────────────
  app.get('/v1/servers', (c) => {
    const limit = Math.min(Number(c.req.query('limit') ?? 50), 100)
    const offset = Number(c.req.query('offset') ?? 0)
    const search = c.req.query('search')

    const servers = db.listServers({ limit, offset, search: search ?? undefined })
    const total = db.countServers()

    return c.json({ servers, total, limit, offset })
  })

  // ─── Badge SVG ──────────────────────────────────────────
  app.get('/v1/badge/:owner/:name', (c) => {
    const id = `${c.req.param('owner')}/${c.req.param('name')}`
    const server = db.getServer(id)

    if (!server) {
      const svg = renderBadgeSvg({ server: c.req.param('name'), score: 0, band: 'unverified', verified: false })
      c.header('Content-Type', 'image/svg+xml')
      c.header('Cache-Control', 'public, max-age=300')
      return c.body(svg)
    }

    const { band } = computeScore({
      uptimePct: server.uptime_pct,
      errorRate: server.error_rate,
      p95Ms: server.p95_ms,
      toolCount: server.tool_count,
      callsTotal: server.calls_total,
    })

    const svg = renderBadgeSvg({
      server: server.name,
      score: server.score,
      band,
      verified: server.claimed === 1 || server.calls_total >= 10,
    })

    c.header('Content-Type', 'image/svg+xml')
    c.header('Cache-Control', 'public, max-age=300')
    return c.body(svg)
  })

  // ─── SSE live events stream ─────────────────────────────
  app.get('/v1/live/:owner/:name', (c) => {
    const id = `${c.req.param('owner')}/${c.req.param('name')}`
    const server = db.getServer(id)
    if (!server) return c.json({ error: 'Server not found' }, 404)

    // Poll-based SSE — real production would use a pub/sub
    let lastEventTs = 0
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        const send = (data: string) => {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }

        // Send current score immediately
        send(JSON.stringify({
          type: 'score',
          score: server.score,
          callsTotal: server.calls_total,
        }))

        const interval = setInterval(() => {
          const events = db.getEvents(id, { limit: 10 })
          const newEvents = events.filter((e) => e.ts > lastEventTs)
          if (newEvents.length > 0) {
            lastEventTs = Math.max(...newEvents.map((e) => e.ts))
            const current = db.getServer(id)
            send(JSON.stringify({
              type: 'update',
              events: newEvents,
              score: current?.score ?? 0,
              callsTotal: current?.calls_total ?? 0,
            }))
          }
        }, 2000)

        // Cleanup after 5 minutes (client should reconnect)
        setTimeout(() => {
          clearInterval(interval)
          controller.close()
        }, 5 * 60 * 1000)
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  })

  return app
}

/**
 * Recompute a server's score from its events.
 */
function recomputeServerScore(db: DB, serverId: string): void {
  const events = db.getEvents(serverId, { limit: 10_000 })
  if (events.length === 0) return

  const total = events.length
  const errors = events.filter((e) => e.status === 'error').length
  const errorRate = errors / total
  const durations = events.map((e) => e.duration_ms).sort((a, b) => a - b)
  const p95Index = Math.floor(durations.length * 0.95)
  const p95Ms = durations[p95Index] ?? 0
  const tools = new Set(events.map((e) => e.tool))

  // Simple uptime: fraction of recent events that are ok
  const uptimePct = ((total - errors) / total) * 100

  const { score } = computeScore({
    uptimePct,
    errorRate,
    p95Ms,
    toolCount: tools.size,
    callsTotal: total,
  })

  const server = db.getServer(serverId)
  if (server) {
    db.upsertServer({
      ...server,
      score,
      uptime_pct: uptimePct,
      error_rate: errorRate,
      p95_ms: p95Ms,
      tool_count: tools.size,
      calls_total: total,
      last_event_at: events[0]?.ts ?? null,
    })
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email ? email : null
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  if (!normalized) return null
  return normalized.slice(0, maxLength)
}
