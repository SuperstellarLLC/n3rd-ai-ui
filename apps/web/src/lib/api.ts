/**
 * API client for the n3rd.ai backend.
 * Used by Server Components to fetch data at the edge.
 */

const API_BASE = process.env.N3RD_API_URL ?? 'http://127.0.0.1:4001'

export interface ServerProfile {
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
  claimed: number
  source: string
  description: string | null
  repository_url: string | null
  npm_package: string | null
  tools: Array<{ tool: string; calls: number; errors: number; avg_ms: number }>
  badge: string
}

export interface LeaderboardResponse {
  servers: Array<{
    id: string
    owner: string
    name: string
    score: number
    calls_total: number
    calls_24h: number
    uptime_pct: number
    description: string | null
    source: string
    claimed: number
  }>
  total: number
  limit: number
  offset: number
}

export interface KeyResponse {
  apiKey: string
  serverId: string
  expiresIn: string
  profile: string
}

export async function fetchServer(owner: string, name: string): Promise<ServerProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/servers/${owner}/${name}`, {
      next: { revalidate: 30 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchLeaderboard(options?: {
  limit?: number
  offset?: number
  search?: string
}): Promise<LeaderboardResponse> {
  const params = new URLSearchParams()
  if (options?.limit) params.set('limit', String(options.limit))
  if (options?.offset) params.set('offset', String(options.offset))
  if (options?.search) params.set('search', options.search)
  try {
    const res = await fetch(`${API_BASE}/v1/servers?${params}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { servers: [], total: 0, limit: 50, offset: 0 }
    return res.json()
  } catch {
    return { servers: [], total: 0, limit: 50, offset: 0 }
  }
}

export async function createKey(owner: string, name: string): Promise<KeyResponse> {
  const res = await fetch(`${API_BASE}/v1/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, name }),
  })
  return res.json()
}
