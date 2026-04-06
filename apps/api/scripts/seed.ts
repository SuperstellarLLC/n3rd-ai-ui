/**
 * Pre-seed script: fetches the official MCP Registry and populates the database
 * with initial scores computed from public signals.
 *
 * Run: pnpm --filter @n3rd-ai/api seed
 */
import { createDB } from '../src/db.js'
import { computePublicScore } from '@n3rd-ai/score'

const REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0.1/servers'
const DB_PATH = process.env.DB_PATH ?? './n3rd.db'

interface RegistryServer {
  name: string // "io.github.user/server"
  title?: string
  description?: string
  version?: string
  repository?: { url?: string; source?: string }
  packages?: Array<{ registryType?: string; identifier?: string }>
}

async function main(): Promise<void> {
  const db = createDB(DB_PATH)
  db.migrate()

  console.info('Fetching MCP Registry...')

  let cursor: string | undefined
  let total = 0

  try {
    while (true) {
      const url = new URL(REGISTRY_URL)
      url.searchParams.set('limit', '100')
      if (cursor) url.searchParams.set('cursor', cursor)

      const res = await fetch(url.toString())
      if (!res.ok) {
        console.error(`Registry returned ${res.status}: ${res.statusText}`)
        break
      }

      const data = await res.json() as {
        servers?: Array<{ server: RegistryServer }>
        next_cursor?: string
      }

      const servers = data.servers ?? []
      if (servers.length === 0) break

      for (const entry of servers) {
        const srv = entry.server
        if (!srv.name || !srv.name.includes('/')) continue

        const parts = srv.name.split('/')
        const owner = parts.slice(0, -1).join('/')
        const name = parts[parts.length - 1]
        const id = `${owner}/${name}`

        // Compute initial score from public signals
        // In a real setup, we'd fetch npm/GitHub data here
        const score = computePublicScore({
          hasTypes: true,
          lastCommitDaysAgo: 30,
        })

        const npmPkg = srv.packages?.find((p) => p.registryType === 'npm')?.identifier

        db.upsertServer({
          id,
          owner,
          name,
          score: Math.round(score),
          uptime_pct: 0,
          error_rate: 0,
          p95_ms: 0,
          tool_count: 0,
          calls_total: 0,
          calls_24h: 0,
          last_event_at: null,
          claimed: 0,
          api_key_hash: null,
          source: 'registry',
          description: srv.description ?? srv.title ?? null,
          repository_url: srv.repository?.url ?? null,
          npm_package: npmPkg ?? null,
        })

        total++
      }

      console.info(`  seeded ${total} servers...`)

      cursor = data.next_cursor
      if (!cursor) break
    }
  } catch (err) {
    console.error('Seed error:', err instanceof Error ? err.message : err)
  }

  db.close()
  console.info(`Done. Seeded ${total} servers into ${DB_PATH}`)
}

main().catch(console.error)
