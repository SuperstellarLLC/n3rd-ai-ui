# @n3rd-ai/attest

> Drop-in reputation tracer for MCP servers. Three lines. Signed attestations to n3rd.ai.

[![size](https://img.shields.io/badge/size-1.38%20KB-green)](https://bundlephobia.com/package/@n3rd-ai/attest)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## What it does

Every time an MCP tool is called on your server, `@n3rd-ai/attest` emits a signed attestation event to [n3rd.ai](https://n3rd.ai). You get:

- A **public profile** at `n3rd.ai/@you/server-name`
- A **reputation score** (0-100) computed from real usage
- An **embeddable badge** for your README
- Zero impact on your server — events are batched and shipped async

## Install

```bash
npm install @n3rd-ai/attest @n3rd-ai/mcp
```

## Usage

```ts
import { createN3rdServer } from '@n3rd-ai/mcp'
import { attest } from '@n3rd-ai/attest'

createN3rdServer(
  {
    server: { name: 'weather', version: '1.0.0' },
    transport: { type: 'http' },
    observability: { tracer: attest({ apiKey: process.env.N3RD_KEY! }) },
  },
  (mcp) => {
    // register your tools as usual
  },
)
```

That's it. Three lines:

1. `import { attest } from '@n3rd-ai/attest'`
2. Get an API key from [n3rd.ai](https://n3rd.ai)
3. Pass it in `observability.tracer`

## Options

```ts
attest({
  apiKey: 'n3rd_...', // required
  endpoint: 'https://api.n3rd.ai/v1/events', // default
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

Events are batched in memory and shipped as JSON arrays with an HMAC-SHA256 signature in the `X-N3rd-Signature` header.

## Guarantees

- **Never blocks your server.** Batching and delivery are async.
- **Never throws.** `span.end()` is exception-safe even under failure.
- **Never leaks.** Stale events drop on process exit via `beforeExit`.
- **Signed.** Every payload is HMAC-SHA256 with your API key.
- **1.38 KB gzipped.** Your bundle does not notice.

## License

MIT © Superstellar LLC
