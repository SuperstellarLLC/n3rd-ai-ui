# Migrating from `@modelcontextprotocol/sdk` to `@n3rd-ai/mcp`

`@n3rd-ai/mcp` is a thin, opinionated wrapper around `@modelcontextprotocol/sdk`. You don't lose anything — you gain security defaults, observability, and less boilerplate.

## Side-by-side

### Stdio server

**Before (raw SDK):**

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { logging: {} } },
)

server.registerTool('echo', { description: 'Echo', inputSchema: { msg: z.string() } }, (args) => ({
  content: [{ type: 'text', text: args.msg }],
}))

const transport = new StdioServerTransport()
await server.connect(transport)

process.on('SIGINT', async () => {
  await server.close()
  process.exit(0)
})
```

**After (`@n3rd-ai/mcp`):**

```ts
import { createN3rdServer } from '@n3rd-ai/mcp'
import { z } from 'zod'

const server = createN3rdServer(
  {
    server: { name: 'my-server', version: '1.0.0' },
    transport: { type: 'stdio' },
  },
  (mcp) => {
    mcp.registerTool('echo', { description: 'Echo', inputSchema: { msg: z.string() } }, (args) => ({
      content: [{ type: 'text', text: args.msg }],
    }))
  },
)

await server.start()
// Graceful shutdown wired automatically
```

### HTTP server

**Before (raw SDK):** ~100 lines. You handle session map, CORS, rate limiting, auth, health checks, graceful shutdown, body parsing, Content-Type checks, CORS preflight, session TTL, and DoS protection yourself.

**After:**

```ts
import { createN3rdServer } from '@n3rd-ai/mcp'

const server = createN3rdServer(
  {
    server: { name: 'my-server', version: '1.0.0' },
    transport: {
      type: 'http',
      options: { port: 3000, maxSessions: 1000, sessionTtlMs: 30 * 60 * 1000 },
    },
    health: { enabled: true },
    rateLimit: { enabled: true, max: 120, windowMs: 60_000 },
  },
  (mcp) => {
    /* registerTool as usual */
  },
)

await server.start()
```

You get for free:

- `GET /health`, `GET /ready`, `GET /metrics`
- CORS with origin reflection + allow-list validation
- Body size limit (4 MB), Content-Type enforcement (415 on non-JSON)
- Request timeouts (30s headers, 60s request, 120s idle) — slowloris-safe
- Security headers: `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`
- Session TTL + LRU eviction with 503 backpressure at `maxSessions`
- Structured JSON logs with request ID, session ID, tool name, duration
- Per-tool Prometheus metrics (counts, duration histogram, error counts)
- Graceful shutdown on SIGINT/SIGTERM

### Auth

**Before (raw SDK):** You implement RFC 9728 metadata endpoint, `WWW-Authenticate` header builder (with CRLF/quote escaping!), bearer token extraction, JWKS fetching, JWT signature verification, scope checking, and 401/403 responses.

**After:**

```ts
import { createN3rdServer, createJwtValidator } from '@n3rd-ai/mcp'

const jwtValidator = createJwtValidator({
  issuer: 'https://auth.example.com',
  audience: 'https://my-mcp.example.com',
})

createN3rdServer(
  {
    server: { name: 's', version: '1.0.0' },
    transport: { type: 'http' },
    auth: {
      enabled: true,
      resourceUrl: 'https://my-mcp.example.com',
      authorizationServers: ['https://auth.example.com'],
      scopesSupported: ['mcp:tools'],
      validateToken: (token) => jwtValidator.validate(token),
    },
  },
  (mcp) => {
    /* ... */
  },
)
```

The server automatically:

- Exposes `/.well-known/oauth-protected-resource` (RFC 9728)
- Returns `401` + `WWW-Authenticate` header for missing/invalid tokens
- Returns `403` + `insufficient_scope` for scope mismatches
- Escapes CRLF/quotes in header values (CWE-113 safe)

### Tool error handling

**Before:** Either throw an error (becomes internal) or manually construct `{ content: [...], isError: true }`.

**After:**

```ts
import { toolError } from '@n3rd-ai/mcp'

mcp.registerTool(
  'divide',
  {
    /* ... */
  },
  (args) => {
    if (args.b === 0) return toolError('Division by zero')
    return { content: [{ type: 'text', text: String(args.a / args.b) }] }
  },
)
```

### Observability

**Before:** Wire up Pino/Winston, trace context, Prometheus client, spans per tool call, manually.

**After:** Zero additional code. `server.metrics` is exposed, `/metrics` scrapable by Prometheus, and you can pass any OpenTelemetry tracer via `observability.tracer`:

```ts
import { trace } from '@opentelemetry/api'
import { adaptOtelTracer } from '@n3rd-ai/mcp'

createN3rdServer(
  {
    // ...
    observability: { tracer: adaptOtelTracer(trace.getTracer('mcp-server')) },
  },
  setup,
)
```

Every tool invocation gets its own span with `mcp.tool.name`, `mcp.server.name`, and `mcp.tool.duration_ms` attributes.

### Testing

**Before:** Roll your own test harness with `InMemoryTransport`, Client connection dance, response parsing.

**After:**

```ts
import { createTestClient, assertToolText } from '@n3rd-ai/mcp/testing'

const client = await createTestClient((mcp) => {
  mcp.registerTool(
    'greet',
    {
      /* ... */
    },
    (args) => ({
      content: [{ type: 'text', text: `Hello, ${args.name}` }],
    }),
  )
})

const result = await client.callTool('greet', { name: 'World' })
assertToolText(result, 'Hello, World')
await client.close()
```

## Things that stay the same

- `registerTool` / `registerResource` / `registerPrompt` APIs are untouched — they're forwarded straight to the SDK
- Zod input/output schemas work identically
- You still `import { McpServer } from '@n3rd-ai/mcp'` if you want the raw SDK class — we re-export it
- All SDK transports and client code remain interoperable

## What you lose

Nothing. `@n3rd-ai/mcp` is a strict superset: the underlying `McpServer` instance is exposed to your setup callback, so any SDK feature we haven't wrapped yet is still one line away.
