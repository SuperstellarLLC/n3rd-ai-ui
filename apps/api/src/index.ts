import { serve } from '@hono/node-server'
import { createDB } from './db.js'
import { createApp } from './routes.js'

const PORT = Number(process.env.PORT ?? 4001)
const DB_PATH = process.env.DB_PATH ?? './n3rd.db'

const db = createDB(DB_PATH)
db.migrate()

const app = createApp(db)

console.info(`n3rd.ai API starting on http://127.0.0.1:${PORT}`)
console.info(`Database: ${DB_PATH}`)

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.info(`n3rd.ai API ready on http://127.0.0.1:${info.port}`)
  console.info(`  POST /v1/events   — event ingestion`)
  console.info(`  POST /v1/keys     — instant API key`)
  console.info(`  GET  /v1/servers  — leaderboard`)
  console.info(`  GET  /v1/badge/:owner/:name — SVG badge`)
  console.info(`  GET  /v1/live/:owner/:name  — SSE stream`)
})

process.on('SIGINT', () => {
  db.close()
  process.exit(0)
})
