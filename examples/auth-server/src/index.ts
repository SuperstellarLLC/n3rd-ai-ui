/**
 * Example: OAuth 2.1 bearer-token-protected MCP server.
 * Uses createJwtValidator with a remote JWKS endpoint.
 *
 * Set AUTH_ISSUER and AUTH_AUDIENCE env vars, then:
 *   pnpm --filter @n3rd-ai/example-auth-server start
 *
 * Curl without a token → 401 with WWW-Authenticate header:
 *   curl -i http://localhost:3000/mcp -X POST -H 'Content-Type: application/json' -d '{}'
 *
 * Discover metadata:
 *   curl http://localhost:3000/.well-known/oauth-protected-resource
 */
import { createN3rdServer, createJwtValidator } from '@n3rd-ai/mcp'
import { z } from 'zod'

const AUTH_ISSUER = process.env.AUTH_ISSUER ?? 'https://auth.example.com'
const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE ?? 'http://localhost:3000'

const jwtValidator = createJwtValidator({
  issuer: AUTH_ISSUER,
  audience: AUTH_AUDIENCE,
})

const server = createN3rdServer(
  {
    server: {
      name: 'example-auth',
      version: '1.0.0',
      description: 'JWT-protected MCP server example',
    },
    transport: {
      type: 'http',
      options: { port: 3000, host: '127.0.0.1' },
    },
    auth: {
      enabled: true,
      resourceUrl: AUTH_AUDIENCE,
      authorizationServers: [AUTH_ISSUER],
      scopesSupported: ['mcp:tools', 'mcp:read'],
      validateToken: (token) => jwtValidator.validate(token),
    },
    rateLimit: { enabled: true, max: 60, windowMs: 60_000 },
    logger: { level: 'info' },
  },
  (mcp) => {
    mcp.registerTool(
      'whoami',
      {
        description: 'Return information about the current authenticated user',
        inputSchema: {},
      },
      () => ({
        content: [{ type: 'text', text: 'authenticated user (extract from extra.authInfo)' }],
      }),
    )

    mcp.registerTool(
      'protected_echo',
      {
        description: 'Echo for authenticated users',
        inputSchema: { message: z.string() },
      },
      (args) => ({
        content: [{ type: 'text', text: args.message }],
      }),
    )
  },
)

await server.start()
// eslint-disable-next-line no-console
console.log(`Auth MCP server at http://127.0.0.1:3000/mcp`)
// eslint-disable-next-line no-console
console.log(`Metadata: http://127.0.0.1:3000/.well-known/oauth-protected-resource`)
