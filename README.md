# @n3rd-ai/ui

Terminal-first UI framework for Next.js. ASCII everything. Zero images. Pure text.

[![CI](https://github.com/SuperstellarLLC/n3rd-ai-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/SuperstellarLLC/n3rd-ai-ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@n3rd-ai/ui)](https://npmjs.com/package/@n3rd-ai/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@n3rd-ai/ui)](https://bundlephobia.com/package/@n3rd-ai/ui)
[![license](https://img.shields.io/npm/l/@n3rd-ai/ui)](./LICENSE)

```
┌──────────────────────────────────────────────────┐
│  Your product is an API.                         │
│  This gives it a face.                           │
│                                                  │
│  0 images. 0 icon fonts. 0 design decisions.     │
│  Import. Wrap. Ship.                             │
└──────────────────────────────────────────────────┘
```

## Install

```bash
npm install @n3rd-ai/ui
```

## Setup

```tsx
// app/layout.tsx
import { N3rdProvider, N3rdFonts } from '@n3rd-ai/ui'
import '@n3rd-ai/ui/theme/unicorn.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={N3rdFonts.className}>
      <body>
        <N3rdProvider>{children}</N3rdProvider>
      </body>
    </html>
  )
}
```

## Components

```tsx
import { Box, Text, Button, Metric, Badge, Table, Nav } from '@n3rd-ai/ui'
```

### Box

The core primitive. Everything lives in a box.

```tsx
<Box border="single" title="system status" accent="success">
  <Text>All systems operational.</Text>
</Box>

// ┌─ system status ─────────────────┐
// │ All systems operational.         │
// └──────────────────────────────────┘
```

### Button

```tsx
<Button variant="primary">SUBMIT</Button>       // [ SUBMIT ]
<Button variant="danger">DELETE</Button>         // [ DELETE ]
<Button loading>DEPLOYING</Button>               // [ ⠋ DEPLOYING... ]
<Button href="/docs" external>DOCS</Button>      // [ DOCS ↗ ]
```

### Metric

```tsx
<Row>
  <Metric value={99.97} suffix="%" label="uptime" accent="success" />
  <Metric value={42} label="endpoints" />
  <Metric value={1.2} suffix="s" label="avg response" accent="warning" />
</Row>
```

### Table

```tsx
<Table
  columns={['project', 'status', 'score']}
  rows={[
    ['autoallow.com', { text: 'DEPLOYED', accent: 'success' }, '87'],
    ['candlelit.ai', { text: 'BUILDING', accent: 'warning' }, '--'],
  ]}
/>

// ┌─────────────────┬──────────┬───────┐
// │ project         │ status   │ score │
// ├─────────────────┼──────────┼───────┤
// │ autoallow.com   │ DEPLOYED │    87 │
// │ candlelit.ai    │ BUILDING │    -- │
// └─────────────────┴──────────┴───────┘
```

### Toast

```tsx
import { useToast } from '@n3rd-ai/ui/hooks'

const toast = useToast()

toast.success('Deployment complete.') // [✓] Deployment complete.
toast.error('Connection refused.') // [✗] Connection refused.
```

## Themes

Four built-in presets. Switch by importing a different CSS file:

```tsx
import '@n3rd-ai/ui/theme/unicorn.css' // violet → pink → cyan (default)
import '@n3rd-ai/ui/theme/classic.css' // green on black
import '@n3rd-ai/ui/theme/retro.css' // amber on black
import '@n3rd-ai/ui/theme/paper.css' // black on white
```

Override any token:

```css
:root {
  --n3rd-accent-primary: #06b6d4;
  --n3rd-gradient: linear-gradient(90deg, #06b6d4, #22d3ee, #67e8f9);
}
```

## All Components

| Category | Components                                                                | JS        |
| -------- | ------------------------------------------------------------------------- | --------- |
| Layout   | Box, Stack, Row, Grid, Divider, Page                                      | 0kb (RSC) |
| Display  | Text, Heading, Badge, Metric, Table, Code, List, Logo, StatusLine, Footer | 0kb (RSC) |
| Input    | Button, Input                                                             | Client    |
| Feedback | Toast, Alert, Progress, Skeleton                                          | Client    |
| Nav      | Nav                                                                       | Client    |

**Primitives:** Cursor, Typewriter, Scanline

**Hooks:** `useTypewriter`, `useKeyboard`, `useToast`

**Utils:** `drawBox()`, `formatTable()`

## Border Styles

```tsx
<Box border="single">   // ┌──┐
<Box border="double">   // ╔══╗
<Box border="rounded">  // ╭──╮
<Box border="dashed">   // ┌╌╌┐
<Box border="none">     // no border
```

## Bundle Size

```
Server components (Box, Text, Metric, etc.):     0kb JS
Client components (Button, Input, Toast):       ~3-5kb gzipped
Theme CSS:                                      ~2kb gzipped
```

## License

[MIT](./LICENSE) - Superstellar LLC
