/**
 * Database schema definitions. These are SQL strings — the API server
 * executes them against SQLite (better-sqlite3 local / D1 edge).
 */

export const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    uptime_pct REAL DEFAULT 0,
    error_rate REAL DEFAULT 0,
    p95_ms REAL DEFAULT 0,
    tool_count INTEGER DEFAULT 0,
    calls_total INTEGER DEFAULT 0,
    calls_24h INTEGER DEFAULT 0,
    last_event_at INTEGER,
    claimed INTEGER DEFAULT 0,
    api_key_hash TEXT,
    source TEXT DEFAULT 'registry',
    description TEXT,
    repository_url TEXT,
    npm_package TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    UNIQUE(owner, name)
  )`,

  `CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL,
    tool TEXT NOT NULL,
    duration_ms REAL NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('ok', 'error')),
    error TEXT,
    ts INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,

  `CREATE INDEX IF NOT EXISTS idx_events_server_ts ON events(server_id, ts DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_events_server_tool ON events(server_id, tool)`,
  `CREATE INDEX IF NOT EXISTS idx_servers_score ON servers(score DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_servers_owner ON servers(owner)`,

  `CREATE TABLE IF NOT EXISTS api_keys (
    key_hash TEXT PRIMARY KEY,
    key_prefix TEXT NOT NULL,
    server_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER,
    temporary INTEGER DEFAULT 0
  )`,
] as const

/**
 * Server record as stored in the database.
 */
export interface ServerRecord {
  id: string
  owner: string
  name: string
  score: number
  uptime_pct: number
  error_rate: number
  p95_ms: number
  tool_count: number
  calls_total: number
  calls_24h: number
  last_event_at: number | null
  claimed: number
  api_key_hash: string | null
  source: 'registry' | 'claimed'
  description: string | null
  repository_url: string | null
  npm_package: string | null
  created_at: number
  updated_at: number
}

/**
 * Event record as stored in the database.
 */
export interface EventRecord {
  id: string
  server_id: string
  tool: string
  duration_ms: number
  status: 'ok' | 'error'
  error: string | null
  ts: number
  created_at: number
}

/**
 * Tool-level stats computed from events.
 */
export interface ToolStats {
  name: string
  calls: number
  errors: number
  successRate: number
  avgMs: number
  p95Ms: number
}
