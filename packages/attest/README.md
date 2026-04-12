# @boum-ai/attest

> Drop-in reputation tracer for MCP servers. Three lines. Signed attestations to boum.ai.

[![size](https://img.shields.io/badge/size-1.38%20KB-green)](https://bundlephobia.com/package/@boum-ai/attest)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## What it does

Every time an MCP tool is called on your server, `@boum-ai/attest` emits a signed attestation event to [boum.ai](https://boum.ai). You get:

- A **public profile** at `boum.ai/@you/server-name`
- A **reputation score** (0-100) computed from real usage
- An **embeddable badge** for your README
- Zero impact on your server — events are batched and shipped async

## Install

```bash
npm install @boum-ai/attest @boum-ai/mcp
```

## Usage

```ts
import { createBoumServer } from '@boum-ai/mcp'
import { attest } from '@boum-ai/attest'

createBoumServer(
  {
    server: { name: 'weather', version: '1.0.0' },
    transport: { type: 'http' },
    observability: { tracer: attest({ apiKey: process.env.BOUM_KEY! }) },
  },
  (mcp) => {
    // register your tools as usual
  },
)
```

That's it. Three lines:

1. `import { attest } from '@boum-ai/attest'`
2. Get an API key from [boum.ai](https://boum.ai)
3. Pass it in `observability.tracer`

## Options

```ts
attest({
  apiKey: 'boum_...', // required
  endpoint: 'https://api.boum.ai/v1/events', // default
  batchSize: 100, // events per batch
  flushIntervalMs: 5000, // max time between flushes
  timeoutMs: 10000, // request timeout
  disabled: false, // skip all network for tests
  onError: (err) => console.warn(err), // silent by default
})
```

## Event shape

Every tool invocation produces one event:

```ts
{
  id: '550e8400-e29b-41d4-a716-446655440000',
  ts: 1775420000000,
  server: 'weather',
  tool: 'get_forecast',
  duration_ms: 42.3,
  status: 'ok',
}
```

Events are batched in memory and shipped as JSON arrays with an HMAC-SHA256 signature in the `X-Boum-Signature` header.

## Guarantees

- **Never blocks your server.** Batching and delivery are async.
- **Never throws.** `span.end()` is exception-safe even under failure.
- **Never leaks.** Stale events drop on process exit via `beforeExit`.
- **Signed.** Every payload is HMAC-SHA256 with your API key.
- **1.38 KB gzipped.** Your bundle does not notice.

## License

MIT © Superstellar LLC
