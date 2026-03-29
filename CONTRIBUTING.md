# Contributing to @n3rd-ai/ui

Thanks for your interest in contributing. Here's how to get started.

## Development Setup

```bash
git clone https://github.com/SuperstellarLLC/n3rd-ai-ui.git
cd ui
npm install
npm run dev    # watch mode
```

## Workflow

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm run lint && npm run typecheck && npm run test`
4. Ensure `npm run build` succeeds
5. Open a pull request against `main`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Slider component
fix: correct Box border rendering with title
docs: update README installation section
chore: update tsup to v9
refactor: simplify theme token structure
test: add Badge variant tests
perf: reduce CSS bundle size
```

## Code Style

- TypeScript strict mode
- CSS Modules for component styles
- CSS custom properties for theming
- No runtime dependencies (peer deps only)
- Server components where possible (no `'use client'` unless needed)

## Adding a Component

1. Create the component in the appropriate category under `src/components/`
2. Add a CSS Module if needed
3. Export from the category's `index.ts` and from `src/index.ts`
4. Add tests in `tests/`

## Questions?

Open a [Discussion](https://github.com/SuperstellarLLC/n3rd-ai-ui/discussions).
