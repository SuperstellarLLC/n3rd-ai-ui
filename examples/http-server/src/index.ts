/**
 * Example: production-shaped MCP server over Streamable HTTP.
 * Demonstrates health checks, rate limiting, metrics, and structured logging.
 *
 * Run: pnpm --filter @n3rd-ai/example-http-server start
 * Then: curl http://localhost:3000/health
 *       curl http://localhost:3000/metrics
 */
import { createN3rdServer } from '@n3rd-ai/mcp'
import { z } from 'zod'

const server = createN3rdServer(
  {
    server: {
      name: 'example-http',
      version: '1.0.0',
      description: 'HTTP MCP server with full observability',
    },
    transport: {
      type: 'http',
      options: {
        port: 3000,
        host: '127.0.0.1',
        endpoint: '/mcp',
        maxSessions: 100,
        sessionTtlMs: 30 * 60 * 1000,
      },
    },
    health: {
      enabled: true,
      checks: {
        // Example: probe an external dependency
        fake_database: async () => ({ status: 'ok', details: 'mocked' }),
      },
    },
    rateLimit: {
      enabled: true,
      max: 120,
      windowMs: 60_000,
    },
    logger: { level: 'info' },
  },
  (mcp, logger) => {
    logger.info('Registering tools')

    mcp.registerTool(
      'echo',
      {
        description: 'Echo a message back',
        inputSchema: { message: z.string() },
      },
      (args) => ({
        content: [{ type: 'text', text: args.message }],
      }),
    )

    mcp.registerTool(
      'random',
      {
        description: 'Generate a random integer in [min, max]',
        inputSchema: { min: z.number().int(), max: z.number().int() },
      },
      (args) => {
        if (args.min > args.max) {
          return {
            content: [{ type: 'text', text: 'min must be <= max' }],
            isError: true,
          }
        }
        const n = Math.floor(Math.random() * (args.max - args.min + 1)) + args.min
        return { content: [{ type: 'text', text: String(n) }] }
      },
    )
  },
)

await server.start()
// eslint-disable-next-line no-console
console.log('MCP server listening on http://127.0.0.1:3000/mcp')
// eslint-disable-next-line no-console
console.log('Metrics: http://127.0.0.1:3000/metrics')
// eslint-disable-next-line no-console
console.log('Health:  http://127.0.0.1:3000/health')
