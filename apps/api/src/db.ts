import Database from 'better-sqlite3'
import { createHash, randomUUID } from 'node:crypto'
import { MIGRATIONS } from '@n3rd-ai/score'
import type { ServerRecord, EventRecord } from '@n3rd-ai/score'

export interface DB {
  /** Run all migrations */
  migrate(): void
  /** Insert or update a server */
  upsertServer(server: Omit<ServerRecord, 'created_at' | 'updated_at'>): void
  /** Get a server by id (owner/name) */
  getServer(id: string): ServerRecord | undefined
  /** List servers sorted by score descending */
  listServers(options?: { limit?: number; offset?: number; search?: string }): ServerRecord[]
  /** Count total servers */
  countServers(): number
  /** Insert events in batch */
  insertEvents(events: EventRecord[]): void
  /** Get events for a server, most recent first */
  getEvents(serverId: string, options?: { limit?: number }): EventRecord[]
  /** Get tool stats for a server */
  getToolStats(serverId: string): Array<{ tool: string; calls: number; errors: number; avg_ms: number }>
  /** Generate and store an API key for a server. Returns the raw key. */
  createApiKey(serverId: string, options?: { temporary?: boolean; ttlMs?: number }): string
  /** Validate an API key. Returns the associated server_id or undefined. */
  validateApiKey(rawKey: string): string | undefined
  /** Close the database */
  close(): void
}

export function createDB(path = ':memory:'): DB {
  const db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  return {
    migrate() {
      for (const sql of MIGRATIONS) {
        db.exec(sql)
      }
    },

    upsertServer(server) {
      const now = Date.now()
      db.prepare(`
        INSERT INTO servers (id, owner, name, score, uptime_pct, error_rate, p95_ms, tool_count,
          calls_total, calls_24h, last_event_at, claimed, api_key_hash, source, description,
          repository_url, npm_package, created_at, updated_at)
        VALUES (@id, @owner, @name, @score, @uptime_pct, @error_rate, @p95_ms, @tool_count,
          @calls_total, @calls_24h, @last_event_at, @claimed, @api_key_hash, @source, @description,
          @repository_url, @npm_package, @created_at, @updated_at)
        ON CONFLICT(id) DO UPDATE SET
          score = @score, uptime_pct = @uptime_pct, error_rate = @error_rate, p95_ms = @p95_ms,
          tool_count = @tool_count, calls_total = @calls_total, calls_24h = @calls_24h,
          last_event_at = @last_event_at, claimed = @claimed, description = @description,
          repository_url = @repository_url, npm_package = @npm_package, updated_at = @updated_at
      `).run({ ...server, created_at: now, updated_at: now })
    },

    getServer(id) {
      return db.prepare('SELECT * FROM servers WHERE id = ?').get(id) as ServerRecord | undefined
    },

    listServers(options = {}) {
      const limit = options.limit ?? 50
      const offset = options.offset ?? 0
      if (options.search) {
        return db.prepare(`
          SELECT * FROM servers WHERE name LIKE ? OR owner LIKE ? OR description LIKE ?
          ORDER BY score DESC LIMIT ? OFFSET ?
        `).all(`%${options.search}%`, `%${options.search}%`, `%${options.search}%`, limit, offset) as ServerRecord[]
      }
      return db.prepare('SELECT * FROM servers ORDER BY score DESC LIMIT ? OFFSET ?')
        .all(limit, offset) as ServerRecord[]
    },

    countServers() {
      const row = db.prepare('SELECT COUNT(*) as count FROM servers').get() as { count: number }
      return row.count
    },

    insertEvents(events) {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO events (id, server_id, tool, duration_ms, status, error, ts, created_at)
        VALUES (@id, @server_id, @tool, @duration_ms, @status, @error, @ts, @created_at)
      `)
      const insertMany = db.transaction((evts: EventRecord[]) => {
        for (const e of evts) stmt.run(e)
      })
      insertMany(events)
    },

    getEvents(serverId, options = {}) {
      const limit = options.limit ?? 100
      return db.prepare('SELECT * FROM events WHERE server_id = ? ORDER BY ts DESC LIMIT ?')
        .all(serverId, limit) as EventRecord[]
    },

    getToolStats(serverId) {
      return db.prepare(`
        SELECT tool,
          COUNT(*) as calls,
          SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errors,
          AVG(duration_ms) as avg_ms
        FROM events WHERE server_id = ?
        GROUP BY tool ORDER BY calls DESC
      `).all(serverId) as Array<{ tool: string; calls: number; errors: number; avg_ms: number }>
    },

    createApiKey(serverId, options = {}) {
      const rawKey = `n3rd_${randomUUID().replace(/-/g, '')}`
      const keyHash = hashKey(rawKey)
      const prefix = rawKey.slice(0, 12)
      const now = Date.now()
      const expiresAt = options.ttlMs ? now + options.ttlMs : null
      db.prepare(`
        INSERT INTO api_keys (key_hash, key_prefix, server_id, created_at, expires_at, temporary)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(keyHash, prefix, serverId, now, expiresAt, options.temporary ? 1 : 0)
      return rawKey
    },

    validateApiKey(rawKey) {
      const keyHash = hashKey(rawKey)
      const row = db.prepare(`
        SELECT server_id, expires_at FROM api_keys WHERE key_hash = ?
      `).get(keyHash) as { server_id: string; expires_at: number | null } | undefined
      if (!row) return undefined
      if (row.expires_at && row.expires_at < Date.now()) return undefined
      return row.server_id
    },

    close() {
      db.close()
    },
  }
}

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}
