# Examples

Runnable MCP servers demonstrating `@n3rd-ai/mcp` patterns.

Each example is a pnpm workspace — install once at the repo root with `pnpm install`, then run any example.

| Example                        | Transport             | What it shows                                                                  |
| ------------------------------ | --------------------- | ------------------------------------------------------------------------------ |
| [stdio-server](./stdio-server) | stdio                 | Minimal MCP server with two tools, runnable with MCP Inspector                 |
| [http-server](./http-server)   | Streamable HTTP       | Production defaults: health checks, rate limiting, metrics, structured logging |
| [auth-server](./auth-server)   | Streamable HTTP + JWT | OAuth 2.1 bearer token protection via JWKS                                     |

## Quick start

```bash
# Install all workspace deps (from repo root)
pnpm install

# Run the stdio example with MCP Inspector
npx @modelcontextprotocol/inspector pnpm --filter @n3rd-ai/example-stdio-server start

# Run the HTTP example
pnpm --filter @n3rd-ai/example-http-server start
curl http://localhost:3000/health
curl http://localhost:3000/metrics

# Run the auth example (requires an IdP)
AUTH_ISSUER=https://your-idp.example.com \
AUTH_AUDIENCE=http://localhost:3000 \
  pnpm --filter @n3rd-ai/example-auth-server start
```
