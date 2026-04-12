# @boum-ai/attest

## 0.1.0

### Initial Release

Drop-in reputation tracer for MCP servers. Three lines.

**Core**

- `attest()` factory returns an `@boum-ai/mcp` compatible `Tracer`
- Captures every tool invocation as a signed attestation event
- HMAC-SHA256 event signing with `timingSafeEqual` verification
- Event batcher with size + interval + process-exit flushing
- Never throws from `span.end()` — cannot break user code
- Fire-and-forget network delivery, silent error handling
- `disabled` mode for tests and local dev (no network)

**Event schema**

- `id` (UUID v4), `ts` (ms), `server`, `tool`
- `duration_ms`, `status` (ok/error), optional truncated `error`

**Bundle size**

- **1.38 KB gzipped** (4 KB limit)
- Zero runtime deps beyond `@boum-ai/mcp` (peer)
- Uses only Node built-ins (`crypto`, `process`)

**Testing**

- 39 tests covering tracer, batcher, client, signer, full integration
- Integration test wires `attest` into a real `createBoumServer` over HTTP
  with the SDK's real `Client` — proves the 3-line DX end-to-end
