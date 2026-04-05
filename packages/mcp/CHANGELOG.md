# @n3rd-ai/mcp

## 0.1.0

### Initial Release

Production-ready MCP server framework wrapping `@modelcontextprotocol/sdk`.

**Core**

- Server factory (`createN3rdServer`) with Streamable HTTP + stdio transports
- Opinionated defaults: CORS with origin reflection, security headers, body size limit (4 MB), request timeouts (30s/60s/120s), graceful shutdown
- Session management: TTL-based expiry, LRU eviction with 503 backpressure, configurable `maxSessions`
- Content-Type validation (415 on non-JSON POST)
- Structured error hierarchy (`ServerError`, `AuthError`, `ForbiddenError`, `RateLimitError`, `ValidationError`)

**Auth**

- OAuth 2.1 bearer token validation (RFC 9728 Protected Resource Metadata)
- `WWW-Authenticate` header builder with CRLF-safe escaping
- JWT validator via `jose` (peer dep, optional)
- Pluggable `validateToken` callback contract

**Observability**

- Structured JSON logger with 8 syslog levels, child context propagation, field + message pattern redaction
- Prometheus-compatible metrics registry (counter, gauge, histogram)
- Built-in MCP metrics: `mcp_tool_calls_total`, `mcp_tool_duration_seconds`, `mcp_tool_errors_total`, `mcp_sessions_active`, `mcp_requests_total`
- OpenTelemetry-compatible tracer interface with `adaptOtelTracer` helper
- `/metrics` endpoint scrapable by Prometheus

**Rate limiting**

- Token bucket algorithm with per-client tracking
- Bucket cap (100K entries) to prevent memory DoS
- `trustProxy` opt-in for `X-Forwarded-For` with startup warning
- Independent windows per client

**Health checks**

- Liveness (`/health`) and readiness (`/ready`) endpoints
- Non-verbose by default (no info leakage), `verbose: true` opt-in
- Async dependency probing with latency measurement
- Kubernetes-compatible 200/503 responses

**Registry**

- `server.json` generation (MCP Registry schema 2025-12-11)
- Server Card generation (SEP-1649 draft)

**Testing**

- In-memory `createTestClient` with assertion helpers
- Full E2E MCP protocol tests (initialize → tools/list → tools/call → close)
- Property-based tests (`fast-check`) for rate limiter invariants
- Benchmark suite (`tinybench`) comparing against raw SDK

**Bundle size**

- Full framework: **7.33 KB gzipped**
- Testing utilities: **910 bytes gzipped**
- Peer deps (`jose`, `zod`, `@modelcontextprotocol/sdk`) not bundled

**Performance**

- ~4% overhead vs raw SDK for full instrumentation (~49K vs 51K ops/sec on in-memory transport)
