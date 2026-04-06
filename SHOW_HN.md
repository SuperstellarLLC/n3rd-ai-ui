# Show HN: n3rd.ai – Reputation scores for MCP servers (like npm quality scores for AI agents)

Hey HN,

There are 5,800+ MCP servers now, and nobody knows which ones are reliable. We built a reputation layer to fix that.

## How it works

1. Add 3 lines to your MCP server (`npm install @n3rd-ai/attest`)
2. Every tool call becomes a signed attestation event (HMAC-SHA256)
3. Your server gets a public profile with a 0-100 reputation score
4. Embed a badge in your README — like shields.io but for MCP trust

## Try it

- **Browse:** https://n3rd.ai/explore (5,800+ servers ranked by score)
- **Try without signup:** https://n3rd.ai/try (API key in 10 seconds, no email)
- **Example profile:** https://n3rd.ai/@anthropic/search

## The score

```
score = 40% uptime + 30% reliability + 20% speed + 10% tool coverage
```

Updated on every tool call. Pre-seeded from public signals (npm downloads, GitHub stars, last commit) for unclaimed servers.

## Tech

- **@n3rd-ai/attest** — 1.38 KB gzipped client. Fire-and-forget. Never blocks your server. Never throws. HMAC-signed.
- **@n3rd-ai/mcp** — 7.33 KB framework we built it on. Open source. ~4% overhead vs raw SDK.
- **Badge** — SVG at `n3rd.ai/@owner/server/badge.svg`. Cached 5 min. Renders in GitHub READMEs.
- **API** — Hono + SQLite. POST events, GET profiles, GET badge. That's it.
- **498 tests** across the monorepo. Security-audited. Benchmarked.

The badge markdown:

```
![n3rd](https://n3rd.ai/@you/server/badge.svg)
```

## Why

We're building this to become the trust layer under every "X for agents" vertical (marketplace, review site, registry). The score is the primitive. The framework, the badge, and the profile page are how we bootstrap the network.

MIT licensed. Monorepo: https://github.com/SuperstellarLLC/n3rd-ai

Would love feedback — especially on what signals you'd want in the score, and whether you'd actually put the badge in your README.
