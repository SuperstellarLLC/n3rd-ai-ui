# Contributing to n3rd.ai

Thanks for your interest in contributing. This is a monorepo built for AI-era infrastructure — small, sharp, and opinionated.

## Repo structure

```
n3rd-ai/
├── packages/
│   ├── ui/                    @n3rd-ai/ui       — terminal UI framework
│   └── mcp/                   @n3rd-ai/mcp      — MCP server framework
├── apps/
│   ├── web/                   @n3rd-ai/web      — n3rd.ai landing page (private)
│   └── agent-stackoverflow/   @n3rd-ai/agent-stackoverflow — vertical MCP app (private)
├── examples/                  Runnable examples (private workspaces)
│   ├── stdio-server/
│   ├── http-server/
│   └── auth-server/
└── .changeset/                Changesets for version management
```

## Prerequisites

- Node.js **22** or newer (20 minimum; CI tests against 20 and 22)
- **pnpm 10.33.0** (pinned via `packageManager` in `package.json` — Corepack will activate it automatically)

## First-time setup

```bash
git clone https://github.com/SuperstellarLLC/n3rd-ai
cd n3rd-ai
pnpm install
pnpm turbo run build test lint typecheck
```

All four commands should succeed on a clean clone. If any fails, please open an issue.

## Development workflow

### Run a single package

```bash
pnpm --filter @n3rd-ai/mcp test
pnpm --filter @n3rd-ai/mcp typecheck
pnpm --filter @n3rd-ai/mcp build
```

### Watch mode

```bash
pnpm dev                              # all packages in watch mode
pnpm --filter @n3rd-ai/mcp dev        # mcp only (tsup --watch)
pnpm --filter @n3rd-ai/web dev        # next dev
```

### Run benchmarks

```bash
pnpm bench
```

### Check bundle sizes

```bash
pnpm size
```

## Adding a new package

1. Create the directory under `packages/` (library) or `apps/` (application)
2. Create a `package.json` with the name `@n3rd-ai/<name>` and `"type": "module"`
3. Internal deps use `workspace:*`
4. Add standard scripts: `build`, `lint`, `typecheck`, `test`, `test:ci` — turbo picks these up automatically via `turbo.json`
5. Extend the root `tsconfig.json` for TypeScript consistency
6. Run `pnpm install` to wire up the workspace

## Testing philosophy

- **Unit tests** cover pure logic (parsers, builders, reducers) — aim for near-100% branch coverage
- **Property-based tests** (`fast-check`) cover invariants — use these for rate limiters, token buckets, anything with math
- **E2E tests** cover protocol-level behavior — the MCP package has full `initialize → tools/list → tools/call → close` round-trips using the real SDK `Client`
- **Coverage thresholds**: 80% across the board for `@n3rd-ai/mcp`, 95%/90%/100%/100% for `@n3rd-ai/web`
- **No mock-heavy tests** — if you're mocking the SDK, you're testing the wrong layer

## Commit style

We use [Conventional Commits](https://www.conventionalcommits.org/) enforced via commitlint. Allowed types:

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `security`

Example: `feat(mcp): add OpenTelemetry tracer integration`

## Pre-commit hooks

Husky runs on every commit:

- `lint-staged`: eslint --fix + prettier on staged files
- `commitlint`: validates the commit message

Don't skip hooks with `--no-verify` unless you have a specific reason.

## Releasing

We use [Changesets](https://github.com/changesets/changesets) for version management.

1. Make your changes on a feature branch
2. Run `pnpm changeset` — select affected packages and bump type (patch/minor/major)
3. Commit the generated `.md` file alongside your changes
4. Open a PR
5. On merge to `main`, the release workflow creates a PR titled "chore(release): version packages". Merging that PR publishes to npm with provenance.

## PR checklist

- [ ] Tests added/updated for the change
- [ ] `pnpm turbo run build test lint typecheck` passes locally
- [ ] Commit messages follow Conventional Commits
- [ ] Changeset added (if the change affects a published package)
- [ ] Docs updated if public API changed
- [ ] No `.env`, secrets, or personal data in the diff

## Security issues

See [SECURITY.md](./SECURITY.md). Please do not open public GitHub issues for vulnerabilities.

## Code of conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
