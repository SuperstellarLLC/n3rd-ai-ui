import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { randomUUID } from 'node:crypto'
import { createLogger } from '../logging/index.js'
import type { Logger, LogLevel } from '../logging/index.js'
import type { N3rdServer, N3rdServerOptions, HttpTransportOptions, CorsOptions } from './types.js'
import { buildHealthHandler, buildReadyHandler } from '../health/health.js'
import { createRateLimiter } from '../rate-limit/rate-limit.js'
import { buildProtectedResourceMetadata, buildWwwAuthenticate } from '../auth/metadata.js'
import { validateBearerToken } from '../auth/token.js'
import { AuthError, ForbiddenError } from '../errors/index.js'

interface SessionEntry {
  transport: StreamableHTTPServerTransport
  createdAt: number
}

type SessionMap = Map<string, SessionEntry>

const DEFAULT_MAX_SESSIONS = 1000
const DEFAULT_SESSION_TTL_MS = 30 * 60 * 1000 // 30 minutes

export function createN3rdServer(
  options: N3rdServerOptions,
  setup: (mcp: McpServer, logger: Logger) => void | Promise<void>,
): N3rdServer {
  const logger = createLogger({
    ...options.logger,
    context: { server: options.server.name, ...options.logger?.context },
  })

  let httpServer: Server | undefined
  let stdioTransport: StdioServerTransport | undefined
  const sessions: SessionMap = new Map()
  let stopped = false
  const signalHandlers: Array<{ signal: string; handler: () => void }> = []
  let sessionCleanupInterval: ReturnType<typeof setInterval> | undefined

  function createMcpInstance(): McpServer {
    return new McpServer(
      {
        name: options.server.name,
        version: options.server.version,
        title: options.server.title,
        description: options.server.description,
        websiteUrl: options.server.websiteUrl,
      },
      {
        capabilities: { logging: {} },
        instructions: options.server.instructions,
      },
    )
  }

  async function startStdio(): Promise<void> {
    const mcp = createMcpInstance()
    await setup(mcp, logger)

    const stdioOpts = options.transport.type === 'stdio' ? options.transport.options : undefined
    stdioTransport = new StdioServerTransport(
      stdioOpts?.stdin as import('node:stream').Readable | undefined,
      stdioOpts?.stdout as import('node:stream').Writable | undefined,
    )

    await mcp.connect(stdioTransport)
    logger.info('Server started on stdio')
  }

  function applyCors(
    req: IncomingMessage,
    res: ServerResponse,
    cors: CorsOptions | undefined,
  ): void {
    const allowedOrigin = cors?.origin
    if (allowedOrigin === undefined) {
      // Default: reflect the request origin (or '*' if no origin header)
      const requestOrigin = req.headers.origin
      res.setHeader('Access-Control-Allow-Origin', requestOrigin ?? '*')
      if (requestOrigin) res.setHeader('Vary', 'Origin')
    } else if (Array.isArray(allowedOrigin)) {
      // Allow-list: reflect only if the request origin is in the list
      const requestOrigin = req.headers.origin
      if (requestOrigin && allowedOrigin.includes(requestOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin)
      }
      res.setHeader('Vary', 'Origin')
    } else {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
      if (allowedOrigin !== '*') res.setHeader('Vary', 'Origin')
    }
    res.setHeader('Access-Control-Allow-Methods', cors?.methods ?? 'GET, POST, DELETE, OPTIONS')
    res.setHeader(
      'Access-Control-Allow-Headers',
      cors?.allowedHeaders ?? 'Content-Type, Authorization, Mcp-Session-Id',
    )
    res.setHeader('Access-Control-Expose-Headers', cors?.exposedHeaders ?? 'Mcp-Session-Id')
  }

  function setSecurityHeaders(res: ServerResponse): void {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'no-store')
  }

  // Safe to delete during Map iteration per ES spec
  function evictExpiredSessions(ttlMs: number): void {
    const now = Date.now()
    for (const [key, entry] of sessions) {
      if (now - entry.createdAt > ttlMs) {
        entry.transport.close().catch(() => {})
        sessions.delete(key)
      }
    }
  }

  async function startHttp(): Promise<void> {
    const httpOpts: HttpTransportOptions =
      options.transport.type === 'http' ? (options.transport.options ?? {}) : {}
    const port = httpOpts.port ?? 3000
    const host = httpOpts.host ?? '127.0.0.1'
    const endpoint = httpOpts.endpoint ?? '/mcp'
    const stateful = httpOpts.stateful ?? true
    const maxSessions = httpOpts.maxSessions ?? DEFAULT_MAX_SESSIONS
    const sessionTtlMs = httpOpts.sessionTtlMs ?? DEFAULT_SESSION_TTL_MS
    const cors = httpOpts.cors

    if (!endpoint.startsWith('/')) {
      throw new Error(`endpoint must start with "/", got "${endpoint}"`)
    }

    const verbose = options.health?.verbose ?? false
    const healthHandler =
      options.health?.enabled !== false ? buildHealthHandler(verbose) : undefined
    const readyHandler =
      options.health?.enabled !== false
        ? buildReadyHandler(options.health?.checks ?? {}, verbose)
        : undefined
    const healthPath = options.health?.path ?? '/health'
    const readyPath = options.health?.readyPath ?? '/ready'
    const rateLimiter = options.rateLimit?.enabled
      ? createRateLimiter(options.rateLimit, { logger })
      : undefined

    const protectedResourceMetadata = options.auth?.enabled
      ? buildProtectedResourceMetadata({
          resourceUrl: options.auth.resourceUrl,
          authorizationServers: options.auth.authorizationServers,
          scopesSupported: options.auth.scopesSupported,
        })
      : undefined

    // Periodic session TTL cleanup
    sessionCleanupInterval = setInterval(() => evictExpiredSessions(sessionTtlMs), 60_000)
    sessionCleanupInterval.unref()

    httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url ?? '/', `http://${host}:${port}`)
      const reqLogger = logger.child({
        reqId: randomUUID(),
        method: req.method,
        path: url.pathname,
      })

      try {
        setSecurityHeaders(res)
        applyCors(req, res, cors)

        if (req.method === 'OPTIONS') {
          res.writeHead(204)
          res.end()
          return
        }

        // Health endpoints
        if (healthHandler && url.pathname === healthPath) {
          const result = healthHandler()
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(result))
          return
        }

        if (readyHandler && url.pathname === readyPath) {
          const result = await readyHandler()
          const status = result.status === 'ready' ? 200 : 503
          res.writeHead(status, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(result))
          return
        }

        // Protected resource metadata (OAuth discovery)
        if (protectedResourceMetadata && url.pathname === '/.well-known/oauth-protected-resource') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(protectedResourceMetadata))
          return
        }

        // Rate limiting
        if (rateLimiter && url.pathname === endpoint) {
          const rateLimitResult = rateLimiter.check(req)
          res.setHeader('RateLimit-Limit', String(rateLimitResult.limit))
          res.setHeader('RateLimit-Remaining', String(rateLimitResult.remaining))
          res.setHeader('RateLimit-Reset', String(rateLimitResult.resetSeconds))
          if (!rateLimitResult.allowed) {
            res.setHeader('Retry-After', String(rateLimitResult.resetSeconds))
            res.writeHead(429, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                error: 'Rate limit exceeded',
                retryAfter: rateLimitResult.resetSeconds,
              }),
            )
            return
          }
        }

        // Auth
        if (options.auth?.enabled && url.pathname === endpoint) {
          try {
            await validateBearerToken(req, options.auth)
          } catch (err) {
            if (err instanceof AuthError) {
              const wwwAuth = buildWwwAuthenticate({
                resourceMetadataUrl: `${options.auth.resourceUrl}/.well-known/oauth-protected-resource`,
                scopes: options.auth.scopesSupported,
              })
              res.writeHead(401, {
                'Content-Type': 'application/json',
                'WWW-Authenticate': wwwAuth,
              })
              res.end(JSON.stringify({ error: 'unauthorized' }))
              return
            }
            if (err instanceof ForbiddenError) {
              const wwwAuth = buildWwwAuthenticate({
                error: 'insufficient_scope',
                resourceMetadataUrl: `${options.auth.resourceUrl}/.well-known/oauth-protected-resource`,
                scopes: err.requiredScopes,
              })
              res.writeHead(403, {
                'Content-Type': 'application/json',
                'WWW-Authenticate': wwwAuth,
              })
              res.end(JSON.stringify({ error: 'insufficient_scope' }))
              return
            }
            throw err
          }
        }

        // MCP endpoint
        if (url.pathname === endpoint) {
          // Validate Content-Type for POST requests
          if (req.method === 'POST') {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
              res.writeHead(415, { 'Content-Type': 'application/json' })
              res.end(
                JSON.stringify({ error: 'Unsupported Media Type. Expected application/json' }),
              )
              return
            }
          }
          await handleMcpRequest(req, res, stateful, maxSessions, reqLogger)
          return
        }

        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not found' }))
      } catch (err) {
        if (err instanceof BodyTooLargeError) {
          if (!res.headersSent) {
            res.writeHead(413, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Payload Too Large' }))
          }
          return
        }
        reqLogger.error('Request error', {
          error: err instanceof Error ? err.message : String(err),
        })
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      }
    })

    // Request timeouts to prevent slowloris
    httpServer.headersTimeout = 30_000
    httpServer.requestTimeout = 60_000
    httpServer.timeout = 120_000

    async function handleMcpRequest(
      req: IncomingMessage,
      res: ServerResponse,
      stateful: boolean,
      maxSess: number,
      reqLogger: Logger,
    ): Promise<void> {
      const sessionId = req.headers['mcp-session-id'] as string | undefined

      if (req.method === 'DELETE') {
        const entry = sessionId ? sessions.get(sessionId) : undefined
        if (sessionId && entry) {
          await entry.transport.close()
          sessions.delete(sessionId)
          res.writeHead(200)
          res.end()
          reqLogger.info('Session closed', { sessionId })
        } else {
          res.writeHead(404)
          res.end()
        }
        return
      }

      // Parse body for POST requests
      let body: unknown
      if (req.method === 'POST') {
        body = await parseBody(req)
      }

      const existingEntry = sessionId ? sessions.get(sessionId) : undefined
      if (existingEntry) {
        existingEntry.createdAt = Date.now() // refresh TTL on activity
        await existingEntry.transport.handleRequest(req, res, body)
        return
      }

      // Enforce max sessions — reject new connections when at capacity
      if (stateful && sessions.size >= maxSess) {
        // Try evicting expired sessions first
        evictExpiredSessions(sessionTtlMs)
        if (sessions.size >= maxSess) {
          reqLogger.warning('Max sessions reached, rejecting new connection', {
            maxSessions: maxSess,
            active: sessions.size,
          })
          res.writeHead(503, { 'Content-Type': 'application/json', 'Retry-After': '30' })
          res.end(
            JSON.stringify({ error: 'Service temporarily unavailable — too many active sessions' }),
          )
          return
        }
      }

      // New session / stateless request
      const newTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: stateful ? () => randomUUID() : undefined,
        onsessioninitialized: (sid) => {
          sessions.set(sid, { transport: newTransport, createdAt: Date.now() })
          reqLogger.info('Session initialized', { sessionId: sid })
        },
      })

      newTransport.onclose = () => {
        if (newTransport.sessionId) {
          sessions.delete(newTransport.sessionId)
        }
      }

      const mcp = createMcpInstance()
      await setup(mcp, reqLogger)
      await mcp.connect(newTransport)
      await newTransport.handleRequest(req, res, body)
    }

    const server = httpServer
    await new Promise<void>((resolve) => {
      server.listen(port, host, () => {
        logger.info('Server started', { transport: 'http', port, host, endpoint })
        resolve()
      })
    })
  }

  return {
    logger,
    info: options.server,

    address(): AddressInfo | null {
      if (!httpServer) return null
      const addr = httpServer.address()
      if (!addr || typeof addr === 'string') return null
      return addr
    },

    async start() {
      if (options.transport.type === 'stdio') {
        await startStdio()
      } else {
        await startHttp()
      }

      const onSignal = () => {
        this.stop().catch((err) => {
          logger.error('Shutdown error', {
            error: err instanceof Error ? err.message : String(err),
          })
        })
      }

      for (const signal of ['SIGINT', 'SIGTERM'] as const) {
        process.on(signal, onSignal)
        signalHandlers.push({ signal, handler: onSignal })
      }
    },

    async stop() {
      if (stopped) return
      stopped = true
      logger.info('Shutting down...')

      // Remove signal handlers
      for (const { signal, handler } of signalHandlers) {
        process.removeListener(signal, handler)
      }
      signalHandlers.length = 0

      if (sessionCleanupInterval) {
        clearInterval(sessionCleanupInterval)
        sessionCleanupInterval = undefined
      }

      for (const [sid, entry] of sessions) {
        await entry.transport.close()
        sessions.delete(sid)
      }

      if (stdioTransport) {
        await stdioTransport.close()
      }

      if (httpServer) {
        await new Promise<void>((resolve, reject) => {
          httpServer?.close((err) => (err ? reject(err) : resolve()))
        })
      }

      logger.info('Server stopped')
    },

    setLogLevel(level: LogLevel) {
      logger.setLevel(level)
    },
  }
}

class BodyTooLargeError extends Error {
  constructor() {
    super('Request body too large')
    this.name = 'BodyTooLargeError'
  }
}

const MAX_BODY_SIZE = 4 * 1024 * 1024 // 4 MB

function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    let tooLarge = false
    req.on('data', (chunk: Buffer) => {
      if (tooLarge) return
      size += chunk.length
      if (size > MAX_BODY_SIZE) {
        tooLarge = true
        // Stop reading but don't destroy — let the handler send 413
        req.removeAllListeners('data')
        reject(new BodyTooLargeError())
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (tooLarge) return
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString())
        resolve(body)
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', (err) => {
      if (!tooLarge) reject(err)
    })
  })
}
